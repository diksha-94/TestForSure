/**
 * VodafoneGermany - Digital Order Project - Framework Contract Extension
 * Hewlett Packard Enterprise
 */

// Handles the getOfferingSpecByAccessType Dispatcher API Business Logic
'use strict'

// call the packages we need
var Q = require('q')
var util = require('util');
var fs = require('fs');
var path = require('path')
var xml2js = require('xml2js');
var js2xmlparser = require("js2xmlparser");
var cache = require('memory-cache');
var traverse = require('traverse');
var logger = require('../../util/logger');
var config = require('../../util/fc-configs');
var Timer = require('../../util/timer');
var fcUtil = require('../../util/fc-dispatcher-util');

var XmlParser = require('../../util/xml-parser');
var RefreshProductCache = require('./RefreshProductCache')
var offerings = require('../../repositories/offerings/offerings')
var ParsePackageSpec = require('../../rules/parse-package-spec');
var ParsePackageSpecCharacteristic = require('../../rules/parse-packagespec-characteristic');
var ParsePackagespecBP4 = require('../../rules/parse-packagespec-bp4');
var MultipleServicescheine = require('../../rules/multiple-servicescheine');
var DeleteTechnicalProduct = require('../../rules/delete-technical-products');

// Constants
const FCE_CACHE = "FCE-CACHE";
const FAIL = "fail";
const SUCCESS = "success";

/**
 * The main function to get Offering Spec by given criteria.
 * 
 * @param req
 * @param res
 * @param done
 * @returns
 */
function getOfferingSpecByAccessType(req, res, done) {
    logger.info("START process /fc/fcengine/getOfferingSpecByAccessType");
    var timer = new Timer("*** [PERF] time taken in getOfferingSpecByAccessType *** ");
    var result;

    try {
        var servicescheine;
        logger.info("Request XML: " + req.rawBody);
        //parse Input XML POST payload data
        var requestPayload = parseRequest2XML(req.rawBody);
        //Validate JSON object of input payload
        var validatedPayloadRes = validatePayload(requestPayload);

        var availDetailList = validatedPayloadRes.availDetailList;
        var discountList = validatedPayloadRes.discountList;
        var packageId = requestPayload.Request.Package;

        if (requestPayload.Request.TariffName && requestPayload.Request.TariffCode) {
            servicescheine = { "active": true, "tariffCode": "", "tariffName": "" };
            servicescheine.tariffCode = requestPayload.Request.TariffCode;
            servicescheine.tariffName = requestPayload.Request.TariffName;
        }

        //Call CS service for getting package Spec
        var fnCSService = Q.denodeify(getPackageSpecFromCS);

        fnCSService(packageId).then(function(csServiceResponse) {
            if (csServiceResponse.status === SUCCESS) {
                if (csServiceResponse.result.includes(packageId)) {
                    logger.debug("Package found!!!");
                    var pkgXML = csServiceResponse.result;

                    //Retrieve cache data
                    var chacheResult = cache.get(FCE_CACHE);
                    if (!chacheResult) {
                        logger.debug("No cache data exists. Calling Refresh Cache Service");
                        var fn = Q.denodeify(RefreshProductCache.refreshProductCache);

                        fn(req, res).then(function(data) {
                            logger.debug("Cache call completed to set data into Cache...");
                            if (data.status === FAIL) {

                                done(null, {
                                    result: data.result
                                });
                            } else {
                                chacheResult = cache.get(FCE_CACHE);
                                var cachedTLimitList = chacheResult.tLimitObj;
                                var components = chacheResult.components;
                                var pkgs = chacheResult.Packages;

                                logger.debug("cachedTLimitList: "+JSON.stringify(cachedTLimitList));
                                logger.debug("components: "+JSON.stringify(components));
                                //logger.debug("pkgs: "+JSON.stringify(pkgs));

                                //Calling process method for evaluating Package Specifications
                                var response = processOfferingSpec(pkgXML, pkgs, packageId, availDetailList, cachedTLimitList, components, servicescheine, discountList);

                                timer.log();
                                done(null, {
                                    result: response.result
                                });
                            }
                        });
                    } else {
                        var cachedTLimitList = chacheResult.tLimitObj;
                        var components = chacheResult.components;
                        var pkgs = chacheResult.Packages;

                        //Calling process method for evaluating Package Specifications
                        var response = processOfferingSpec(pkgXML, pkgs, packageId, availDetailList, cachedTLimitList, components, servicescheine, discountList);

                        timer.log();
                        done(null, {
                            result: response.result
                        });
                    }
                } else {
                    logger.debug("No package found in CS system with given package ID!!");
                    var result = fcUtil.generateError(17, "The specified Package with GUID " + packageId + " cannot be found in catalog.")

                    done(null, {
                        result: result
                    });
                }
            } else {
                logger.debug("CS service call failed!");

                done(null, {
                    result: csServiceResponse.result
                });
            }
        })
    } catch (err) {
        logger.error("Error in GetOfferingSpecByAccessType.getOfferingSpecByAccessType: " + err);
        if (err instanceof Error) {
            result = err.message;
            if (result.includes("FC_Error")) {
                logger.warn("Warn Code: FCE-W-0030");
            } else {
                logger.error("Error Code: FCE-E-0031");
            }
        }

        timer.log();
        done(null, {
            result: result
        });
    }
}

