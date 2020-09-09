var testController = function(){
	this.id = -1;
	this.currentPage = 1;
	this.fromSearch = false;
};
testController.prototype.Init = function()
{
};
testController.prototype.AddEdit = function()
{
	$('#testDetailsModal').modal('show');
	$('#testDetailsModal').find('.ddTestExam').remove();
	$('#testDetailsModal').find('.ddRelatedTests').remove();
	summernoteController.getObj().addEditor('#txtTestInstructions');
	RefreshData('testDetailsModal');
	if(this.id > 0){
		this.Edit();
	}
	else{
		new AutoComplete('ddTestExam', 'exams');
		new AutoComplete('ddRelatedTests', 'tests');
	}
	$('#testDetailsModal').find('#btnTestDetailsSave').unbind().bind('click', function(){
		this.SaveData();
	}.bind(this));
	$('#testDetailsModal').find('#chkTestLock').unbind().bind('change', function(e){
		var lockValue = $(e.currentTarget).prop('checked');
		if(lockValue == true){
			$('#txtTestLockPoints').removeClass('lockDetails');
			$('#txtTestLockRupees').removeClass('lockDetails');
		}
		else if(lockValue == false){
			$('#txtTestLockPoints').addClass('lockDetails');
			$('#txtTestLockRupees').addClass('lockDetails');
		}
	});
};
testController.prototype.Delete = function()
{
	$('#deleteTestModal').modal('show');
	$('#deleteTestModal').find('.modal-body').find('p').find('span').text(this.id+" ?");
	$('#deleteTestModal').find('#btnDeleteYes').unbind().bind('click', function(){
		this.DeleteItem();
	}.bind(this));
};
testController.prototype.SaveData = function(openNext, callback)
{
	if(typeof openNext == 'undefined'){
		openNext = true;
	}
	console.log('Saving (Add/Update) Test');
	var name = $('#txtTestName').val();
	var title = $('#txtTestTitle').val();
	var displayIndex = $('#txtTestIndex').val();
	var questions = $('#txtTestQuestions').val();
	var time = $('#txtTestTime').val();
	var marks = parseFloat($('#txtTestMarks').val()) * parseInt(questions);
	var allowedAttempts = $('#txtTestAttempts').val();
	var publish = $('#chkTestPublish').prop('checked') == true ? 1 : 0;
	var maxRewardPoints = $('#testDetailsModal').find('#txtRewardPoints').val();
	var exams = GetSelectedValues('ddTestExam');
	var lock = ($('#chkTestLock').prop('checked') == true) ? 1 : 0;
	var lockPoints = (typeof $('#txtTestLockPoints').val() != 'undefined') ? $('#txtTestLockPoints').val() : 0;
	var lockRupees = (typeof $('#txtTestLockRupees').val() != 'undefined') ? $('#txtTestLockRupees').val() : 0;
	var negativeMarks = $('#txtTestNegative').val();
	var passPercent = $('#txtPassPer').val();
	var shuffleQues = $('#chkShuffleQues').prop('checked') == true ? 1 : 0;
	var shuffleOptions = $('#chkShuffleOptions').prop('checked') == true ? 1 : 0;
	var suggestedTest = GetSelectedValues('ddRelatedTests');
	var suggestedTests = [];
	for(var t in suggestedTest){
		var obj = {};
		obj.id = suggestedTest[t];
		obj.title = "";
		suggestedTests.push(obj);
	}
	
	var instructions = summernoteController.getObj().getValue('#txtTestInstructions');
	
	if(name.length == 0 || title.length == 0 || questions.lenght == 0 || time.length == 0 || marks.length == 0 ||
			allowedAttempts.length == 0 || negativeMarks.length == 0 || passPercent.length == 0){
		alert('Please enter all the mandatory fields');
		return;
	}
	//Manage sections
	var totalQues = 0;
	var totalTime = 0;
	var sectionDetails = [];
	var allSections = $('#testDetailsModal').find('.sectionDetails').find('.section');
	for(var i = 0; i<allSections.length; i++){
		var section = allSections[i];
		if($(section).find('.txtSectionName').val().length == 0 || $(section).find('.txtSectionQues').val().length == 0 || $(section).find('.txtSectionTime').val().length == 0){
			alert('Please enter all the section details or remove the section');
			return;
		}
		var obj = {};
		obj.name = $(section).find('.txtSectionName').val();
		obj.questions = $(section).find('.txtSectionQues').val();
		totalQues += parseInt(obj.questions);
		obj.time = $(section).find('.txtSectionTime').val();
		totalTime += parseInt(obj.time);
		sectionDetails.push(obj);
	}
	if(allSections.length > 0 && parseInt(questions) != parseInt(totalQues)){
		alert('Total of questions in section should be equal to the the total number of questions');
		return false;
	}
	if(allSections.length > 0 && parseInt(time) != parseInt(totalTime)){
		alert('Total of time in section should be equal to the the total time');
		return false;
	}
	var url = remoteServer+'/test2bsure/test';
	var type = 'POST';
	var requestData = {
			'name': name,
			'title': title,
			'displayIndex': displayIndex,
			'noOfSections': sectionDetails.length,
			'sectionDetails': JSON.stringify(sectionDetails),
			'totalQues': questions,
			'totalMarks': marks,
			'totalTime': time,
			'noOfAttempts': allowedAttempts,
			'exams': exams,
			'active': 1,
			'publish': publish,
			'maxRewardPoints': maxRewardPoints,
			'lockApply': lock,
			'lockPoints': lockPoints,
			'lockRupees': lockRupees,
			'negativeMarks' : negativeMarks,
			'passPercent' : passPercent,
			'shuffleQues' : shuffleQues,
			'shuffleOptions' : shuffleOptions,
			'suggestedTests' : suggestedTests,
			'instructions' : instructions
		};
	if(this.id > 0){
		requestData.id = this.id;
		type = 'PUT';
	}
	console.log('Call to save test');
	$.ajax({
		url: url,
		type: type,
		data: JSON.stringify(requestData),
		contentType: "application/json",
		success: function(response){
			if(response.status == true){
				this.id = response.message;
				if(openNext == true){
					$('#testQuesModal').modal('show');
					this.BindQuestionCategoryEvents();
					$('#testQuesModal').find('#btnTestFinish').unbind().bind('click', function(){
						//Check the no. of ques added and entered are same or not
						//if not same, update the total no. of questions in details as per the no. of questions added
						var entered = $('#testDetailsModal').find('#txtTestQuestions').val();
						var added = $('#testQuesModal').find('.divCountQuesTest').find('span.noOfQues').text();
						if(parseInt(entered) != parseInt(added)){
							alert("Please add all the questions and finish.");
							return;
							$('#updateQuesModal').modal('show');
							$('#updateQuesModal').find('#btnUpdateYes').unbind().bind('click', function(){
								$('#updateQuesModal').modal('hide');
								$('#testDetailsModal').find('#txtTestQuestions').val(added);
								this.SaveData(false, function(){
									$('#testQuesModal').modal('hide');
									$('#testDetailsModal').modal('hide');
									$('.menu-tabs').find('li[class="active"]').find('a').click();
								});
							}.bind(this));
						}
						else{
							$('#testQuesModal').modal('hide');
							$('#testDetailsModal').modal('hide');
							$('.menu-tabs').find('li[class="active"]').find('a').click();
						}
					}.bind(this));
					this.HandleTestQuestions();
				}
				else{
					if(typeof callback != 'undefined'){
						callback();
					}
				}
			}
			else{
				alert(response.message);
			}
		}.bind(this),
		error: function(e){
			console.log(e);
		}
	});
};

