var quizController = function(){
	this.categories = {};
	this.exams = {};
	this.questions = {};
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
		this.RefreshQuizModal();
		var obj = AutoComplete.getObj();
		obj.dom = $('#quizModal').find('#selectedExam');
		$('#quizModal').find('#ddQuizExam').unbind().bind('keyup', function(evt){
			this.SearchExams($(evt.currentTarget).val(), function(){
				obj.list = this.exams;
				obj.PopulateList();
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
			this.RefreshQuizModal();
		}.bind(this));
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
		url: 'http://localhost:8083/test2bsure/quiz',
		type: 'GET',
		success: function(response){
			if(response.result.status == true){
				if(response.data != null && response.data.length > 0){
					var quizzes = response.data;
					var quizObj = "";
					for(var quiz in quizzes){
						this.quiz[quizzes[quiz]['id']] = quizzes[quiz];
						quizObj += "<tr>"+
						"<td class='tdQuizId'>"+quizzes[quiz]['id']+"</td>"+
						"<td class='tdQuizName'>"+quizzes[quiz]['name']+"</td>"+
						"<td class='tdQuizTitle'>"+quizzes[quiz]['title']+"</td>"+
						"<td class='tdQuizQuestions'>"+quizzes[quiz]['noOfQues']+"</td>"+
						"<td class='tdQuizMarks'>"+quizzes[quiz]['marksPerQues']+"</td>"+
						"<td>"+
							"<button class='btn btn-default addEditQuiz update'>Edit</button>"+
							"<button class='btn btn-default deleteQuiz'>Delete</button>"+
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
quizController.prototype.SaveQuizDetails = function(update, id)
{
	console.log('Saving (Add/Update) Quiz');
	var name = $('#txtQuizName').val();
	var title = $('#txtQuizTitle').val();
	var questions = $('#txtQuizQuestions').val();
	var marks = $('#txtQuizMarks').val();
	var attempts = $('#txtQuizAttempts').val();
	var publish = $('#chkQuizPublish').prop('checked') == true ? 1 : 0;
	var exams = [];
	$('#selectedExam').find('span.selectedExam').each(function(e){
		console.log(this);
		exams.push($(this).attr("data-id"));
	});
	
	if(name.length == 0 || title.length == 0 || questions.length == 0 || marks.length == 0 ||
			attempts.length == 0){
		alert('Please enter all the mandatory fields');
		return;
	}
	var url = 'http://localhost:8083/test2bsure/quiz';
	var type = 'POST';
	var requestData = {
		'name': name,
		'title': title,
		'noOfQues': questions,
		'marksPerQues': marks,
		'noOfAttempts': attempts,
		'exams': exams,
		'active': 1,
		'publish': publish
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
				$('#quizQuestionsModal').modal('show');
				this.HandleQuizQuestions();
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
		url: "http://localhost:8083/test2bsure/quiz?id="+quizId,
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
	if($(e.currentTarget).hasClass('update')){
		var currentId = $(e.currentTarget).parents('tr').find('.tdQuizId').text();
		var quiz = this.quiz[currentId];
		name = quiz["name"];
		title = quiz["title"];
		ques = quiz["noOfQues"];
		marks = quiz["marksPerQues"];
		attempts = quiz["noOfAttempts"];
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
};
quizController.prototype.RefreshQuizModal = function()
{
	$('#quizModal').find('input[type="text"]').val('');
	$('#quizModal').find('#selectedExam').empty();
	$('#quizModal').find('.autocomplete-div').empty();
};
quizController.prototype.SearchQuizByName = function(callback)
{
	console.log('Searching quiz by name/title');
	var search = $('#txtSearchQuiz').val();
	$.ajax({
		url: 'http://localhost:8083/test2bsure/quiz?search='+search,
		type: 'GET',
		success: function(response){
			$('.existing-quizzes').find('table').find('tbody').empty();
			if(response.result.status == true){
				if(response.data != null && response.data.length > 0){
					var quizzes = response.data;
					var quizObj = "";
					for(var quiz in quizzes){
						quizObj += "<tr>"+
						"<td class='tdQuizId'>"+quizzes[quiz]['id']+"</td>"+
						"<td class='tdQuizName'>"+quizzes[quiz]['name']+"</td>"+
						"<td class='tdQuizTitle'>"+quizzes[quiz]['title']+"</td>"+
						"<td class='tdQuizQuestions'>"+quizzes[quiz]['noOfQues']+"</td>"+
						"<td class='tdQuizMarks'>"+quizzes[quiz]['marksPerQues']+"</td>"+
						"<td>"+
							"<button class='btn btn-default addEditQuiz update'>Edit</button>"+
							"<button class='btn btn-default deleteQuiz'>Delete</button>"+
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
		url: 'http://localhost:8083/test2bsure/category',
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
		url: 'http://localhost:8083/test2bsure/exam?search='+value,
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
		url: 'http://localhost:8083/test2bsure/exam',
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
		url: 'http://localhost:8083/test2bsure/question',
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
quizController.prototype.HandleQuizQuestions = function()
{
	$('#quizQuestionsModal').find('.all-questions').find('tbody').html('');
	$('#quizQuestionsModal').find('.added-questions').find('tbody').html('');
	this.selectedQuestions = [];
	this.PopulateQuizQuestions(function(){
		this.PopulateAllQuestions();
	}.bind(this));
};
quizController.prototype.PopulateQuizQuestions = function(callback)
{
	$.ajax({
		url: 'http://localhost:8083/test2bsure/quizquestion?quizid='+this.quizId,
		type: 'GET',
		success: function(response){
			if(response.result.status == true){
				if(response.data != null && response.data.length > 0){
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
		url: 'http://localhost:8083/test2bsure/quizquestion',
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
		url: 'http://localhost:8083/test2bsure/quizquestion',
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