/*******************************************************************************
 * Function to validate Query Param from request
 ******************************************************************************/
function processOfferingSpec(pkgXML, pkgs, packageId, availDetailList, cachedTLimitList, components, servicescheine, discountList) {
    var response = { status: "success", result: null };
    var packageMetadata = {
        "vfpIndependent": false,
        "primaryAccessTypes": [],
        "secondaryAccessTypes": [],
        "primaryTLimits": [],
        "secondaryTLimits": [],
        "validPrimaryComponents": [],
        "validSecondaryComponents": [],
        "componentIds": [],
        "serviceScheine": null,
        "technicalComponents":[],
        "commercialComponents":[]
    };
    packageMetadata.serviceScheine = servicescheine;

    var timer = new Timer("*** [PERF] time taken for XML parsing and filtering *** ");
    try {
        //Get Primary and Secondary Access Type list
        packageMetadata = getPrimarySecondaryAccessTypes(pkgs, packageId, packageMetadata);

        //Get filtered TLimits from Cached TLimits
        var filteredTLimits = getFilteredTLimits(cachedTLimitList, availDetailList, packageMetadata);

        //Get filtered Component/Product IDs
        packageMetadata = getFilteredComponents(packageId, components, packageMetadata, filteredTLimits);

        //multipleServicescheine mode (hard coded so it is always enabled)
        var multipleServicescheine = true;
        logger.debug("The multiple_servicescheine mode is: " + multipleServicescheine)

        response.result = processMultipleServicescheine(packageMetadata, pkgXML);
        

        logger.debug("Criterias to filter Offering Spec: " + JSON.stringify(packageMetadata));
        if (packageMetadata.vfpIndependent && packageMetadata.vfpIndependent === "true") {
            logger.debug("Package is VFP Independent and hence returning the package without applying filter.");
            response.result = processBP4(packageMetadata, discountList, response.result)
        } else {
            response.result = processOfferingSpecPackage(response.result, packageMetadata, availDetailList, discountList);
            response.result = processBP4(packageMetadata, discountList, response.result)
        }

    } catch (err) {
        logger.error("Error in GetOfferingSpecByAccessType.processOfferingSpec: " + err);
        response.status = FAIL;
        if (err instanceof Error) {
            var result = err.message;
            if (result.includes("FC_Error")) {
                logger.warn("Warn Code: FCE-W-0030");
                response.result = result;
            } else {
                response.result = fcUtil.generateError(17, "Processing error occured!")
                logger.error("Error Code: FCE-E-0031");
            }
        }
    }

    timer.log();
    return response;
}