testController.prototype.DeleteItem = function()
{
	$.ajax({
		url: remoteServer+"/test2bsure/test?id="+this.id,
		type: 'DELETE',
		
		success: function(response){
			if(response.status == true){
				$('#deleteTestModal').modal('hide');
				$('.menu-tabs').find('li[class="active"]').find('a').click();
			}
		},
		error: function(e){
			alert(e);
		}
	});
};
testController.prototype.Edit = function(e)
{
	$.ajax({
		url: remoteServer + "/test2bsure/test?id=" + this.id,
		type: 'GET',
		success: function(response){
			if(response.result.status == true){
				if(response.data != null && response.data.length > 0){
					var item = response.data[0];
					$('#testDetailsModal').find('#txtTestName').val(item.name);
					$('#testDetailsModal').find('#txtTestTitle').val(item.title);
					$('#testDetailsModal').find('#txtTestIndex').val(item.displayIndex);
					$('#testDetailsModal').find('#txtTestQuestions').val(item.totalQues);
					$('#testDetailsModal').find('#txtTestTime').val(item.totalTime);
					$('#testDetailsModal').find('#txtTestMarks').val(item.totalMarks/item.totalQues);
					$('#testDetailsModal').find('#txtTestNegative').val(item.negativeMarks);
					$('#testDetailsModal').find('#txtPassPer').val(item.passPercent);
					$('#testDetailsModal').find('#txtTestAttempts').val(item.noOfAttempts);
					var shuffleQuesStatus = false;
					if(item.shuffleQues == 1){
						shuffleQuesStatus = true;
					}
					$('#testDetailsModal').find('#chkShuffleQues').prop('checked', shuffleQuesStatus);
					
					var shuffleOptionsStatus = false;
					if(item.shuffleOptions == 1){
						shuffleOptionsStatus = true;
					}
					$('#testDetailsModal').find('#chkShuffleOptions').prop('checked', shuffleOptionsStatus);
					
					var testStatus = false;
					if(item.publish == 1){
						testStatus = true;
					}
					$('#testDetailsModal').find('#chkTestPublish').prop('checked', testStatus);
					$('#testDetailsModal').find('#txtRewardPoints').val(item.maxRewardPoints);
					var lockStatus = false;
					if(item.lockApply == 1){
						lockStatus = true;
						$('#txtTestLockPoints').removeClass('lockDetails');
						$('#txtTestLockRupees').removeClass('lockDetails');
						$('#txtTestLockPoints').val(item.lockPoints);
						$('#txtTestLockRupees').val(item.lockRupees);
					}
					else if(item.lockApply == 0){
						lockStatus = false;
						$('#txtTestLockPoints').addClass('lockDetails');
						$('#txtTestLockRupees').addClass('lockDetails');
					}
					$('#testDetailsModal').find('#chkTestLock').prop('checked', lockStatus);
					$('#testDetailsModal').find('#ddTestExam').val('');
					if(item.exams != null && item.exams.length > 0){
						var data = {};
						for(var exam in item.exams){
							data[item.exams[exam]] = item.exams[exam];
							//data[item.exams[exam]].id = item.exams[exam];
						}
						getExamTitle(Object.keys(data), function(response){
							console.log(response);
							for(var r in response){
								data[response[r]["id"]] = {
										"id": response[r]["id"],
										"title": response[r]["title"]
								};
							}
							new AutoComplete('ddTestExam', 'exams').SetSelectedValues('ddTestExam', data);
						});
					}
					else{
						new AutoComplete('ddTestExam', 'exams');
					}
					summernoteController.getObj().setValue('#txtTestInstructions', item.instructions);
					if(item.suggestedTests != null && item.suggestedTests.length > 0){
						new AutoComplete('ddRelatedTests', 'tests').SetSelectedValues('ddRelatedTests', item.suggestedTests);
					}
					else{
						new AutoComplete('ddRelatedTests', 'tests');
					}
				}
			}
			
		}.bind(this),
		error: function(e){
			console.log(e);
		}
	});
};
//Not Used
testController.prototype.AddSection = function()
{
	var html = '<div class="section" section-id="'+this.sectionCount+'" style="height:auto;border:solid 1px white;">'+
			   		'<div>'+
			   			'<button type="button" section-id="'+this.sectionCount+'" class="btnRemoveSection btn btn-danger col-xs-offset-2 col-sm-offset-2 col-md-offset-2 '+
			   				'col-lg-offset-2 col-xs-1 col-sm-1 col-md-1 col-lg-1">Remove</button>'+
						'<span class="col-xs-2 col-sm-2 col-md-2 col-lg-2">Name<span class="red">*</span></span>'+
				   		'<span class="col-xs-offset-1 col-sm-offset-1 col-md-offset-1 col-lg-offset-1 '+
				   			'col-xs-2 col-sm-2 col-md-2 col-lg-2">Questions<span class="red">*</span></span>'+
				   		'<span class="col-xs-offset-1 col-sm-offset-1 col-md-offset-1 col-lg-offset-1 '+
				   			'col-xs-2 col-sm-2 col-md-2 col-lg-2">Time<span class="red">*</span></span>'+
				   	'</div>'+
				   	'<div>'+
						'<input type="text" class="txtSectionName '+
				   			'col-xs-2 col-sm-2 col-md-2 col-lg-2 txtSectionName-'+this.sectionCount+'"/>'+
				   		'<input type="number" class="txtSectionQues col-xs-offset-1 col-sm-offset-1 col-md-offset-1 col-lg-offset-1 '+
				   			'col-xs-2 col-sm-2 col-md-2 col-lg-2 txtSectionQues-'+this.sectionCount+'"/>'+
				   		'<input type="number" class="txtSectionTime col-xs-offset-1 col-sm-offset-1 col-md-offset-1 col-lg-offset-1 '+
				   			'col-xs-2 col-sm-2 col-md-2 col-lg-2 txtSectionTime-'+this.sectionCount+'"/>'+
				   		
				   	'</div>'+
			   '</div>';
	$('#testDetailsModal').find('.sectionDetails').append(html);
	$('#testDetailsModal').find('.sectionDetails').find('.btnRemoveSection').unbind().bind('click', function(e){
		console.log(e.currentTarget);
		var sectionId = $(e.currentTarget).attr('section-id');
		$('#testDetailsModal').find('.sectionDetails').find('.section[section-id='+sectionId+']').remove();
	});
};
testController.prototype.HandleTestStatus = function()
{
	$.ajax({
		url: remoteServer+'/test2bsure/teststatus?id='+this.id,
		type: 'PUT',
		success: function(response){
			console.log(response);
			if(response.status == true){
				$('.menu-tabs').find('li[class="active"]').find('a').click();
			}
			else{
				alert(response.message);
			}
		}.bind(this),
		error: function(e){
			console.log(e);
		}
	});
}
testController.prototype.HandleTestQuestions = function()
{
	$('#testQuesModal').find('.all-questions').find('tbody').html('');
	$('#testQuesModal').find('.added-questions').find('tbody').html('');
	this.PopulateQuestions();
	this.PopulateTestQuestions();
};
testController.prototype.PopulateTestQuestions = function(callback)
{
	$('.divCountQuesTest').find('.totalQues').text($('#testDetailsModal').find('#txtTestQuestions').val());
	$('.divCountQuesTest').find('.noOfQues').text(0);
	$.ajax({
		url: remoteServer+'/test2bsure/testquestion?testid='+this.id,
		type: 'GET',
		success: function(response){
			if(response.result.status == true){
				if(response.data != null && response.data.length > 0){
					$('.divCountQuesTest').find('.noOfQues').text(response.data.length);
					var items = response.data;
					var html = "";
					for(var item in items){
						html += "<tr data-id = '" + items[item]["id"] + "'>"+
									"<td class='addedQuesId'>"+items[item]["id"]+"</td>"+
									"<td class='addedQuesText'>"+items[item]["questionText"]+"</td>"+
									"<td><button class='btn btn-primary removeQues'>X</button></td>"+
								"</tr>";
					}
					$('#testQuesModal').find('.added-questions').find('tbody').html(html);
					$('#testQuesModal').find('.added-questions').find('.removeQues').unbind().bind('click', function(e){
						this.DeleteTestQuestion($(e.currentTarget).parents('tr').find('.addedQuesId').text());
					}.bind(this));
					$('#testQuesModal').find('.addedQuesText').unbind().bind('click', function(e){
						this.ViewQuestion($(e.currentTarget).parents('tr').find('.addedQuesId').text());
					}.bind(this));
				}
			}
			if(typeof callback != 'undefined')
				callback();
		}.bind(this),
		error: function(e){
			console.log(e);
			if(typeof callback != 'undefined')
				callback();
		}
	});
};
testController.prototype.AddTestQuestion = function(quesId)
{
	$.ajax({
		url: remoteServer+'/test2bsure/testquestion',
		type: 'POST',
		contentType: 'application/json',
		data: JSON.stringify({
			"questionId": quesId,
			"testId": this.id
		}),
		success: function(response){
			if(response.status == true){
				this.HandleTestQuestions();
			}
		}.bind(this),
		error: function(e){
			console.log(e);
		}
	});
};
testController.prototype.ViewQuestion = function(quesId)
{
	getQuestion(quesId, function(data){
		if(data == null){
			alert("Can't View Question data");
		}
		else{
			$('#viewQuestionModal').modal('show');
			var html = "<div>";
			html += "<div><span><b>Question Id:  </b>"+quesId+"</span></div>";
			html += "<div><span><b>Question Category:  </b>"+data.questionCategory+"</span></div>";
			html += "<div><span><b>Question Subcategory:  </b>"+data.questionSubcategory+"</span></div>";
			if(data.paragraph == 1 || data.paragraph == "true"){
				html += "</br><div><span><b>Paragraph: </b>"+data.paragraphText+"</span></div>";
			}
			html += "</br><div><span><b>Question: </b>"+data.questionText+"</span></div>";
			
			var options = data.options;
			if(options.startsWith('"')){
				options = options.substring(1);
			}
			if(options.endsWith('"')){
				options = options.substring(0, options.length-1);
			}
			var index = 97;
			var correctOption = JSON.parse(data.correctOption).indexOf(true);
			var i = 0;
			$.each($(options).find('option'), function(key, value){
				console.log(key);
				console.log(value);
				html += "<div class='option'>";
				html += "<span style='display:inline;'><b>"+String.fromCharCode(index)+".   </b></span>"+$(value).html()+"";
				html += "</div>";
				if(correctOption == i){
					correctOption = index;
				}
				index++;
				i++;
			});
			html += "</br><div><span><b>Correct Option:  </b>"+String.fromCharCode(correctOption)+"</span></div>";
			if(data.solution.length > 0){
				html += "</br><div><span><b>Solution:  </b>"+data.solution+"</span></div>";
			}
			html += "</div>";
			$('#viewQuestionModal').find('.modal-body').empty();
			$('#viewQuestionModal').find('.modal-body').html(html);
		}
	});
};
testController.prototype.DeleteTestQuestion = function(quesId)
{
	$.ajax({
		url: remoteServer+'/test2bsure/testquestion',
		type: 'DELETE',
		contentType: 'application/json',
		data: JSON.stringify({
			"questionId": quesId,
			"testId": this.id
		}),
		success: function(response){
			if(response.status == true){
				this.HandleTestQuestions();
			}
		}.bind(this),
		error: function(e){
			console.log(e);
		}
	});
};
testController.prototype.BindQuestionCategoryEvents = function()
{
	getQuestionCategories(function(categories, subcategories){
		if(categories.length > 0){
			var html = "";
			for(var cat in categories){
				html += "<option value='"+categories[cat]['id']+"'>"+categories[cat]['name']+"</option>";
			}
			$('#testQuesModal').find('#ddQuestionCategory').append(html);
		}
	}.bind(this));
	$('#testQuesModal').find('#ddQuestionCategory').unbind().bind('change', function(e){
		var categoryId = $(e.currentTarget).val();
		//Populate Subcategories
		if(categoryId == 0){
			$('#testQuesModal').find('#ddQuestionSubCategory').html("<option value='0'>All</option>");
		}
		else{
			getQuestionCategories(function(cat, subcat){
				var html = "<option value='0'>All</option>";
				for(var cat in subcat){
					if(subcat[cat]["categoryId"] == categoryId){
						html += "<option value='"+subcat[cat]['id']+"'>"+subcat[cat]['name']+"</option>";
					}
				}
				$('#testQuesModal').find('#ddQuestionSubCategory').html(html);
			}.bind(this));
		}
	}.bind(this))
	$('#testQuesModal').find("#btnSearchQues").unbind().bind('click', function(e){
		this.fromSearch = true;
		this.PopulateQuestions();
	}.bind(this));
};
testController.prototype.PopulateQuestions = function(start = 1, repopulate = true)
{
	this.start = $($('.insidePagination').find('.pagination').find('select').find(":selected")[1]).attr('data-start');
	if(typeof this.start == 'undefined' || this.fromSearch){
		this.start = 0;
		this.currentPage = 1;
		this.fromSearch = false;
	}
	
	var perPage = 15;
	var nameSearch = $('#testQuesModal').find('.txtSearchByName').val();
	var category = $('#testQuesModal').find('#ddQuestionCategory').val();
	var subcategory = $('#testQuesModal').find('#ddQuestionSubCategory').val();
	
	var url = remoteServer + "/test2bsure/question"+"?count="+perPage;
	if(nameSearch.length > 0){
		url += "&search="+nameSearch;
	}
	if(category != 0){
		url += "&category="+category;
	}
	if(subcategory != 0){
		url += "&subcategory="+subcategory;
	}
	url += "&start="+this.start;
	url += "&itemId="+this.id+"&type=test&intersect=1";
	console.log(url)
	$.ajax({
		url: url,
		type: 'GET',
		success: function(response){
			$('#testQuesModal').find('.all-questions').find('tbody').empty();
			if(response.result.status == true){
				if(response.data != null && response.data.length > 0){
					var items = response.data;
					var html = "";
					for(var item in items){
						html += "<tr data-id = '" + items[item]["id"] + "'>"+
									"<td class='addQuesId'>"+items[item]["id"]+"</td>"+
									"<td class='addQuesText'>"+items[item]["questionText"]+"</td>"+
									"<td><button class='btn btn-primary selectQues'>+</button>"+
									"<button class='btn btn-primary viewQues'>View</button></td>"+
								"</tr>";
					}
					$('#testQuesModal').find('.all-questions').find('tbody').html(html);

					$('#testQuesModal').find('.all-questions').find('.selectQues').unbind().bind('click', function(e){
						var entered = $('#testDetailsModal').find('#txtTestQuestions').val();
						var added = $('#testQuesModal').find('.divCountQuesTest').find('span.noOfQues').text();
						if(parseInt(entered) <= parseInt(added)){
							alert("Can't add more questions");
							return;
						}
						this.AddTestQuestion($(e.currentTarget).parents('tr').find('.addQuesId').text());
					}.bind(this));
					$('#testQuesModal').find('.all-questions').find('.viewQues').unbind().bind('click', function(e){
						this.ViewQuestion($(e.currentTarget).parents('tr').find('.addQuesId').text());
					}.bind(this));
					this.HandlePagination(response.result.length);
					removeLoader();
				}
			}
			else{
				this.HandlePagination(0);
			}
			if(typeof callback == 'function'){
				callback(response.result.length);
			}
		}.bind(this),
		error: function(e){
			console.log(e);
			if(typeof callback == 'function'){
				callback(0);
			}
		}
	});
};
testController.prototype.HandlePagination = function(len){
	$('.insidePagination').html('');
	if(len > 0){
		$('.insidePagination').html(pagination(len));
		$('.insidePagination').find('.pagination').find('select').val(this.currentPage);
		$('.insidePagination').find('.pagination').find('select').unbind().bind('change', function(e){
			this.currentPage = $(e.currentTarget).val();
			showLoader();
			this.PopulateQuestions();
		}.bind(this));
	}
};