var quizController = function(){
	this.categories = {};
	this.exams = {};
	this.questions = {};
	this.questionCategory = {};
	this.questionSubcategory = {};
	this.allExams = {};
	this.quiz = {};
	this.quizId = 0;
	this.selectedQuestions = [];
	this.Init();
};
quizController.prototype.Init = function()
{
	console.log('Initiate Quiz');
	this.LoadCategories();
	this.LoadExams();
	this.LoadQuestions();
	this.GetQuestionCategories();
	this.LoadView();
};
quizController.prototype.BindEvents = function()
{
	//Search quiz by name/title - button
	$('#btnSearchQuiz').unbind().bind('click', function(){
		this.SearchQuizByName(function(){
			this.BindEvents();
		}.bind(this));
	}.bind(this));
	
	//Add/Update Quiz
	$('.addEditQuiz').unbind().bind('click', function(e){
		this.quizId = 0;
		$('#quizModal').modal('show');
		RefreshData('quizModal');
		var obj = AutoComplete.getObj();
		obj.dom = $('#quizModal').find('#selectedExam');
		$('#quizModal').find('#ddQuizExam').unbind().bind('keyup', function(evt){
			this.SearchExams($(evt.currentTarget).val(), function(){
				obj.list = this.exams;
				obj.PopulateList($('#quizModal').find('#selectedExam'));
			}.bind(this));
		}.bind(this));
		
		this.PopulateQuizData(e);
		var id = 0;
		var update = $(e.currentTarget).hasClass('update');
		if(update){
			id = $(e.currentTarget).parents('tr').find('.tdQuizId').text();
		}
		$('#quizModal').find('#btnQuizSave').unbind().bind('click', function(){
			this.SaveQuizDetails(update, id);
		}.bind(this));
		$('#quizModal').find('#btnQuizRefresh').unbind().bind('click', function(){
			RefreshData('quizModal');
		}.bind(this));
		$('#quizModal').find('#btnQuizCancel').unbind().bind('click', function(){
			$('#quizModal').modal('hide');
			$('.menu-tabs').find('li[class="active"]').find('a').click();
		}.bind(this));
		$('#quizModal').find('.close').unbind().bind('click', function(){
			$('#quizModal').modal('hide');
			$('.menu-tabs').find('li[class="active"]').find('a').click();
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
	}.bind(this));
	
	$('.deleteQuiz').unbind().bind('click', function(e){
		var quizId = $(e.currentTarget).parents('tr').find('td:first-child').text();
		console.log(quizId);
		$('#deleteQuizModal').modal('show');
		$('#deleteQuizModal').find('.modal-body').find('p').find('span').text("SSC ?");
		$('#deleteQuizModal').find('#btnDeleteYes').unbind().bind('click', function(){
			this.DeleteQuiz(quizId, e);
		}.bind(this));
	}.bind(this));
	
	//Publish/Unpublish Quiz
	$('.quizStatus').unbind().bind('click', function(e){
		var quizId = $(e.currentTarget).parents('tr').find('td:first-child').text();
		//var quizStatus = $(e.currentTarget).attr('quiz-status');
		this.HandleQuizStatus(quizId);
	}.bind(this));
};
quizController.prototype.LoadView = function()
{
	$('.menu-page-content').load('quiz.html', function(){
		this.LoadAllQuiz(function(){
			this.BindEvents();
		}.bind(this));
	}.bind(this));
};
quizController.prototype.LoadAllQuiz = function(callback)
{
	$.ajax({
		url: 'http://www.test2bsure.com:8084/test2bsure/quiz',
		type: 'GET',
		success: function(response){
			if(response.result.status == true){
				if(response.data != null && response.data.length > 0){
					var quizzes = response.data;
					var quizObj = "";
					for(var quiz in quizzes){
						this.quiz[quizzes[quiz]['id']] = quizzes[quiz];
						var quizStatus = quizzes[quiz]['publish'];
						var btnText = quizStatus == 1 ? 'Unpublish' : 'Publish';
						var btnCss = quizStatus == 1 ? "background-color:red;color:white;font-weight:bold;" : "background-color:green;color:white;font-weight:bold;";
						quizObj += "<tr>"+
						"<td class='tdQuizId'>"+quizzes[quiz]['id']+"</td>"+
						"<td class='tdQuizName'>"+quizzes[quiz]['name']+"</td>"+
						"<td class='tdQuizTitle'>"+quizzes[quiz]['title']+"</td>"+
						"<td class='tdQuizQuestions'>"+quizzes[quiz]['noOfQues']+"</td>"+
						//"<td class='tdQuizMarks'>"+quizzes[quiz]['marksPerQues']+"</td>"+
						"<td>"+
							"<button class='btn btn-default addEditQuiz update'>Edit</button>"+
							"<button class='btn btn-default deleteQuiz'>Delete</button>"+
							"<button class='btn btn-default quizStatus' quiz-status='"+quizStatus+"' style='"+btnCss+"'>"+btnText+"</button>"+
						"</td>"+
						"</tr>";
					}
					$('.existing-quizzes').find('table').find('tbody').append(quizObj);
				}
			}
			callback();
		}.bind(this),
		error: function(e){
			console.log(e);
			callback();
		}
	});
};
quizController.prototype.SaveQuizDetails = function(update, id, navigate)
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
	
	$('#quizModal').find('#selectedExam').find('span.selectedExam').each(function(e){
		console.log(this);
		exams.push($(this).attr("data-id"));
	});
	
	if(name.length == 0 || title.length == 0 || questions.length == 0 || marks.length == 0 ||
			attempts.length == 0){
		alert('Please enter all the mandatory fields');
		return;
	}
	var url = 'http://www.test2bsure.com:8084/test2bsure/quiz';
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
		'lockRupees': lockRupees
	};
	console.log(requestData);
	if(update){
		requestData.id = id;
		type = 'PUT';
	}
	else if(parseInt(this.quizId) > 0){
		requestData.id = this.quizId;
		type = 'PUT';
	}
	console.log('Call to save quiz');
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
							alert("Number of questions entered and added are not same," +
									" updating the total number of questions as per the added number of questions");
							$('#quizModal').find('#txtQuizQuestions').val(added);
							this.SaveQuizDetails(true, this.quizId, false);
						}
						$('#quizQuestionsModal').modal('hide');
						$('#quizModal').modal('hide');
						$('.menu-tabs').find('li[class="active"]').find('a').click();
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