function processMultipleServicescheine(packageMetadata, xml) {
    var outXML;
    var parser = new XmlParser();
    var multipleServicescheine;
    multipleServicescheine = new MultipleServicescheine(parser, packageMetadata);
    
    try {
        parser.emit = function(tag, ctx) {
            this.scanAttr(tag);
            multipleServicescheine.emit(tag, ctx);
        }

        parser.parse(xml); //parse Package Spec XML
        parser.parse(null); //Indicate end of parsing
        outXML = parser.outXML;
    } catch (err) {
        throw new Error(fcUtil.generateError(17, "XML parsing error occured"));
    }

    return outXML;
}

/*******************************************************************************
 * Function to process/parse SOAP body and validate the request
 ******************************************************************************/
function parseRequest2XML(rawXmlData) {
    var xmlReq;
    if (!rawXmlData) {
        throw new Error(fcUtil.generateError(16, "Syntax error in request input: Invalid XML message!"));
    }

    // Parse input SOAP XML
    var parser = new xml2js.Parser({
        explicitArray: false
    });

    parser.parseString(rawXmlData, function(err, result) {
        if (err) {
            throw new Error(fcUtil.generateError(16, "Syntax error in request input: Invalid XML message! " + err.message));
        } else {
            xmlReq = result;
        }
    });

    return xmlReq;
}

/*******************************************************************************
 * Function to process/parse SOAP body and validate the request
 ******************************************************************************/
function validatePayload(requestPayloadJSON) {
    var validatedPayloadRes = {};
    var availDetailList;
    var discountList;
    var packageId;

    try {
        requestPayloadJSON['Request'];
        packageId = requestPayloadJSON['Request']['Package'];
        availDetailList = requestPayloadJSON['Request']['AvailabilityList']['Availability'];
        discountList = requestPayloadJSON['Request']['DiscountList']['Discount'];
    } catch (err) {
        //No Avalilability element present so assign empty array
        availDetailList = [];
        discountList = [];

    }
    if (!("AvailabilityList" in requestPayloadJSON.Request)) {
        throw new Error(fcUtil.generateError(16, "Syntax error in request input: Invalid XML message! AvailabilityList element missing"));
    }
    if (!("DiscountList" in requestPayloadJSON.Request)) {
        throw new Error(fcUtil.generateError(16, "Syntax error in request input: Invalid XML message! DiscountList element missing"));
    }

    if (!packageId || packageId === "") {
        throw new Error(fcUtil.generateError(16, "Syntax error in request input: Invalid Query parameter or no package ID specified!"));
    }

    if (requestPayloadJSON.Request.TariffName && !requestPayloadJSON.Request.TariffCode) {
        throw new Error(fcUtil.generateError(16, "Syntax error in request input: TariffCode is missing while TariffName is present!"));
    }

    if (requestPayloadJSON.Request.TariffCode && !requestPayloadJSON.Request.TariffName) {
        throw new Error(fcUtil.generateError(16, "Syntax error in request input: TariffName is missing while TariffCode is present!"));
    }

    if (availDetailList && !Array.isArray(availDetailList)) {
        var availList = [];
        availList.push(availDetailList);
        availDetailList = availList
    }
    if (discountList && !Array.isArray(discountList)) {
        var discList = [];
        discList.push(discountList);
        discountList = discList
    }

    if (availDetailList && availDetailList.length > 0) {

        availDetailList.forEach(function(avail) {

            if (!avail.AccessType || avail.AccessType === "") {
                throw new Error(fcUtil.generateError(16, "Syntax error in request input: Invalid XML message! AccessType is missing/empty."));
            }

            if (!avail.MaxBandwidth || isNaN(avail.MaxBandwidth)) {
                throw new Error(fcUtil.generateError(16, "Syntax error in request input: Invalid XML message! MaxBandwidth is missing/not a number"));
            }

            if (avail.MaxVoiceChannels) {

                if (isNaN(avail.MaxVoiceChannels)) {
                    throw new Error(fcUtil.generateError(16, "Syntax error in request input: Invalid XML message! MaxVoiceChannels is missing/not a number"));
                }
            }
        })
    }

    if (discountList && discountList.length > 0) {

        discountList.forEach(function(discount) {

            if (!discount.CCBTarifcode || discount.CCBTarifcode === "") {
                throw new Error(fcUtil.generateError(16, "Syntax error in request input: Invalid XML message! CCBTarifcode is missing/empty."));
            }

            if (!discount.CCBProductCode || discount.CCBProductCode === "") {
                throw new Error(fcUtil.generateError(16, "Syntax error in request input: Invalid XML message! CCBProductCode is missing/empty."));
            }

            if (!discount.DiscountValue || isNaN(discount.DiscountValue)) {
                throw new Error(fcUtil.generateError(16, "Syntax error in request input: Invalid XML message! DiscountValue is missing/not a number"));
            }
        })
    }

    validatedPayloadRes.availDetailList = availDetailList;
    validatedPayloadRes.discountList = discountList;
    return validatedPayloadRes;
}

