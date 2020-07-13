var quizController = function(){
	this.id = -1;
};
quizController.prototype.Init = function()
{
};
quizController.prototype.AddEdit = function()
{
	$('#quizModal').modal('show');
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
quizController.prototype.BindEvents = function()
{
		
	
	//Publish/Unpublish Quiz
	$('.quizStatus').unbind().bind('click', function(e){
		var quizId = $(e.currentTarget).parents('tr').find('td:first-child').text();
		//var quizStatus = $(e.currentTarget).attr('quiz-status');
		this.HandleQuizStatus(quizId);
	}.bind(this));
};

quizController.prototype.SaveData = function(navigate)
{
	if(typeof navigate == 'undefined'){
		navigate = true;
	}
	console.log('Saving (Add/Update) Quiz');
	var name = $('#txtQuizName').val();
	var title = $('#txtQuizTitle').val();
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
				this.quizId = response.message;
				if(navigate == true){
					$('#quizQuestionsModal').modal('show');
					this.BindQuestionCategoryEvents();
					$('#quizQuestionsModal').find('#btnQuizFinish').unbind().bind('click', function(){
						//Check the no. of ques added and entered are same or not
						//if not same, update the total no. of questions in details as per the npo. of questions added
						var entered = $('#quizModal').find('#txtQuizQuestions').val();
						var added = $('#quizQuestionsModal').find('.divCountQues').find('span.noOfQues').text();
						if(entered != added){
							$('#updateQuizQuesModal').modal('show');
							$('#updateQuizQuesModal').find('#btnUpdateYes').unbind().bind('click', function(){
								$('#updateQuizQuesModal').modal('hide');
								$('#quizModal').find('#txtQuizQuestions').val(added);
								this.SaveQuizDetails(true, this.quizId, false);
								$('#quizQuestionsModal').modal('hide');
								$('#quizModal').modal('hide');
								$('.menu-tabs').find('li[class="active"]').find('a').click();
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
	//TODO
	var name = "";
	var title = "";
	var ques = "";
	var marks = "";
	var attempts = "";
	var exams = "";
	var publish = 0;
	var lock = 0;
	var filters = "";
	if($(e.currentTarget).hasClass('update')){
		var currentId = $(e.currentTarget).parents('tr').find('.tdQuizId').text();
		var quiz = this.quiz[currentId];
		name = quiz["name"];
		title = quiz["title"];
		ques = quiz["noOfQues"];
		marks = quiz["marksPerQues"];
		attempts = quiz["noOfAttempts"];
		publish = quiz["publish"];
		lock = quiz["lockApply"];
		if(quiz["exams"] != null && quiz["exams"].length > 0){
			var data = [];
			for(var exam in quiz["exams"]){
				var obj = {};
				obj.id = quiz["exams"][exam];
				obj.title = this.allExams[quiz["exams"][exam]].title;
				data.push(obj);
			}
			new AutoComplete('ddQuizExam', 'exams').SetSelectedValues('ddQuizExam', data);
		}
		else{
			new AutoComplete('ddQuizExam', 'exams');
		}
		if(quiz["filters"] != null && quiz["filters"].length > 0){
			var data = [];
			for(var filter in quiz["filters"]){
				var obj = {};
				obj.id = quiz["filters"][filter]["id"];
				obj.title = quiz["filters"][filter]["title"];//this.allExams[quiz["filters"][exam]].title;
				data.push(obj);
			}
			new AutoComplete('ddQuizFilter', 'filters').SetSelectedValues('ddQuizFilter', data);
		}
		else{
			new AutoComplete('ddQuizFilter', 'filters');
		}
	}
	$('#quizModal').find('#txtQuizName').val(name);
	$('#quizModal').find('#txtQuizTitle').val(title);
	$('#quizModal').find('#txtQuizQuestions').val(ques);
	$('#quizModal').find('#txtQuizMarks').val(marks);
	$('#quizModal').find('#txtQuizAttempts').val(attempts);
	$('#quizModal').find('#ddQuizExam').val('');
	var quizStatus = false;
	if(publish == 1){
		quizStatus = true;
	}
	$('#quizModal').find('#chkQuizPublish').prop('checked', quizStatus);
	var lockStatus = false;
	if(lock == 1){
		lockStatus = true;
		$('#txtQuizLockPoints').removeClass('lockDetails');
		$('#txtQuizLockRupees').removeClass('lockDetails');
		$('#txtQuizLockPoints').val(quiz["lockPoints"]);
		$('#txtQuizLockRupees').val(quiz["lockRupees"]);
	}
	else if(lock == 0){
		lockStatus = false;
		$('#txtQuizLockPoints').addClass('lockDetails');
		$('#txtQuizLockRupees').addClass('lockDetails');
	}
	$('#quizModal').find('#chkQuizLock').prop('checked', lockStatus);
};
quizController.prototype.LoadCategories = function()
{
	$.ajax({
		url: remoteServer+'/test2bsure/category',
		type: 'GET',
		success: function(response){
			if(response.result.status == true){
				if(response.data != null && response.data.length > 0){
					var categories = response.data;
					for(var category in categories){
						this.categories[categories[category]["id"]] = categories[category];
					}
				}
			}
		}.bind(this),
		error: function(e){
			console.log(e);
		}
	});
};
quizController.prototype.SearchExams = function(value, callback)
{
	$.ajax({
		url: remoteServer+'/test2bsure/exam?search='+value,
		type: 'GET',
		success: function(response){
			this.exams = {};
			if(response.result.status == true){
				if(response.data != null && response.data.length > 0){
					var exams = response.data;
					for(var exam in exams){
						this.exams[exams[exam]["id"]] = exams[exam];
					}
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
quizController.prototype.LoadExams = function()
{
	$.ajax({
		url: remoteServer+'/test2bsure/exam',
		type: 'GET',
		success: function(response){
			if(response.result.status == true){
				if(response.data != null && response.data.length > 0){
					var exams = response.data;
					for(var exam in exams){
						this.allExams[exams[exam]["id"]] = exams[exam];
					}
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
quizController.prototype.LoadQuestions = function(callback)
{
	$.ajax({
		url: remoteServer+'/test2bsure/question',
		type: 'GET',
		success: function(response){
			if(response.result.status == true){
				if(response.data != null && response.data.length > 0){
					var questions = response.data;
					for(var ques in questions){
						this.questions[questions[ques]["id"]] = questions[ques];
					}
					
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
quizController.prototype.HandleQuizStatus = function(id)
{
	$.ajax({
		url: remoteServer+'/test2bsure/quizstatus?id='+id,
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
	this.selectedQuestions = [];
	this.PopulateQuizQuestions(function(){
		this.PopulateFilteredQuestions();
		//View Question on click
		$('#quizQuestionsModal').find('.addedQuesText').unbind().bind('click', function(e){
			this.ViewQuestion($(e.currentTarget).parents('tr').find('.addedQuesId').text());
		}.bind(this));
	}.bind(this));
};
quizController.prototype.PopulateQuizQuestions = function(callback)
{
	$.ajax({
		url: remoteServer+'/test2bsure/quizquestion?quizid='+this.quizId,
		type: 'GET',
		success: function(response){
			if(response.result.status == true){
				if(response.data != null && response.data.length > 0){
					$('.divCountQues').find('.noOfQues').text(response.data.length);
					var html = "";
					var questions = response.data;
					for(var ques in questions){
						var quesId = questions[ques];
						this.selectedQuestions.push(quesId);
						html += "<tr>"+
									"<td class='addedQuesId'>"+this.questions[quesId]["id"]+"</td>"+
									"<td class='addedQuesText'>"+this.questions[quesId]["questionText"]+"</td>"+
									"<td><button class='btn btn-primary removeQues'>X</button>"+
								"</tr>";
					}
					$('#quizQuestionsModal').find('.added-questions').find('tbody').html(html);
					$('#quizQuestionsModal').find('.added-questions').find('.removeQues').unbind().bind('click', function(e){
						this.DeleteQuizQuestion($(e.currentTarget).parents('tr').find('.addedQuesId').text());
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
quizController.prototype.PopulateAllQuestions = function()
{
	var html = "";
	for(var ques in this.questions){
		if(this.selectedQuestions.indexOf(this.questions[ques]["id"]) == -1){
			html += "<tr>"+
						"<td class='addQuesId'>"+this.questions[ques]["id"]+"</td>"+
						"<td class='addQuesText'>"+this.questions[ques]["questionText"]+"</td>"+
						"<td><button class='btn btn-primary selectQues'>Add</button>"+
						"<button class='btn btn-primary viewQues'>View</button></td>"+
					"</tr>";
		}
	}
	$('#quizQuestionsModal').find('.all-questions').find('tbody').html(html);
	$('#quizQuestionsModal').find('.all-questions').find('.selectQues').unbind().bind('click', function(e){
		this.AddQuizQuestion($(e.currentTarget).parents('tr').find('.addQuesId').text());
	}.bind(this));
	$('#quizQuestionsModal').find('.all-questions').find('.viewQues').unbind().bind('click', function(e){
		this.ViewQuestion($(e.currentTarget).parents('tr').find('.addQuesId').text());
	}.bind(this));
};
quizController.prototype.AddQuizQuestion = function(quesId)
{
	$.ajax({
		url: remoteServer+'/test2bsure/quizquestion',
		type: 'POST',
		contentType: 'application/json',
		data: JSON.stringify({
			"questionId": quesId,
			"quizId": this.quizId
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
			"quizId": this.quizId
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
	if(this.questionCategory.length > 0){
		var catObj = "<option value=''>All</option>";
		for(var category in this.questionCategory){
			catObj += "<option value='"+this.questionCategory[category]['id']+"'>"+this.questionCategory[category]['name']+"</option>";
		}
		$('#quizQuestionsModal').find('#ddQuestionCategory').html(catObj);
	}
	if(this.questionSubcategory.length > 0){
		var subcatObj = "<option value=''>All</option>";
		for(var subcategory in this.questionSubcategory){
			subcatObj += "<option value='"+this.questionSubcategory[subcategory]['id']+"'>"+this.questionSubcategory[subcategory]['name']+"</option>";
		}
		$('#quizQuestionsModal').find('#ddQuestionSubCategory').html(subcatObj);
	}
	$('#quizQuestionsModal').find('#ddQuestionCategory').on('change', function(e){
		console.log($(e.currentTarget).val());
		var html = "<option value=''>All</option>";
		html += this.PopulateQuestionSubcategory($(e.currentTarget).val());
		$('#quizQuestionsModal').find('#ddQuestionSubCategory').html(html);
	}.bind(this));
	$('#quizQuestionsModal').find("#btnSearchQues").unbind().bind('click', function(e){
		this.PopulateFilteredQuestions();
	}.bind(this));
};
quizController.prototype.PopulateFilteredQuestions = function(start = 1, repopulate = true)
{
	var category = $('#quizQuestionsModal').find('#ddQuestionCategory').val();
	var subcategory = $('#quizQuestionsModal').find('#ddQuestionSubCategory').val();
	var html = "";
	if(repopulate == true){
		var totalQues = Object.keys(this.questions).length - this.selectedQuestions.length;
		var pages = parseInt(totalQues/50);
		if(pages*50 < totalQues){
			pages++;
		}
		var elem = "";
		for(var j=1; j<=pages; j++){
			elem += "<option value='"+j+"'>"+j+"</option>";
		}
		$('#quizQuestionsModal').find('#ddPages').html(elem);
		$('#quizQuestionsModal').find('#ddPages').unbind().bind('change', function(e){
			var pageNo = $(e.currentTarget).find(":selected").attr('value');
			var startNo = ((pageNo - 1) * 50) + 1;
			this.PopulateFilteredQuestions(startNo, false);
		}.bind(this));
	}
	var count = 1;
	for(var ques in this.questions){
		if(category.length == 0){
			//All category selected
			if(subcategory.length == 0){
				//All category and all subcategory selected
				if(this.selectedQuestions.indexOf(this.questions[ques]["id"]) == -1){
					if(count < start){
						count++;
						continue;
					}
					else if(count < (start+50)){
					html += "<tr>"+
						"<td class='addQuesId'>"+this.questions[ques]["id"]+"</td>"+
						"<td class='addQuesText'>"+this.questions[ques]["questionText"]+"</td>"+
						"<td><button class='btn btn-primary selectQues'>Add</button>"+
						"<button class='btn btn-primary viewQues'>View</button></td>"+
					"</tr>";
					count++;
					}
				}
			}
			else{
				//All category selected but not all subcategory
				if(this.selectedQuestions.indexOf(this.questions[ques]["id"]) == -1 && this.questions[ques]["questionSubcategory"] == subcategory){
					if(count < start){
						count++;
						continue;
					}
					else if(count < (start+50)){
					html += "<tr>"+
						"<td class='addQuesId'>"+this.questions[ques]["id"]+"</td>"+
						"<td class='addQuesText'>"+this.questions[ques]["questionText"]+"</td>"+
						"<td><button class='btn btn-primary selectQues'>Add</button>"+
						"<button class='btn btn-primary viewQues'>View</button></td>"+
					"</tr>";
					count++;
					}
				}
			}
		}
		else{
			//All category not selected
			if(subcategory.length == 0){
				//All category not selected but all subcategory selected
				if(this.selectedQuestions.indexOf(this.questions[ques]["id"]) == -1 && this.questions[ques]["questionCategory"] == category){
					if(count < start){
						count++;
						continue;
					}
					else if(count < (start+50)){
					html += "<tr>"+
						"<td class='addQuesId'>"+this.questions[ques]["id"]+"</td>"+
						"<td class='addQuesText'>"+this.questions[ques]["questionText"]+"</td>"+
						"<td><button class='btn btn-primary selectQues'>Add</button>"+
						"<button class='btn btn-primary viewQues'>View</button></td>"+
					"</tr>";
					count++;
					}
				}
			}
			else{
				//All category not selected and all subcategory not selected
				if(this.selectedQuestions.indexOf(this.questions[ques]["id"]) == -1 && this.questions[ques]["questionCategory"] == category && this.questions[ques]["questionSubcategory"] == subcategory){
					if(count < start){
						count++;
						continue;
					}
					else if(count < (start+50)){
					html += "<tr>"+
						"<td class='addQuesId'>"+this.questions[ques]["id"]+"</td>"+
						"<td class='addQuesText'>"+this.questions[ques]["questionText"]+"</td>"+
						"<td><button class='btn btn-primary selectQues'>Add</button>"+
						"<button class='btn btn-primary viewQues'>View</button></td>"+
					"</tr>";
					count++;
					}

				}
			}
		}
	}
	$('#quizQuestionsModal').find('.all-questions').find('tbody').html(html);
	$('#quizQuestionsModal').find('.all-questions').find('.selectQues').unbind().bind('click', function(e){
		this.AddQuizQuestion($(e.currentTarget).parents('tr').find('.addQuesId').text());
	}.bind(this));
	$('#quizQuestionsModal').find('.all-questions').find('.viewQues').unbind().bind('click', function(e){
		this.ViewQuestion($(e.currentTarget).parents('tr').find('.addQuesId').text());
	}.bind(this));
};
quizController.prototype.GetQuestionCategories = function()
{
	$.ajax({
		url: remoteServer+'/test2bsure/question-category',
		type: 'GET',
		success: function(response){
			console.log(response);
			if(response.result.status == true){
				if(response.categories != null && response.categories.length > 0){
					this.questionCategory = response.categories;
				}
				if(response.subcategories != null && response.subcategories.length > 0){
					this.questionSubcategory = response.subcategories;
				}
			}
		}.bind(this),
		error: function(e){
			console.log(e);
		}
	});
};
quizController.prototype.PopulateQuestionSubcategory = function(categoryId)
{
	if(categoryId.length != 0 && categoryId == 0){
		this.BindEvents();
		return false;
	}
	var html = "";
	if(this.questionSubcategory.length > 0){
		for(var obj in this.questionSubcategory){
			if(categoryId == ''){
				html += "<option value='"+this.questionSubcategory[obj]['id']+"'>"+this.questionSubcategory[obj]['name']+"</option>";
			}
			else if(this.questionSubcategory[obj]["categoryId"] == categoryId){
				html += "<option value='"+this.questionSubcategory[obj]['id']+"'>"+this.questionSubcategory[obj]['name']+"</option>";
			}
		}
	}
	return html;
};

quizController.prototype.ViewQuestion = function(quesId)
{
	$('#viewQuestionModal').modal('show');
	var category = this.questions[quesId].questionCategory;
	var subcategory = this.questions[quesId].questionSubcategory;
	for(var cat in this.questionCategory){
		if(this.questionCategory[cat].id == category){
			category = this.questionCategory[cat]["name"];
		}
	}
	for(var subcat in this.questionSubcategory){
		if(this.questionSubcategory[subcat].id == subcategory){
			subcategory = this.questionSubcategory[subcat]["name"];
		}
	}
	var html = "<div>";
	html += "<div><span><b>Question Id:  </b>"+quesId+"</span></div>";
	html += "<div><span><b>Question Category:  </b>"+category+"</span></div>";
	html += "<div><span><b>Question Subcategory:  </b>"+subcategory+"</span></div>";
	if(this.questions[quesId].paragraph == "true"){
		html += "</br><div><span><b>Paragraph Text: "+this.questions[quesId].paragraphText+"</b></span></div>";
	}
	html += "</br><div><span><b>Question: </b>"+this.questions[quesId].questionText+"</span></div>";
	var options = this.questions[quesId].options;
	var index = 97;
	var correctOption = JSON.parse(this.questions[quesId].correctOption).indexOf(true);
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
	if(this.questions[quesId].solution.length > 0){
		html += "</br><div><span><b>Solution:  </b>"+this.questions[quesId].solution+"</span></div>";
	}
	html += "</div>";
	$('#viewQuestionModal').find('.modal-body').empty();
	$('#viewQuestionModal').find('.modal-body').html(html);
};