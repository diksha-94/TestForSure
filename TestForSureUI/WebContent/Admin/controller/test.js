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
		$('#txtTestTitle').unbind('keyup');
	}
	else{
		$('#txtTestTitle').unbind().bind('keyup', function(e){
			populateUrlKey($(e.currentTarget).val(), $('#txtTestUrlKey'));
		});
		new AutoComplete('ddTestExam', 'exams');
		new AutoComplete('ddRelatedTests', 'tests');
	}
	$('#txtTestUrlKey').unbind().bind('keyup', function(e){
		populateUrlKey($(e.currentTarget).val(), $(e.currentTarget));
	});
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
	var name = $('#txtTestName').val();
	var title = $('#txtTestTitle').val();
	var urlKey = $('#txtTestUrlKey').val();
	var displayIndex = $('#txtTestIndex').val();
	var time = $('#txtTestTime').val();
	var marks = parseFloat($('#txtTestMarks').val());
	var allowedAttempts = $('#txtTestAttempts').val();
	var publish = $('#chkTestPublish').prop('checked') == true ? 1 : 0;
	var maxRewardPoints = $('#testDetailsModal').find('#txtRewardPoints').val();
	var exams = GetSelectedValues('ddTestExam');
	var lock = ($('#chkTestLock').prop('checked') == true) ? 1 : 0;
	var lockPoints = (typeof $('#txtTestLockPoints').val() != 'undefined') ? $('#txtTestLockPoints').val() : 0;
	var lockRupees = (typeof $('#txtTestLockRupees').val() != 'undefined') ? $('#txtTestLockRupees').val() : 0;
	var negativeMarks = $('#txtTestNegative').val();
	var suggestedTests = GetSelectedValues('ddRelatedTests');
	var instructions = summernoteController.getObj().getValue('#txtTestInstructions');
	
	if(name.length == 0 || title.length == 0 || urlKey.length == 0 || time.length == 0 || marks.length == 0 ||
			allowedAttempts.length == 0 || negativeMarks.length == 0){
		alert('Please enter all the mandatory fields');
		return;
	}
	var url = remoteServer+'/test2bsure/test';
	var type = 'POST';
	var requestData = {
			'name': name,
			'title': title,
			'urlKey': urlKey,
			'displayIndex': displayIndex,
			'marksPerQues': marks,
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
						$('#testQuesModal').modal('hide');
						$('#testDetailsModal').modal('hide');
						$('.menu-tabs').find('li[class="active"]').find('a').click();
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
					$('#testDetailsModal').find('#txtTestUrlKey').val(item.urlKey);
					$('#testDetailsModal').find('#txtTestIndex').val(item.displayIndex);
					$('#testDetailsModal').find('#txtTestTime').val(item.totalTime);
					$('#testDetailsModal').find('#txtTestMarks').val(item.marksPerQues);
					$('#testDetailsModal').find('#txtTestNegative').val(item.negativeMarks);
					$('#testDetailsModal').find('#txtTestAttempts').val(item.noOfAttempts);
					
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
					summernoteController.getObj().setValue('#txtTestInstructions', item.instructions);
					
					if(item.exams != null && item.exams.length > 0){
						var data = {};
						for(var exam in item.exams){
							data[item.exams[exam]] = item.exams[exam];
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
					
					if(item.suggestedTests != null && item.suggestedTests.length > 0){
						var data1 = {};
						for(var test in item.suggestedTests){
							data1[item.suggestedTests[test]] = item.suggestedTests[test];
						}
						getTestTitle(Object.keys(data1), function(response){
							console.log(response);
							for(var r in response){
								data1[response[r]["id"]] = {
										"id": response[r]["id"],
										"title": response[r]["title"]
								};
							}
							new AutoComplete('ddRelatedTests', 'tests').SetSelectedValues('ddRelatedTests', data1);
						});
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
};

testController.prototype.HandleTestQuestions = function()
{
	$('#testQuesModal').find('.all-questions').find('tbody').html('');
	$('#testQuesModal').find('.added-questions').find('tbody').html('');
	this.PopulateQuestions();
	this.PopulateTestQuestions();
};

testController.prototype.PopulateTestQuestions = function(callback)
{
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
			var html = "<option value=''>All</option>";
			for(var cat in categories){
				html += "<option value='"+categories[cat]['id']+"'>"+categories[cat]['name']+"</option>";
			}
			$('#testQuesModal').find('#ddQuestionCategory').html(html);
		}
		$('#testQuesModal').find('#ddQuestionSubCategory').html("<option value='0'>All</option>");
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