/*******************************************************************************
 * Function to get filtered components by user user input
 ******************************************************************************/
/*function getFilteredComponents(packageId, components, packageMetadata, filteredTLimits) {
	logger.info("PackageId: "+packageId);
	components.forEach(function(component) {
        if (component.primaryName && component.tLimits && component.tLimits.length > 0 && component.arrayOfOfferings && (component.arrayOfOfferings).indexOf(packageId) > -1) {
            logger.debug("Components with VFP Dependant element: " + JSON.stringify(component))
            packageMetadata.componentIds.push(component.ID);
        }

        filteredTLimits.forEach(function(tLimit) {
            if (component.tLimits && (component.tLimits).indexOf(tLimit) > -1 && component.arrayOfOfferings && (component.arrayOfOfferings).indexOf(packageId) > -1) {

                if (component.primaryName === "true" && (packageMetadata.primaryTLimits).indexOf(tLimit) > -1) {
                    packageMetadata.validPrimaryComponents.push(component.ID);
                } else if (component.primaryName === "false" && (packageMetadata.secondaryTLimits).indexOf(tLimit) > -1) {
                    packageMetadata.validSecondaryComponents.push(component.ID);
                }
            }
        })
    })

    return packageMetadata;
}*/

function getFilteredComponents(packageId, components, packageMetadata, filteredTLimits) {
	logger.info("PackageId: "+packageId);
	logger.info("Filtered tLimits: "+JSON.stringify(filteredTLimits));
	var primaryTLimitsKeys;
	console.log("packageMetadata.primaryTLimits: "+JSON.stringify(packageMetadata.primaryTLimits));
	if(packageMetadata.primaryTLimits){
		primaryTLimitsKeys = Object.keys(packageMetadata.primaryTLimits);
	}
	console.log("primaryTLimitsKeys: "+primaryTLimitsKeys);
	console.log("primaryTLimitsKeys JSON: "+JSON.stringify(primaryTLimitsKeys));
	components.forEach(function(component) {
		 if (component.primaryName && component.tLimits && component.tLimits.length > 0) {
	         logger.debug("Components with VFP Dependant element: " + JSON.stringify(component))
	         packageMetadata.componentIds.push(component.ID);
	     }
		 
		 if(component.tLimits){
			 (component.tLimits).forEach(function(tLimits){
				 //to differntiate between commercial and technical components implementation
				 (filteredTLimits).forEach(function(filteredTLimit){
					 //console.log("filtered Tlimit: "+JSON.stringify(filteredTLimit));
					 //var obj = filteredTLimit;
					 var key = Object.keys(filteredTLimit)[0];
					 var value = filteredTLimit[key];
					 //console.log("Key: "+key);
					 //console.log("Value: "+value);
					 if(((component.TechnicalOrCommercialQualifier == "false" || !component.TechnicalOrCommercialQualifier) && tLimits.value == key) || (component.TechnicalOrCommercialQualifier == "true"  && tLimits.value == key && value == "exactMatch") && tLimits.arrayOfOfferings){
						 console.log("Inside if: "+JSON.stringify(component.TechnicalOrCommercialQualifier));
						 if((tLimits.arrayOfOfferings).includes(packageId)){
							 //Add this component to the valid component list(primary/secondary)
							 if (component.primaryName === "true" && (packageMetadata.primaryTLimits).indexOf(tLimits.value) > -1) {
	 							if((packageMetadata.validPrimaryComponents).includes(component.ID)){}
	 							else{
	 								packageMetadata.validPrimaryComponents.push(component.ID);
	 							}
	 		                  } else if (component.primaryName === "false" && (packageMetadata.secondaryTLimits).indexOf(tLimits.value) > -1) {
	 		                	  if((packageMetadata.validSecondaryComponents).includes(component.ID)){}
	 		                	  else{
	 								packageMetadata.validSecondaryComponents.push(component.ID);
	 		                	  }
	 		                  }
						   }
					   }
				 })
			  })
		   }
      })
    
    return packageMetadata;
}