quizController.prototype.DeleteQuiz = function(quizId, e)
{
	console.log('Delete Quiz');
	$.ajax({
		url: "http://www.test2bsure.com:8084/test2bsure/quiz?id="+quizId,
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
quizController.prototype.PopulateQuizData = function(e)
{
	var name = "";
	var title = "";
	var ques = "";
	var marks = "";
	var attempts = "";
	var exams = "";
	var publish = 0;
	var lock = 0;
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
			var html = "";
			for(var exam in quiz["exams"]){
				console.log(exam);
				console.log(quiz["exams"][exam]);
				html += "<span>"+
							"<span class='selectedExam' data-id='"+quiz["exams"][exam]+"'>"+
							this.allExams[quiz["exams"][exam]].title+"</span>"+
							"<button>x</button>"+
						"</span>";
			}
			$('#selectedExam').html(html);
			$("#selectedExam").find('button').unbind().bind('click', function(e){
				$(e.currentTarget).parent('span').remove();
			});
		}
		else{
			$('#selectedExam').html('');
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
quizController.prototype.SearchQuizByName = function(callback)
{
	console.log('Searching quiz by name/title');
	var search = $('#txtSearchQuiz').val();
	$.ajax({
		url: 'http://www.test2bsure.com:8084/test2bsure/quiz?search='+search,
		type: 'GET',
		success: function(response){
			$('.existing-quizzes').find('table').find('tbody').empty();
			if(response.result.status == true){
				if(response.data != null && response.data.length > 0){
					var quizzes = response.data;
					var quizObj = "";
					for(var quiz in quizzes){
						var quizStatus = quizzes[quiz]['publish'];
						var btnText = quizStatus == 1 ? 'Unpublish' : 'Publish';
						var btnCss = quizStatus == 1 ? "background-color:red;color:white;font-weight:bold;" : "background-color:green;color:white;font-weight:bold;";
						quizObj += "<tr>"+
						"<td class='tdQuizId'>"+quizzes[quiz]['id']+"</td>"+
						"<td class='tdQuizName'>"+quizzes[quiz]['name']+"</td>"+
						"<td class='tdQuizTitle'>"+quizzes[quiz]['title']+"</td>"+
						"<td class='tdQuizQuestions'>"+quizzes[quiz]['noOfQues']+"</td>"+
						//"<td class='tdQuizMarks'>"+quizzes[quiz]['marksPerQues']+"</td>"+
						"<td>"+
							"<button class='btn btn-default addEditQuiz update'>Edit</button>"+
							"<button class='btn btn-default deleteQuiz'>Delete</button>"+
							"<button class='btn btn-default quizStatus' quiz-status='"+quizStatus+"' style='"+btnCss+"'>"+btnText+"</button>"+
						"</td>"+
						"</tr>";
					}
					$('.existing-quizzes').find('table').find('tbody').append(quizObj);
				}
			}
			callback();
		},
		error: function(e){
			console.log(e);
			callback();
		}
	});
};
quizController.prototype.LoadCategories = function()
{
	$.ajax({
		url: 'http://www.test2bsure.com:8084/test2bsure/category',
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
		url: 'http://www.test2bsure.com:8084/test2bsure/exam?search='+value,
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
		url: 'http://www.test2bsure.com:8084/test2bsure/exam',
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
		url: 'http://www.test2bsure.com:8084/test2bsure/question',
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
		url: 'http://www.test2bsure.com:8084/test2bsure/quizstatus?id='+id,
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
			console.log('View Question');
			this.ViewQuestion($(e.currentTarget).parents('tr').find('.addedQuesId').text());
		}.bind(this));
		$('#quizQuestionsModal').find('.addQuesText').unbind().bind('click', function(e){
			console.log('View Question');
			this.ViewQuestion($(e.currentTarget).parents('tr').find('.addQuesId').text());
		}.bind(this));
	}.bind(this));
};
quizController.prototype.PopulateQuizQuestions = function(callback)
{
	$.ajax({
		url: 'http://www.test2bsure.com:8084/test2bsure/quizquestion?quizid='+this.quizId,
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
					"</tr>";
		}
	}
	$('#quizQuestionsModal').find('.all-questions').find('tbody').html(html);
	$('#quizQuestionsModal').find('.all-questions').find('.selectQues').unbind().bind('click', function(e){
		this.AddQuizQuestion($(e.currentTarget).parents('tr').find('.addQuesId').text());
	}.bind(this));
};
quizController.prototype.AddQuizQuestion = function(quesId)
{
	$.ajax({
		url: 'http://www.test2bsure.com:8084/test2bsure/quizquestion',
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
		url: 'http://www.test2bsure.com:8084/test2bsure/quizquestion',
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
quizController.prototype.ViewQuestion = function(quesId)
{
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
quizController.prototype.PopulateFilteredQuestions = function()
{
	var category = $('#quizQuestionsModal').find('#ddQuestionCategory').val();
	var subcategory = $('#quizQuestionsModal').find('#ddQuestionSubCategory').val();
	var html = "";
	for(var ques in this.questions){
		if(category.length == 0){
			//All category selected
			if(subcategory.length == 0){
				//All category and all subcategory selected
				if(this.selectedQuestions.indexOf(this.questions[ques]["id"]) == -1){
					html += "<tr>"+
						"<td class='addQuesId'>"+this.questions[ques]["id"]+"</td>"+
						"<td class='addQuesText'>"+this.questions[ques]["questionText"]+"</td>"+
						"<td><button class='btn btn-primary selectQues'>Add</button>"+
					"</tr>";
				}
			}
			else{
				//All category selected but not all subcategory
				if(this.selectedQuestions.indexOf(this.questions[ques]["id"]) == -1 && this.questions[ques]["questionSubcategory"] == subcategory){
					html += "<tr>"+
						"<td class='addQuesId'>"+this.questions[ques]["id"]+"</td>"+
						"<td class='addQuesText'>"+this.questions[ques]["questionText"]+"</td>"+
						"<td><button class='btn btn-primary selectQues'>Add</button>"+
					"</tr>";
				}
			}
		}
		else{
			//All category not selected
			if(subcategory.length == 0){
				//All category not selected but all subcategory selected
				if(this.selectedQuestions.indexOf(this.questions[ques]["id"]) == -1 && this.questions[ques]["questionCategory"] == category){
					html += "<tr>"+
						"<td class='addQuesId'>"+this.questions[ques]["id"]+"</td>"+
						"<td class='addQuesText'>"+this.questions[ques]["questionText"]+"</td>"+
						"<td><button class='btn btn-primary selectQues'>Add</button>"+
					"</tr>";
				}
			}
			else{
				//All category not selected and all subcategory not selected
				if(this.selectedQuestions.indexOf(this.questions[ques]["id"]) == -1 && this.questions[ques]["questionCategory"] == category && this.questions[ques]["questionSubcategory"] == subcategory){
					html += "<tr>"+
						"<td class='addQuesId'>"+this.questions[ques]["id"]+"</td>"+
						"<td class='addQuesText'>"+this.questions[ques]["questionText"]+"</td>"+
						"<td><button class='btn btn-primary selectQues'>Add</button>"+
					"</tr>";

				}
			}
		}
	}
	$('#quizQuestionsModal').find('.all-questions').find('tbody').html(html);
	$('#quizQuestionsModal').find('.all-questions').find('.selectQues').unbind().bind('click', function(e){
		this.AddQuizQuestion($(e.currentTarget).parents('tr').find('.addQuesId').text());
	}.bind(this));
};
quizController.prototype.GetQuestionCategories = function()
{
	$.ajax({
		url: 'http://www.test2bsure.com:8084/test2bsure/question-category',
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