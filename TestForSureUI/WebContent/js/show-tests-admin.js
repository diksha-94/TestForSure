function showTests(categoryId, subCatId){
	$('#tests').empty();
	console.log("Category id: "+categoryId);
	console.log("Subcategory id: "+subCatId);
	var url = serviceIp+"/test-for-sure/test/get-tests?categoryId="+categoryId+"&subCatId="+subCatId;
	$.ajax({
                url: url,
                type: "GET",
                
                dataType: 'json',
                success: function (result) {
					if(result.status){
						if(result.testDetails != null) {
							console.log(JSON.stringify(result.testDetails));
							$.each(result.testDetails, function(i, test) {
								var btnId = 'btnTest-'+test.id;
								var btnIdPublish = 'publishTest-'+test.id;
								var query_string = 'test_id='+btnId;
								var newTest = "<div style='border:solid 1px red;float:left;width:33%;text-align:center'>"+
												"</br>Test Id: "+test.id+
												"</br>Test title: "+test.testTitle+
												"</br>Number of Questions: "+test.no_of_ques+
												"</br>Time Limit(in mins): "+test.time_limit+
												"</br>Correct Question Marks: "+test.correct_ques_marks+
												"</br>Negative marks: "+test.negative_marks+
												"</br>Test Status (Active): "+test.active+
												"</br><a href='#' id='"+btnId+"' class='btn btn-default'>Show/Update</a>"+
												"</br><a href='#' class='publishTestButton btn btn-default' id='"+btnIdPublish+"' onclick='publishUnpublish(this.id,"+test.active+")'>Publish Test</a>"+
												"</div>";
								$('#tests').append(newTest);
								if(test.active == true){
									$('#'+btnIdPublish).text('Unpublish test');
								}
								else{
									$('#'+btnIdPublish).text('Publish test');
								}
							});
							
						}
					}
					else if(!result.status){
						console.log("Error: "+result.message);
					}
                },
                error: function () {
					console.log("Error in getting test details");
                }
            });
}

//On click of Publish/Unpublish button
function publishUnpublish(id, active){
	console.log("Inside publish/unpublish test: "+id+"------"+active);
	var test_id = (id.split("-"))[1];
	var url;
	if(active == true){
		url = serviceIp+"/test-for-sure/test/unpublish-test?test_id="+test_id;
	}
	else{
		url = serviceIp+"/test-for-sure/test/publish-test?test_id="+test_id;
	}
	$.ajax({
                url: url,
                type: "PUT",
                
                dataType: 'json',
                success: function (result) {
					if(result.status){
						console.log(result.message);
						alert(result.message);
					}
					else if(!result.status){
						console.log("Error: "+result.message);
						alert("Error: "+result.message);
					}
					showTests(0, 0);
                },
                error: function () {
					console.log("Service is unavailable");
					alert("Service is unavailable");
                }
            });
}
//On click of a Start Test button
/*$('input').on('click', function(){
	document.href('start-test.html');
})*/
$(document).ready(function () {
	console.log("Document show-tests is ready");
	
	
	//to get the test details
	         $.ajax({
                url: serviceIp+"/test-for-sure/test/get-category",
                type: "GET",
                
                dataType: 'json',
                success: function (result) {
					if(result.status){
						var categories=[];
						categories.push("<option value='0'>Select</option>");
						$.each(result.categoryList, function(i,cat){
							var newOption = "<option value='"+cat.id+"'> "+cat.category+"</option>";
							categories.push(newOption);
							
						})
						$("#ddCategory").html(categories);
					}
					else if(!result.status){
						console.log("Error: "+result.status);
					}
                },
                error: function () {
					console.log("Error in getting test categories");
                }
            });
			
			//to get the subcategories on change of category
			$("#ddCategory").on('change',function() {
				var categorySelected = $(this).val();
				$('#ddSubcategory').empty();
				console.log("Selected Category: "+categorySelected);
				if(categorySelected == '0'){
					var subcategories=[];
					subcategories.push("<option value='0' selected='selected'>Select</option>");
					$("#ddSubcategory").html(subcategories);
					showTests(categorySelected, $('#ddSubcategory').val());
					
					$("#ddSubcategory").attr("disabled", true);
					
				}
				else{
					$("#ddSubcategory").attr("disabled", false);
				
				$.ajax({
                url: serviceIp+"/test-for-sure/test/get-subcategory?categoryId="+categorySelected,
                type: "GET",
                
                dataType: 'json',
                success: function (result) {
					if(result.success){
						subcategories=[];
						subcategories.push("<option value='0' selected='selected'>Select</option>");
						$.each(result.subcategoryList, function(i,subcat){
							var newOption = "<option value='"+subcat.id+"'> "+subcat.subcategory+"</option>";
							subcategories.push(newOption);
							
						})
						$("#ddSubcategory").html(subcategories);
					}
					else if(!result.status){
						//means 0 records found
						subcategories=[];
						subcategories.push("<option value='0' selected='selected'>Select</option>");
						console.log("Error: "+result.status);
						$("#ddSubcategory").html(subcategories);
					}
					showTests(categorySelected, $('#ddSubcategory').val());
                },
                error: function () {
					console.log("Error in getting test subcategories");
					
                }
            });
			
			//on change of category, tests correspond to that category should only be shown
			//showTests(categorySelected, $('#ddSubcategory').val());
		}
	});
	
	$("#ddSubcategory").on('change',function() {
			showTests($('#ddCategory').val(), $(this).val());
		});
	
			
	//Initially, on page load show all the tests(Select in category and subcategory has value 0)
	showTests(0, 0);
	
	
	
})