/*******************************************************************************
 * Function to get filtered TLimts from cache by user input
 ******************************************************************************/
function getFilteredTLimits(cachedTLimits, jsonPackageSpecFilter, packageMetadata) {
    var filteredTLimits = [];

    if (!cachedTLimits) {
        throw new Error(fcUtil.generateError(17, "Processing error occured! No access types available in package."));
    }

    if (jsonPackageSpecFilter && jsonPackageSpecFilter.length > 0) {
        jsonPackageSpecFilter.forEach(function(spec) {
            var isPrimaryAccessType = false;
            var isSecondaryAccessType = false;

            if ((packageMetadata.primaryAccessTypes).indexOf(spec.AccessType) > -1) {
                isPrimaryAccessType = true;
            }
            if ((packageMetadata.secondaryAccessTypes).indexOf(spec.AccessType) > -1) {
                isSecondaryAccessType = true;
            }


            if ((isPrimaryAccessType || isSecondaryAccessType) && cachedTLimits[spec.AccessType]) {
                var bandwidths = cachedTLimits[spec.AccessType]["bandwidths"];

                bandwidths.forEach(function(bandwidth) {
                    var bandwidthValue = parseInt(Object.keys(bandwidth)[0]);
                    var maxBandwidth = parseInt(spec.MaxBandwidth);

                    if (maxBandwidth >= bandwidthValue) {
                        var voiceChannels = bandwidth[Object.keys(bandwidth)[0]]["voiceChannels"];

                        voiceChannels.forEach(function(voiceChannel) {
                            var maxChannelValue = 0;

                            if (spec.MaxVoiceChannels && spec.MaxVoiceChannels > 0) {
                                maxChannelValue = parseInt(spec.MaxVoiceChannels);
                            }

                            if (maxChannelValue >= voiceChannel) {
                            	var obj = {};
                            	var tLimit = spec.AccessType + "|" + bandwidthValue + "|" + voiceChannel;
                            	if(bandwidthValue == maxBandwidth){
                            		//means exact match of bandwidth
                            		obj[tLimit] = "exactMatch";
                            	}
                            	else{
                            		//means no exact match of bandwidth
                            		obj[tLimit] = "noExactMatch";
                            	}
                                filteredTLimits.push(obj);
                                if (isPrimaryAccessType) {
                                    packageMetadata.primaryTLimits.push(Object.keys(obj)[0]);
                                }
                                if (isSecondaryAccessType) {
                                    packageMetadata.secondaryTLimits.push(Object.keys(obj)[0]);
                                }
                            }
                        })
                    }
                })
            }
        })
    }

    logger.debug("filteredTLimits: " + JSON.stringify(filteredTLimits));
    return filteredTLimits;
}

