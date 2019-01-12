var testController = function(){
	this.id = 0;
	this.testInfo = {};
	this.questionsData = {};
	this.sessionId = 0;
	this.currentQues = 1;
	this.Init();
};
testController.prototype.Init = function()
{
	//Read id from query string
	this.id = test2bsureController.getObj().QueryString(window.location.href, 'id');
	this.LoadData();
};
testController.prototype.LoadData = function()
{
	var id = this.id;
	fetch('http://localhost:8083/test2bsure/testdata?testId='+id)
	  .then(response => response.json())
	  .then(data => this.SetState({ testInfo: data.testInfo, questionsData: data.questionsData, sessionId: data.sessionId }));
}
testController.prototype.SetState = function(obj)
{
	for(var key in obj){
		this[key] = obj[key];
	}
	this.PopulateTestInfo();
	this.PopulateTestQuestionStatus();
	if(typeof this.testInfo.attemptInfo != 'undefined' && this.testInfo.attemptInfo != null){
		this.currentQues = parseInt(this.testInfo.attemptInfo.lastQues) + 1;
	}
	this.DisplayQuestion();
	this.PopulateAttemptControls();
};
testController.prototype.PopulateTestInfo = function()
{
	console.log(this.testInfo);
	var html = "<div class='col-xs-12 col-sm-12 col-md-4 col-lg-4'><h4>"+this.testInfo.title+"</h4></div>"+
			   "<div class='col-xs-12 col-sm-12 col-md-2 col-lg-2'>"+
			   		"<h5>"+this.testInfo.totalQues+" Questions / "+this.testInfo.totalMarks+" Marks</h5>"+
			   	"</div>"+
			   	"<div class='col-xs-0 col-sm-0 col-md-3 col-lg-3'>"+
			   		"<h5>Time Limit: "+this.testInfo.totalTime+" mins</h5>"+
			   "</div>"+
			   "<div class='col-xs-6 col-sm-6 col-md-1 col-lg-1'>"+
			   		"<h4>00:59:43</h4>"+
			   	"</div>"+
			   	"<div class='col-xs-6 col-sm-6 col-md-2 col-lg-2 divButton'>"+
			   		"<button class='button button-default btnSubmitTest'>Submit Test</button>"+
			   "</div>";
	$('.test-header').html(html);
};
testController.prototype.PopulateTestQuestionStatus = function()
{
	var html = "<div class='ques-status'>"+
					"<h4>Question Status</h4>";
	for(var i=0; i<this.testInfo.totalQues; i++){
		html += "<div class='not-visited' ques-no='"+(i+1)+"' ques-id='"+(i+1)+"'>"+(i+1)+"</div>";
	}
	html += "</div>";
	$('.test-ques-status').html(html);
};
testController.prototype.DisplayQuestion = function()
{
	var optionValues = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
	var question = this.questionsData[this.currentQues-1];
	var html = "<div class='question' question-id='"+question.id+"' question-index='"+this.currentQues+"'>"+
					"<div class='question-desc'>"+
						"<span class='question-number'>"+(this.currentQues)+"</span>";
	if(question.paragraph == "true"){
		html += "<span class='para-text'>"+question.paragraphText+"</span>";
	}
	html += "<span class='question-text'>"+question.questionText+"</span>"+
			"</div>"+
			"<div class='options'>";
	$(question.options).find('option').each(function(key, value){
		var addClass = 'option';
		html += "<div class='"+addClass+"' data-option='"+key+"'>"+
					"<span class='option-count'>"+optionValues[key]+"</span>"+
					"<span class='option-value'>"+$(value).html()+"</span>"+
					"<span class='answer-status'></span>"+
				"</div>";
	});
	html += "</div>";
	
	$('.test').find('.test-questions').find('.questions').html(html);
	
	$('.test').find('.test-questions').find('.questions').find('.option').unbind().bind('click', function(e){
		console.log("Clicked option: "+$(e.currentTarget).attr('data-option'));
		$('.test').find('.test-questions').find('.questions').find('.option').each(function(key, value){
			$(value).css('border-color','#E4E4E4');
			$(value).find('.option-count').css('background-color', '#E4E4E4');
			$(value).find('.option-count').css('border-color', '#E4E4E4');
			$(value).find('.option-count').css('color', '#000');
		});
		$(e.currentTarget).css('border-color', '#2E6DA4');
		$(e.currentTarget).find('.option-count').css('background-color', '#2E6DA4');
		$(e.currentTarget).find('.option-count').css('border-color', '#2E6DA4');
		$(e.currentTarget).find('.option-count').css('color', '#FFF');
		var selectedOption = parseInt($(e.currentTarget).attr('data-option'));
		var answer = '[';
		for(var i=0;i<=selectedOption;i++){
			if(i == selectedOption){
				answer += 'true]';
			}
			else{
				answer += 'false,';
			}
		}
		this.questionsData[this.currentQues-1].markedoption = answer;
		var questionId = $(e.currentTarget).parents('.options').parents('.question').attr('question-id');
		var requestData = {
				'sessionId': this.sessionId,
				'quesId': questionId,
				'answer': answer,
				'corectAnswer': null,
				'timeSpent': 10,
				'markedForReview': 'false'
		};
		this.SaveLastQues(this.sessionId, this.currentQues);
		this.UpdateTestSessionData(requestData);
	}.bind(this));
};
testController.prototype.PopulateAttemptControls = function()
{
	var html = "<div class='col-xs-12 col-sm-12 col-md-2 col-lg-2'>"+
					"<a href='#' class='linkClearSelection'>Clear Selection</a>"+
			   "</div>"+
			   "<div class='col-xs-6 col-sm-6 col-md-2 col-lg-2'>"+
					"<a href='#' class='linkMark'>Mark for Review</a>"+
				"</div>"+
				"<div class='col-xs-6 col-sm-6 col-md-2 col-lg-2'>"+
					"<a href='#' class='linkUnmark'>Unmark for Review</a>"+
				"</div>"+
				"<div class='col-xs-6 col-sm-6 col-md-2 col-lg-2 col-md-offset-1 col-lg-offset-1'>"+
					"<button class='btn btn-primary btnPrevious'>Previous</button>"+
			    "</div>"+
			    "<div class='col-xs-6 col-sm-6 col-md-2 col-lg-2'>"+
			    	"<button class='btn btn-primary btnNext'>Next</button>"+
				"</div>";
	$('.test').find('.test-questions').find('.attempt-controls').html(html);
	this.ManageControls();
	$('.test').find('.test-questions').find('.attempt-controls').find('.btnNext').unbind().bind('click', function(e){
		this.SaveLastQues(this.sessionId, this.currentQues);
		this.currentQues = this.currentQues + 1;
		this.DisplayQuestion();
		this.ManageControls();
	}.bind(this));
	$('.test').find('.test-questions').find('.attempt-controls').find('.btnPrevious').unbind().bind('click', function(e){
		this.SaveLastQues(this.sessionId, this.currentQues);
		this.currentQues = this.currentQues - 1;
		this.DisplayQuestion();
		this.ManageControls();
	}.bind(this));
	$('.test').find('.test-questions').find('.attempt-controls').find('.linkClearSelection').unbind().bind(function(e){
		e.preventDefault();
		this.questionsData[this.currentQues-1].markedoption = "[]";
		var questionId = this.questionsData[this.currentQues-1].id;
		var requestData = {
				'sessionId': this.sessionId,
				'quesId': questionId,
				'answer': '[]',
				'corectAnswer': null,
				'timeSpent': 10,
				'markedForReview': 'false'
		};
		this.UpdateTestSessionData(requestData);
	}.bind(this));
	$('.test').find('.test-questions').find('.attempt-controls').find('.linkMark').unbind().bind(function(e){
		e.preventDefault();
		var questionId = this.questionsData[this.currentQues-1].id;
		var requestData = {
				'sessionId': this.sessionId,
				'quesId': questionId,
				'answer': this.questionsData[this.currentQues-1].markedoption,
				'corectAnswer': null,
				'timeSpent': 10,
				'markedForReview': 'true'
		};
		this.UpdateTestSessionData(requestData);
	}.bind(this));
	$('.test').find('.test-questions').find('.attempt-controls').find('.linkUnmark').unbind().bind(function(e){
		e.preventDefault();
		var questionId = this.questionsData[this.currentQues-1].id;
		var requestData = {
				'sessionId': this.sessionId,
				'quesId': questionId,
				'answer': this.questionsData[this.currentQues-1].markedoption,
				'corectAnswer': null,
				'timeSpent': 10,
				'markedForReview': 'false'
		};
		this.UpdateTestSessionData(requestData);
	}.bind(this));
};
testController.prototype.ManageControls = function()
{
	if(this.currentQues == 1){
		//means displaying first question
		$('.test').find('.test-questions').find('.attempt-controls').find('.btnPrevious').attr('disabled', true);
		$('.test').find('.test-questions').find('.attempt-controls').find('.btnNext').attr('disabled', false);
	}
	else if(this.currentQues == this.testInfo.totalQues){
		$('.test').find('.test-questions').find('.attempt-controls').find('.btnNext').attr('disabled', true);
		$('.test').find('.test-questions').find('.attempt-controls').find('.btnPrevious').attr('disabled', false);
	}
	else{
		$('.test').find('.test-questions').find('.attempt-controls').find('.btnNext').attr('disabled', false);
		$('.test').find('.test-questions').find('.attempt-controls').find('.btnPrevious').attr('disabled', false);
	}
}
//Save the last attempted Question, so from next time test will open from the same question
testController.prototype.SaveLastQues = function(sessionId, lastQues)
{
	$.ajax({
		url: 'http://localhost:8083/test2bsure/lastsavedques?sessionId='+sessionId+'&lastQues='+lastQues,
		type: 'PUT',
		success: function(response){
			if(response.status == true){
				console.log("Saved last ques");
			}
			else{
				alert(response.message);
			}
		},
		error: function(e){
			console.log(e);
		}
	});
};
//Update the test session data
testController.prototype.UpdateTestSessionData = function(obj)
{
	$.ajax({
		url: 'http://localhost:8083/test2bsure/updatetestsessiondata',
		type: 'PUT',
		data: JSON.stringify(obj),
		contentType: "application/json",
		success: function(response){
			if(response.status == true){
				console.log("Updated test session data");
			}
			else{
				alert(response.message);
			}
		},
		error: function(e){
			console.log(e);
		}
	});
};