var quizController = function(){
	this.id = -1;
	this.currentPage = 1;
	this.fromSearch = false;
};
quizController.prototype.Init = function()
{
};
quizController.prototype.AddEdit = function()
{
	$('#quizModal').modal('show');
	$('#quizModal').find('.ddQuizExam').remove();
	$('#quizModal').find('.ddQuizFilter').remove();
	RefreshData('quizModal');
	if(this.id > 0){
		this.Edit();
	}
	$('#quizModal').find('#btnQuizSave').unbind().bind('click', function(){
		this.SaveData();
	}.bind(this));
	$('#quizModal').find('#chkQuizLock').unbind().bind('change', function(e){
		var lockValue = $(e.currentTarget).prop('checked');
		if(lockValue == true){
			$('#txtQuizLockPoints').removeClass('lockDetails');
			$('#txtQuizLockRupees').removeClass('lockDetails');
		}
		else if(lockValue == false){
			$('#txtQuizLockPoints').addClass('lockDetails');
			$('#txtQuizLockRupees').addClass('lockDetails');
		}
	});
};
quizController.prototype.Delete = function()
{
	$('#deleteQuizModal').modal('show');
	$('#deleteQuizModal').find('.modal-body').find('p').find('span').text(this.id+" ?");
	$('#deleteQuizModal').find('#btnDeleteYes').unbind().bind('click', function(){
		this.DeleteItem();
	}.bind(this));
};
quizController.prototype.SaveData = function(openNext, callback)
{
	if(typeof openNext == 'undefined'){
		openNext = true;
	}
	console.log('Saving (Add/Update) Quiz');
	var name = $('#txtQuizName').val();
	var title = $('#txtQuizTitle').val();
	var displayIndex = $('#txtQuizIndex').val();
	var questions = $('#txtQuizQuestions').val();
	var marks = $('#txtQuizMarks').val();
	var attempts = $('#txtQuizAttempts').val();
	var publish = $('#chkQuizPublish').prop('checked') == true ? 1 : 0;
	var exams = [];
	var lock = ($('#chkQuizLock').prop('checked') == true) ? 1 : 0;
	var lockPoints = (typeof $('#txtQuizLockPoints').val() != 'undefined') ? $('#txtQuizLockPoints').val() : 0;
	var lockRupees = (typeof $('#txtQuizLockRupees').val() != 'undefined') ? $('#txtQuizLockRupees').val() : 0;
	var exams = GetSelectedValues('ddQuizExam');
	var filter = GetSelectedValues('ddQuizFilter');
	var filters = [];
	for(var f in filter){
		var obj = {};
		obj.id = filter[f];
		obj.title = "";
		filters.push(obj);
	}
	if(name.length == 0 || title.length == 0 || questions.length == 0 || marks.length == 0 ||
			attempts.length == 0){
		alert('Please enter all the mandatory fields');
		return;
	}
	var url = remoteServer+'/test2bsure/quiz';
	var type = 'POST';
	var requestData = {
		'name': name,
		'title': title,
		'displayIndex': displayIndex,
		'noOfQues': questions,
		'marksPerQues': marks,
		'noOfAttempts': attempts,
		'exams': exams,
		'active': 1,
		'publish': publish,
		'lockApply': lock,
		'lockPoints': lockPoints,
		'lockRupees': lockRupees,
		'filters': filters
	};
	console.log(requestData);
	if(this.id > 0){
		requestData.id = this.id;
		type = 'PUT';
	}
	$.ajax({
		url: url,
		type: type,
		contentType: 'application/json',
		data: JSON.stringify(requestData),
		success: function(response){
			if(response.status == true){
				this.id = response.message;
				if(openNext == true){
					$('#quizQuestionsModal').modal('show');
					this.BindQuestionCategoryEvents();
					$('#quizQuestionsModal').find('#btnQuizFinish').unbind().bind('click', function(){
						//Check the no. of ques added and entered are same or not
						//if not same, update the total no. of questions in details as per the npo. of questions added
						var entered = $('#quizModal').find('#txtQuizQuestions').val();
						var added = $('#quizQuestionsModal').find('.divCountQues').find('span.noOfQues').text();
						if(parseInt(entered) != parseInt(added)){
							alert("Please add all the questions and finish.");
							return;
							$('#updateQuizQuesModal').modal('show');
							$('#updateQuizQuesModal').find('#btnUpdateYes').unbind().bind('click', function(){
								$('#updateQuizQuesModal').modal('hide');
								$('#quizModal').find('#txtQuizQuestions').val(added);
								this.SaveData(false, function(){
									$('#quizQuestionsModal').modal('hide');
									$('#quizModal').modal('hide');
									$('.menu-tabs').find('li[class="active"]').find('a').click();
								});
							}.bind(this));
						}
						else{
							$('#quizQuestionsModal').modal('hide');
							$('#quizModal').modal('hide');
							$('.menu-tabs').find('li[class="active"]').find('a').click();
						}
					}.bind(this));
					this.HandleQuizQuestions();
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

quizController.prototype.DeleteItem = function()
{
	$.ajax({
		url: remoteServer+"/test2bsure/quiz?id="+this.id,
		type: 'DELETE',
		success: function(response){
			if(response.status == true){
				$('#deleteQuizModal').modal('hide');
				$('.menu-tabs').find('li[class="active"]').find('a').click();
			}
			else{
				alert(response.message);
			}
		},
		error: function(e){
			alert(e);
		}
	});
};
quizController.prototype.Edit = function(e)
{
	$.ajax({
		url: remoteServer + "/test2bsure/quiz?id=" + this.id,
		type: 'GET',
		success: function(response){
			if(response.result.status == true){
				if(response.data != null && response.data.length > 0){
					var item = response.data[0];
					$('#quizModal').find('#txtQuizName').val(item.name);
					$('#quizModal').find('#txtQuizTitle').val(item.title);
					$('#quizModal').find('#txtQuizIndex').val(item.displayIndex);
					$('#quizModal').find('#txtQuizQuestions').val(item.noOfQues);
					$('#quizModal').find('#txtQuizMarks').val(item.marksPerQues);
					$('#quizModal').find('#txtQuizAttempts').val(item.noOfAttempts);
					var quizStatus = false;
					if(item.publish == 1){
						quizStatus = true;
					}
					$('#quizModal').find('#chkQuizPublish').prop('checked', quizStatus);
					
					$('#quizModal').find('#ddQuizExam').val('');
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
							new AutoComplete('ddQuizExam', 'exams').SetSelectedValues('ddQuizExam', data);
						});
					}
					else{
						new AutoComplete('ddQuizExam', 'exams');
					}
					if(item.filters != null && item.filters.length > 0){
						var data1 = {};
						for(var filter in item.filters){
							data1[item.filters[filter].id] = item.filters[filter].id;
						}
						getFilterTitle(Object.keys(data1), function(response){
							console.log(response);
							for(var r in response){
								data1[response[r]["id"]] = {
										"id": response[r]["id"],
										"title": response[r]["title"]
								};
							}
							new AutoComplete('ddQuizFilter', 'filters').SetSelectedValues('ddQuizFilter', data1);
						});
					}
					else{
						new AutoComplete('ddQuizFilter', 'filters');
					}
					var lockStatus = false;
					if(item.lockApply == 1){
						lockStatus = true;
						$('#txtQuizLockPoints').removeClass('lockDetails');
						$('#txtQuizLockRupees').removeClass('lockDetails');
						$('#txtQuizLockPoints').val(item.lockPoints);
						$('#txtQuizLockRupees').val(item.lockRupees);
					}
					else if(item.lockApply == 0){
						lockStatus = false;
						$('#txtQuizLockPoints').addClass('lockDetails');
						$('#txtQuizLockRupees').addClass('lockDetails');
					}
					$('#quizModal').find('#chkQuizLock').prop('checked', lockStatus);
				}
			}
			
		}.bind(this),
		error: function(e){
			console.log(e);
		}
	});
};
quizController.prototype.HandleQuizStatus = function()
{
	$.ajax({
		url: remoteServer+'/test2bsure/quizstatus?id='+this.id,
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
quizController.prototype.HandleQuizQuestions = function()
{
	$('#quizQuestionsModal').find('.all-questions').find('tbody').html('');
	$('#quizQuestionsModal').find('.added-questions').find('tbody').html('');
	this.PopulateQuestions();
	this.PopulateQuizQuestions();
};
quizController.prototype.PopulateQuizQuestions = function(callback)
{
	$('.divCountQues').find('.noOfQues').text(0);
	$('.divCountQues').find('.totalQues').text($('#quizModal').find('#txtQuizQuestions').val());
	$.ajax({
		url: remoteServer+'/test2bsure/quizquestion?quizid='+this.id,
		type: 'GET',
		success: function(response){
			if(response.result.status == true){
				if(response.data != null && response.data.length > 0){
					$('.divCountQues').find('.noOfQues').text(response.data.length);
					var items = response.data;
					var html = "";
					for(var item in items){
						html += "<tr data-id = '" + items[item]["id"] + "'>"+
									"<td class='addedQuesId'>"+items[item]["id"]+"</td>"+
									"<td class='addedQuesText'>"+items[item]["questionText"]+"</td>"+
									"<td><button class='btn btn-primary removeQues'>X</button></td>"+
								"</tr>";
					}
					$('#quizQuestionsModal').find('.added-questions').find('tbody').html(html);
					$('#quizQuestionsModal').find('.added-questions').find('.removeQues').unbind().bind('click', function(e){
						this.DeleteQuizQuestion($(e.currentTarget).parents('tr').find('.addedQuesId').text());
					}.bind(this));
					$('#quizQuestionsModal').find('.addedQuesText').unbind().bind('click', function(e){
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
quizController.prototype.AddQuizQuestion = function(quesId)
{
	$.ajax({
		url: remoteServer+'/test2bsure/quizquestion',
		type: 'POST',
		contentType: 'application/json',
		data: JSON.stringify({
			"questionId": quesId,
			"quizId": this.id
		}),
		success: function(response){
			if(response.status == true){
				this.HandleQuizQuestions();
			}
		}.bind(this),
		error: function(e){
			console.log(e);
		}
	});
};
quizController.prototype.DeleteQuizQuestion = function(quesId)
{
	$.ajax({
		url: remoteServer+'/test2bsure/quizquestion',
		type: 'DELETE',
		contentType: 'application/json',
		data: JSON.stringify({
			"questionId": quesId,
			"quizId": this.id
		}),
		success: function(response){
			if(response.status == true){
				this.HandleQuizQuestions();
			}
		}.bind(this),
		error: function(e){
			console.log(e);
		}
	});
};
quizController.prototype.BindQuestionCategoryEvents = function()
{
	getQuestionCategories(function(categories, subcategories){
		if(categories.length > 0){
			var html = "";
			for(var cat in categories){
				html += "<option value='"+categories[cat]['id']+"'>"+categories[cat]['name']+"</option>";
			}
			$('#quizQuestionsModal').find('#ddQuestionCategory').append(html);
		}
	}.bind(this));
	$('#quizQuestionsModal').find('#ddQuestionCategory').unbind().bind('change', function(e){
		var categoryId = $(e.currentTarget).val();
		//Populate Subcategories
		if(categoryId == 0){
			$('#quizQuestionsModal').find('#ddQuestionSubCategory').html("<option value='0'>All</option>");
		}
		else{
			getQuestionCategories(function(cat, subcat){
				var html = "<option value='0'>All</option>";
				for(var cat in subcat){
					if(subcat[cat]["categoryId"] == categoryId){
						html += "<option value='"+subcat[cat]['id']+"'>"+subcat[cat]['name']+"</option>";
					}
				}
				$('#quizQuestionsModal').find('#ddQuestionSubCategory').html(html);
			}.bind(this));
		}
	}.bind(this))
	$('#quizQuestionsModal').find("#btnSearchQues").unbind().bind('click', function(e){
		this.fromSearch = true;
		this.PopulateQuestions();
	}.bind(this));
};
quizController.prototype.PopulateQuestions = function(start = 1, repopulate = true)
{
	this.start = $($('.insidePagination').find('.pagination').find('select').find(":selected")[0]).attr('data-start');
	if(typeof this.start == 'undefined' || this.fromSearch){
		this.start = 0;
		this.currentPage = 1;
		this.fromSearch = false;
	}
	var perPage = 15;
	var nameSearch = $('#quizQuestionsModal').find('.txtSearchByName').val();
	var category = $('#quizQuestionsModal').find('#ddQuestionCategory').val();
	var subcategory = $('#quizQuestionsModal').find('#ddQuestionSubCategory').val();
	
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
	url += "&itemId="+this.id+"&type=quiz";
	console.log(url)
	$.ajax({
		url: url,
		type: 'GET',
		success: function(response){
			$('#quizQuestionsModal').find('.all-questions').find('tbody').empty();
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
					$('#quizQuestionsModal').find('.all-questions').find('tbody').html(html);

					$('#quizQuestionsModal').find('.all-questions').find('.selectQues').unbind().bind('click', function(e){
						var entered = $('#quizModal').find('#txtQuizQuestions').val();
						var added = $('#quizQuestionsModal').find('.divCountQues').find('span.noOfQues').text();
						if(parseInt(entered) <= parseInt(added)){
							alert("Can't add more questions");
							return;
						}
						this.AddQuizQuestion($(e.currentTarget).parents('tr').find('.addQuesId').text());
					}.bind(this));
					$('#quizQuestionsModal').find('.all-questions').find('.viewQues').unbind().bind('click', function(e){
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
quizController.prototype.ViewQuestion = function(quesId)
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
quizController.prototype.HandlePagination = function(len){
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