/*******************************************************************************
 * Function to parse Package XML to filter out the required data as per request 
 ******************************************************************************/
function processOfferingSpecPackage(pkgXML, packageMetadata, availDetailList, discountList) {
    var outXML;
    var parser = new XmlParser();
    var parsePackageSpec = new ParsePackageSpec(parser, packageMetadata, availDetailList);

    try {
        parser.emit = function(tag, ctx) {
            this.scanAttr(tag);
            parsePackageSpec.emit(tag, ctx);
        }

        parser.parse(pkgXML); //parse Package Spec XML
        parser.parse(null); //Indicate end of parsing
        outXML = parser.outXML;
        console.log("Finished xml parsing");
        console.log("Package Metadata: "+JSON.stringify(packageMetadata));
    } catch (err) {
        logger.error("XML parsing error occured in processOfferingSpecPackage: " + err);
        logger.error("Error Code : FCE-E-0031");
        if ((err instanceof Error) && err.message && (err.message).includes("FC_Error")) {
            throw err;
        } else {
            throw new Error(fcUtil.generateError(17, "XML parsing error occured"));
        }
    }

    //Step-11 & 12
    var maxPriority = -1;
    if(packageMetadata.commercialComponents && (packageMetadata.commercialComponents).length>0){
    	//Determine commercial component with highest priority
    	 (packageMetadata.commercialComponents).forEach(function(commercialComp){
    		if(commercialComp.priority && commercialComp.priority>maxPriority){
    			console.log("Inside if");
    			maxPriority = commercialComp.priority;
    		}
    		else if(!commercialComp.priority){
    			console.log("Inside else");
    			throw new Error(fcUtil.generateError(34, "Bandwidth priority not defined for Component. Component GUID: "+commercialComp.id));
    		}
    	 })
    	 logger.debug("Max priority of Commercial component: "+maxPriority);
    	 //find out all the technical products id which needs to be deleted
    	 var technicalProducts = [];
    	 (packageMetadata.technicalComponents).forEach(function(technicalComp){
     		if(technicalComp.priority && parseInt(technicalComp.priority)<=parseInt(maxPriority)){
     			technicalProducts.push(technicalComp.id);
     		}
     		else if(!technicalComp.priority){
     			throw new Error(fcUtil.generateError(34, "Bandwidth priority not defined for Component. Component GUID: "+technicalComp.id));
     		}
     	 })
    	 //Delete technical products with priority less than or equal to highest priority of commercial product
    	 outXML = deleteTechnicalProducts(outXML, technicalProducts, packageMetadata);
    	 
    	 //Step-12 start
    	 if(packageMetadata.technicalComponents && (packageMetadata.technicalComponents).length>1){
    		 var maxTechnicalPriority = -1;
    		//Determine technical component with highest priority
        	 (packageMetadata.technicalComponents).forEach(function(technicalComp){
        		if(technicalComp.priority && technicalComp.priority > maxTechnicalPriority){
        			console.log("Inside if");
        			maxTechnicalPriority = technicalComp.priority;
        		}
        		else if(!technicalComp.priority){
        			console.log("Inside else");
        			throw new Error(fcUtil.generateError(34, "Bandwidth priority not defined for Component. Component GUID: "+technicalComp.id));
        		}
        	 })
        	 technicalProducts = [];
        	 (packageMetadata.technicalComponents).forEach(function(technicalComp){
        		 if(technicalComp.priority && parseInt(technicalComp.priority)<parseInt(maxPriority)){
        			 technicalProducts.push(technicalComp.id);
        		 }
        		 else if(!technicalComp.priority){
        			 throw new Error(fcUtil.generateError(34, "Bandwidth priority not defined for Component. Component GUID: "+technicalComp.id));
        		 }
        	 })
        	 //Delete technical products with priority less than the highest priority of technical product
        	 outXML = deleteTechnicalProducts(outXML, technicalProducts, packageMetadata);
         }
    }
    
    
    var parser1 = new XmlParser();
    var parsePackageSpecCharacteristic = new ParsePackageSpecCharacteristic(parser1, packageMetadata, availDetailList);

    try {
        parser1.emit = function(tag, ctx) {
            this.scanAttr(tag);
            parsePackageSpecCharacteristic.emit(tag, ctx);
        }

        parser1.parse(outXML); //parse Package Spec XML
        parser1.parse(null); //Indicate end of parsing
        outXML = parser1.outXML;
    } catch (err) {
        logger.error("XML parsing error occured in processOfferingSpecPackage: " + err);
        logger.error("Error Code : FCE-E-0031");
        if ((err instanceof Error) && err.message && (err.message).includes("FC_Error")) {
            throw err;
        } else {
            throw new Error(fcUtil.generateError(17, "XML parsing error occured"));
        }
    }


    return outXML;
}

