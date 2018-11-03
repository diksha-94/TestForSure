var questionbankController = function(){
	this.questions = {};
	this.Init();
};
questionbankController.prototype.Init = function()
{
	console.log('Initiate question bank');
	this.LoadView();
};
questionbankController.prototype.BindEvents = function()
{
	//Add/Update Question
	$('.addEditQuestion').unbind().bind('click', function(e){
		AddQuestionModal(e);
		this.PopulateQuestionData(e);
	}.bind(this));
	
	$('.deleteQuestion').unbind().bind('click', function(e){
		var questionId = $(e.currentTarget).parents('tr').find('td:first-child').text();
		$('#deleteQuestionModal').modal('show');
		$('#deleteQuestionModal').find('#btnDeleteYes').unbind().bind('click', function(){
			this.DeleteQuestion(questionId, e);
		}.bind(this));
	}.bind(this));
};
questionbankController.prototype.LoadView = function()
{
	$('.menu-page-content').load('questionbank.html', function(){
		this.LoadAllQuestions(function(){
			this.BindEvents();
		}.bind(this));
	}.bind(this));
};
questionbankController.prototype.LoadAllQuestions = function(callback)
{
	$.ajax({
		url: 'http://localhost:8083/test2bsure/question',
		type: 'GET',
		contentType: 'application/json',
		success: function(response){
			if(response.result.status == true){
				if(response.data !=  null && response.data.length > 0){
					var questions = response.data;
					var quesObj = "";
					for(var ques in questions){
						this.questions[questions[ques]["id"]] = questions[ques];
						quesObj += "<tr>"+
							"<td class='tdQuestionId'>"+questions[ques]['id']+"</td>"+
							"<td class='tdQuestionName'>"+questions[ques]['questionText']+"</td>"+
							"<td>"+
								"<button class='btn btn-default addEditQuestion update'>Edit</button>"+
								"<button class='btn btn-default deleteQuestion'>Delete</button>"+
							"</td>"+
							"</tr>";
					}
					$('.existing-questions').find('table').find('tbody').append(quesObj);
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
questionbankController.prototype.SaveQuestion = function(update)
{
	console.log('Saving (Add/Update) Question');
	var quesCategory = $('#questionModal').find('#ddQuestionCategory').val();
	var quesType = $('#questionModal').find('#ddQuestionType').val();
	var paraBased =	$('#questionModal').find('#chkParagraph').prop('checked');
	var paraText = $('#questionModal').find('#txtParagraphText').val();
	var quesText = $('#questionModal').find('#txtQuestionText').val();
	var solution = $('#questionModal').find('#txtSolution').val();
	if(quesCategory.length == 0 || quesType.length == 0 || quesText.length == 0 || solution.length == 0){
		alert('Please enter all the mandatory fields');
		return;
	}
	if(paraBased == 'true' && paraText.length == 0){
		alert('Please enter all the mandatory fields');
		return;
	}
	var allOptions = $('#questionModal').find('.txtOptions');
	for (var option in options){
		var val = $(allOptions[option]).val();
		if(val.length == 0){
			alert('Please enter all the mandatory fields');
			return;
		}
	}
	
	var url = 'http://localhost:8083/question';
	var type = 'POST';
	var requestData = {
			'name': name,
			'title': title,
			'imageUrl': imageUrl,
			'category': categoryId,
			'description': description
	};
	console.log(requestData);
	if(update){
		url += '/'+id;
		type = 'PATCH';
	}
	console.log('Call to save category');
	$.ajax({
		url: url,
		type: type,
		data: requestData,
		success: function(response){
			if(response.header.status == 102 || response.header.status == 107){
				$('#examModal').modal('hide');
				alert(response.header.message);
				$('.menu-tabs').find('li[class="active"]').find('a').click();
			}
		},
		error: function(e){
			console.log(e);
		}
	});
};
questionbankController.prototype.DeleteQuestion = function(questionId, e)
{
	console.log('Delete Question');
	$.ajax({
		url: "http://localhost:8083/question/"+questionId,
		type: 'DELETE',
		success: function(response){
			if(response.header.status == 105){
				$('#deleteQuestionModal').modal('hide');
				$('.menu-tabs').find('li[class="active"]').find('a').click();
			}
		},
		error: function(e){
			alert(e);
		}
	});
};
questionbankController.prototype.PopulateQuestionData = function(e)
{
	var quesCategory = "";
	var quesType = "";
	var paraBased = "";
	var paraText = "";
	var quesText = "";
	var options = "";
	var correctOption = "";
	var solution = "";
	if($(e.currentTarget).hasClass('update')){
		var currentQues = $(e.currentTarget).parents('tr').find('.tdQuestionId').text();
		quesCategory = this.questions[currentQues]["questioncategory"];
		quesType = this.questions[currentQues]["questionType"];
		paraBased = this.questions[currentQues]["paragraph"];
		paraText = this.questions[currentQues]["paragraphText"];
		quesText = this.questions[currentQues]["questionText"];
		options = JSON.parse(this.questions[currentQues]["options"]);
		correctOption = JSON.parse(this.questions[currentQues]["correctOption"]);
		solution = this.questions[currentQues]["solution"];
	}
	$('#questionModal').find('#ddQuestionCategory').val(quesCategory);
	$('#questionModal').find('#ddQuestionType').val(quesType);
	if(paraBased == 'true'){
		$('#questionModal').find('#chkParagraph').prop('checked', true);
	}
	else if(paraBased == 'false'){
		$('#questionModal').find('#chkParagraph').prop('checked', false);
	}
	$('#questionModal').find('#txtParagraphText').val(paraText);
	$('#questionModal').find('#txtQuestionText').val(quesText);
	var optionsCount = options.length;
	for (var i = 0; i < optionsCount - 1 ; i++){
		$('#btnAddOption').click();
	}
	var allOptions = $('#questionModal').find('.txtOptions');
	for (var option in options){
		$(allOptions[option]).val(options[option]);
	}
	$('#questionModal').find('.chkCorrectOption').prop('checked', false);
	for(var i=0; i<correctOption.length - 1; i++){
		if(correctOption[i] ==  true){
			$($('#questionModal').find('.chkCorrectOption')[i]).prop('checked', true);
		}
	}
	//$('#questionModal').find('.chkCorrectOption[value="'+correctOption+'"]').prop('checked', true);
	$('#questionModal').find('#txtSolution').val(solution);
};