function processBP4(packageMetadata, discountList, xml) {
    var outXML;
    logger.debug("start executing BP4 " + discountList)
    try {
        var parser = new XmlParser();
        var parsePackagespecBP4 = new ParsePackagespecBP4(parser, packageMetadata, discountList);

        parser.emit = function(tag, ctx) {
            this.scanAttr(tag);
            parsePackagespecBP4.emit(tag, ctx);
        }
        parser.parse(xml); //parse Package Spec XML
        parser.parse(null); //Indicate end of parsing
        outXML = parser.outXML;
    } catch (err) {
        logger.error("XML parsing error occured in processOfferingSpecPackage: " + err);
        logger.error("Error Code : FCE-E-0031");
        if ((err instanceof Error) && err.message && (err.message).includes("FC_Error")) {
            throw err;
        } else {
            throw new Error(fcUtil.generateError(17, "XML parsing error occured"));
        }
    }

    return outXML;
}

//Function to delete all Technical products when VFP_Independent is true
function deleteTechnicalProducts(xml, technicalProducts, packageMetadata) {
	//logger.debug("xml data: "+JSON.stringify(xml));
	var outXML;
    logger.debug("Start deleting technical products")
    try {
        var parser = new XmlParser();
        var deleteTechnicalProducts = new DeleteTechnicalProduct(parser, technicalProducts, packageMetadata);

        parser.emit = function(tag, ctx) {
            this.scanAttr(tag);
            deleteTechnicalProducts.emit(tag, ctx);
        }
        parser.parse(xml); //parse Package Spec XML
        parser.parse(null); //Indicate end of parsing
        outXML = parser.outXML;
    } catch (err) {
        logger.error("XML parsing error occured in delete technical Products: " + err);
        logger.error("Error Code : FCE-E-0031");
        if ((err instanceof Error) && err.message && (err.message).includes("FC_Error")) {
            throw err;
        } else {
            throw new Error(fcUtil.generateError(17, "XML parsing error occured"));
        }
    }

    return outXML;
}

/*******************************************************************************
 * Function to prepare Primary and Secondary AccessTypes
 ******************************************************************************/
function getPrimarySecondaryAccessTypes(pkgs, packageId, packageMetadata) {
    var isPackageFound = false;

    if (!pkgs || !Array.isArray(pkgs)) {
        throw new Error(fcUtil.generateError(17, "Processing error occured! No package data available."));
    }

    for (var i = 0; i < pkgs.length; i++) {
        if (pkgs[i].id === packageId) {
            //logger.debug("Package data: "+ JSON.stringify(pkgs[i]));
            isPackageFound = true;

            //Collect information from cached package
            packageMetadata.vfpIndependent = pkgs[i].vfp_independent;
            if (pkgs[i].classifications && pkgs[i].classifications.Fixed_Net_Decision_Tree_Classification) {
                var classficationList = pkgs[i].classifications.Fixed_Net_Decision_Tree_Classification;
                //logger.debug("Tariff Fixed_Net_Decision_Tree_Classification: "+ JSON.stringify(classficationList));
                classficationList.forEach(function(data) {
                    if (data && data.parent && data.parent.name === "Dienst / Nutzungsart") {
                        if (data.nameValue && data.nameValue === "Voice and Internet") {
                            packageMetadata.tariffVoiceInternate = true;
                        }
                        if (data.nameValue && data.nameValue === "Voice") {
                            packageMetadata.tariffVoice = true;
                        }
                        if (data.nameValue && data.nameValue === "Internet") {
                            packageMetadata.tariffInternate = true;
                        }
                    }
                })
            }

            if (pkgs[i].primaryAccessTypes && pkgs[i].primaryAccessTypes.length > 0) {
                packageMetadata.primaryAccessTypes = pkgs[i].primaryAccessTypes;
            }
            if (pkgs[i].secondaryAccessTypes && pkgs[i].secondaryAccessTypes.length > 0) {
                packageMetadata.secondaryAccessTypes = pkgs[i].secondaryAccessTypes;
            }
            break;
        }
    }

    if (!isPackageFound) {
        throw new Error(fcUtil.generateError(17, "Processing error occured! No package found with given package ID"));
    }
    //logger.debug("packageMetadata after getPrimarySecondaryAccessTypes: "+ JSON.stringify(packageMetadata) );
    return packageMetadata;
}

/*******************************************************************************
 * Function to replace place-holders of TARIFF_CODE_PLACEHOLDER and TARIFF_NAME_PLACEHOLDER 
 * with TariffName and TariffCode
 ******************************************************************************/
function replacePlaceHolders(pkgXML, servicescheine) {
    pkgXML = pkgXML.replace(/TARIFF_NAME_PLACEHOLDER/g, servicescheine.tariffName);
    pkgXML = pkgXML.replace(/TARIFF_CODE_PLACEHOLDER/g, servicescheine.tariffCode);
    return pkgXML;
}

/*******************************************************************************
 * Function to call CS service for getting package spec  
 ******************************************************************************/
function getPackageSpecFromCS(packageId, done) {
    var timer = new Timer("*** [PERF] time taken for CS call for getting Package Specifications *** ");
    config.catalogue_services.order = ["SigmaCS"];

    //Get all Package spec from CS 
    //
    var sigmaURL = 'Specification/QueryWithXpath?q=/Package[@ID=%27' + packageId + '%27]&XsltCode=FCE_FF_01';
    //var sigmaURL = 'entities(' + packageId + ')';
    var promise = offerings.get(sigmaURL)

    promise.then(function(data) {
        getResponse(data.result, "success", done);
        timer.log();
    }).catch(function(err) {
        logger.error(err);
        logger.error("Error Code : FCE-E-0031");
        var result = fcUtil.generateError(18, "The Catalog Services(CS) cannot be accessed: " + err);
        getResponse(result, "fail", done)
    })
}

//creates the respose.
function getResponse(result, status, done) {
    done(null, {
        result: result,
        status: status
    })
}

module.exports = {
    getOfferingSpecByAccessType: getOfferingSpecByAccessType,
    parseRequest2XML: parseRequest2XML,
    validatePayload: validatePayload,
    getPackageSpecFromCS: getPackageSpecFromCS,
    getPrimarySecondaryAccessTypes: getPrimarySecondaryAccessTypes,
    getFilteredTLimits: getFilteredTLimits,
    getFilteredComponents: getFilteredComponents,
    processOfferingSpecPackage: processOfferingSpecPackage,
    replacePlaceHolders: replacePlaceHolders,
    processMultipleServicescheine: processMultipleServicescheine,
    processOfferingSpec: processOfferingSpec
}
