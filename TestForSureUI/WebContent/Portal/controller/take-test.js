var testController = function(){
	this.id = 0;
	this.testInfo = {};
	this.questionsData = {};
	this.sessionId = 0;
	this.currentQues = 1;
	this.attemptInfo = null;
	this.totalSecs = 0;
	this.startSecs = 0;
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
	var userId = -1;
	if(typeof userController != 'undefined' && typeof userController.getObj() != 'undefined' && (typeof userController.getObj().userData != 'undefined' && userController.getObj().userData != null) && typeof userController.getObj().userData.id != 'undefined'){
		userId = userController.getObj().userData.id;
	}
	fetch(remoteServer+'/test2bsure/testdata?testId='+id+'&userId='+userId)
	  .then(response => response.json())
	  .then(data => this.SetState({ testInfo: data.testInfo, questionsData: data.questionsData, sessionId: data.sessionId }));
}
testController.prototype.SetState = function(obj)
{
	for(var key in obj){
		this[key] = obj[key];
	}
	this.BindEvents();
	this.PopulateTestInfo();
	this.PopulateTestQuestionStatus();
	if(typeof this .testInfo.attemptInfo != 'undefined' && this.testInfo.attemptInfo != null && this.testInfo.attemptInfo.length > 0){
		for(var attempt in this.testInfo.attemptInfo){
			if(this.testInfo.attemptInfo[attempt].state == 1){
				//means the test is in resumed state
				this.attemptInfo = this.testInfo.attemptInfo[attempt];
			}
		}
	}
	if(typeof this.attemptInfo != 'undefined' && this.attemptInfo != null){
		this.currentQues = parseInt(this.attemptInfo.lastQues) + 1;
	}
	this.totalSecs = (parseInt(this.testInfo.totalTime) * 60) + 1;
	this.DisplayQuestion();
	this.PopulateAttemptControls();
	this.Timer();
};
testController.prototype.BindEvents = function()
{
	$('.link-pallete').unbind().bind('click', function(){
		if($('.test-ques-status').css('display') == 'none'){
			//means question pallete is not visible
			$('.test-ques-status').css('display', 'block');
			$('.link-pallete').find('img').attr('src', '../images/right-arrow.png');
			$('.link-pallete').css('right', $('.test-ques-status').width()+34+'px');
		}
		else{
			//means question pallete is visible
			$('.test-ques-status').css('display', 'none');
			$('.link-pallete').find('img').attr('src', '../images/left-arrow.png');
			$('.link-pallete').css('right', '0px');
		}
	});
};
testController.prototype.PopulateTestInfo = function()
{
	console.log(this.testInfo);
	var html = "<div class='col-xs-12 col-sm-12 col-md-4 col-lg-4'><h4>"+this.testInfo.title+"</h4></div>"+
			   "<div class='col-xs-12 col-sm-12 col-md-2 col-lg-2 removeInMobile'>"+
			   		"<h5>"+this.testInfo.totalQues+" Questions / "+this.testInfo.totalMarks+" Marks</h5>"+
			   	"</div>"+
			   	"<div class='col-xs-0 col-sm-0 col-md-2 col-lg-2 removeInMobile'>"+
			   		"<h5>Time Limit: "+this.testInfo.totalTime+" mins</h5>"+
			   "</div>"+
			   "<div class='col-xs-6 col-sm-6 col-md-2 col-lg-2 divTimer' style='text-align:right;'>"+
			   		"<h4 class='time-left'>00 : 00 : 00</h4>"+
			   	"</div>"+
			   	"<div class='col-xs-6 col-sm-6 col-md-2 col-lg-2 divButton'>"+
			   		"<button class='button button-default btnSubmitTest'>Submit Test</button>"+
			   "</div>";
	$('.test-header').html(html);
	$('.test-header').find('.btnSubmitTest').unbind().bind('click', function(){
		this.SubmitTest();
	}.bind(this));
};
testController.prototype.PopulateTestQuestionStatus = function()
{
	var html = "";
	for(var i=0; i<this.testInfo.totalQues; i++){
		var questionStatus = "not-visited";
		var question = this.questionsData[i];
		if(question.markedOption == "null"){
			//unanswered
			if(question.marked == "true"){
				//marked but unanswered
				questionStatus = "marked";
			}
			else if(question.marked == "false"){
				//unanswered
				questionStatus = "unanswered";
			}
		}
		else if(question.markedOption == "[]"){
			//not-visited
			questionStatus = "not-visited";
		}
		else{
			//Answered
			if(question.marked == "true"){
				//marked and answered
				questionStatus = "marked-answered";
			}
			else if(question.marked == "false"){
				//answered
				questionStatus = "answered";
			}
		}
		html += "<div class='" + questionStatus + "' ques-no='"+(i+1)+"' ques-id='"+(this.questionsData[i].id)+"'>"+(i+1)+"</div>";
	}
	$('.test-ques-status').find('.ques-status').html(html);
	$('.test-ques-status').find('.ques-status').find('div[ques-id]').unbind().bind('click', function(e){
		this.currentQues = parseInt($(e.currentTarget).attr('ques-no'));
		if($('.link-pallete').css('display') == 'block'){
			$('.test-ques-status').css('display', 'none');
			$('.link-pallete').find('img').attr('src', '../images/left-arrow.png');
			$('.link-pallete').css('right', '0px');
		}
		this.DisplayQuestion();
	}.bind(this));
};
testController.prototype.DisplayQuestion = function()
{
	this.startSecs = this.totalSecs;
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
	var markedAnswer = -1;
	if(question.markedOption != 'null' && question.markedOption != null && question.markedOption != '[]'){
		markedAnswer = (JSON.parse(question.markedOption)).indexOf(true);
	}
	$(question.options).find('option').each(function(key, value){
		var addClass = 'option';
		if(key == markedAnswer){
			html += "<div class='"+addClass+"' data-option='"+key+"' selected='selected' style='border-color:rgb(46, 109, 164)'>"+
						"<span class='option-count' style='background-color: rgb(46, 109, 164); border-color: rgb(46, 109, 164); color: rgb(255, 255, 255);'>"+optionValues[key]+"</span>"+
						"<span class='option-value'>"+$(value).html()+"</span>"+
						"<span class='answer-status'></span>"+
					"</div>";
		}
		else{
			html += "<div class='"+addClass+"' data-option='"+key+"'>"+
						"<span class='option-count'>"+optionValues[key]+"</span>"+
						"<span class='option-value'>"+$(value).html()+"</span>"+
						"<span class='answer-status'></span>"+
					"</div>";
		}
	});
	html += "</div>";
	
	$('.test').find('.test-questions').find('.questions').html(html);
	
	$('.test').find('.test-questions').find('.questions').find('.option').unbind().bind('click', function(e){
		console.log("Clicked option: "+$(e.currentTarget).attr('data-option'));
		this.UnselectAllOptions();
		$(e.currentTarget).attr('selected', 'true');
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
		this.questionsData[this.currentQues-1].markedOption = answer;
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
		if(this.questionsData[this.currentQues-1].marked == 'true'){
			//Marked for review and answered
			$('.ques-status').find('div[ques-id='+questionId+']').removeClass('not-visited answered unanswered marked').addClass('marked-answered');
		}
		else{
			$('.ques-status').find('div[ques-id='+questionId+']').removeClass('not-visited unanswered marked marked-answered').addClass('answered');
		}
	}.bind(this));
};
testController.prototype.PopulateAttemptControls = function()
{
	var html = "<div class='col-xs-12 col-sm-12 col-md-2 col-lg-2'>"+
					"<a href='#' class='linkClearSelection'>Clear Selection</a>"+
			   "</div>"+
			   "<div class='divMark col-xs-6 col-sm-6 col-md-2 col-lg-2'>"+
					"<a href='#' class='linkMark'>Mark for Review</a>"+
				"</div>"+
				"<div class='divUnmark col-xs-6 col-sm-6 col-md-2 col-lg-2'>"+
					"<a href='#' class='linkUnmark'>Unmark for Review</a>"+
				"</div>"+
				"<div class='divPrevious col-xs-6 col-sm-6 col-md-2 col-lg-2 col-md-offset-1 col-lg-offset-1'>"+
					"<button class='button button-primary btnPrevious'>Previous</button>"+
			    "</div>"+
			    "<div class='divNext col-xs-6 col-sm-6 col-md-2 col-lg-2'>"+
			    	"<button class='button button-primary btnNext'>Next</button>"+
				"</div>";
	$('.test').find('.test-questions').find('.attempt-controls').html(html);
	this.ManageControls();
	$('.test').find('.test-questions').find('.attempt-controls').find('.btnNext').unbind().bind('click', function(e){
		this.SaveLastQues(this.sessionId, this.currentQues);
		var questionId = this.questionsData[this.currentQues-1].id;
		var questionFlag = this.questionsData[this.currentQues-1].marked;
		//Save question
		var flag = false;
		var selectedOption = -1;
		$('.question').find('.options').find('.option').each(function(key, value){
			if($(value).attr('selected') == 'selected'){
				flag = true;
				selectedOption = key;
			}
		});
		var answer = null;
		if(questionFlag == 'true'){
			$('.ques-status').find('div[ques-id='+questionId+']').removeClass('not-visited answered unanswered marked-answered').addClass('marked');
		}
		else{
			$('.ques-status').find('div[ques-id='+questionId+']').removeClass('not-visited answered marked marked-answered').addClass('unanswered');
		}
		if(flag == true){
			if(questionFlag == 'true'){
				$('.ques-status').find('div[ques-id='+questionId+']').removeClass('not-visited answered unanswered marked').addClass('marked-answered');
			}
			else{
				$('.ques-status').find('div[ques-id='+questionId+']').removeClass('not-visited unanswered marked marked-answered').addClass('answered');
			}
			answer = '[';
			for(var i=0;i<=selectedOption;i++){
				if(i == selectedOption){
					answer += 'true]';
				}
				else{
					answer += 'false,';
				}
			}
		}
		this.questionsData[this.currentQues-1].markedOption = answer;
		this.currentQues = this.currentQues + 1;
		var requestData = {
				'sessionId': this.sessionId,
				'quesId': questionId,
				'answer': answer,
				'corectAnswer': null,
				'timeSpent': (this.startSecs - this.totalSecs),
				'markedForReview': 'false'
		};
		this.UpdateTestSessionData(requestData);
		
		this.DisplayQuestion();
		this.ManageControls();
	}.bind(this));
	$('.test').find('.test-questions').find('.attempt-controls').find('.btnPrevious').unbind().bind('click', function(e){
		this.SaveLastQues(this.sessionId, this.currentQues);
		var questionId = this.questionsData[this.currentQues-1].id;
		var questionFlag = this.questionsData[this.currentQues-1].marked;
		//Save question
		var flag = false;
		var selectedOption = -1;
		$('.question').find('.options').find('.option').each(function(key, value){
			if($(value).attr('selected') == 'selected'){
				flag = true;
				selectedOption = key;
			}
		});
		var answer = null;
		if(questionFlag == 'true'){
			$('.ques-status').find('div[ques-id='+questionId+']').removeClass('not-visited answered unanswered marked-answered').addClass('marked');
		}
		else{
			$('.ques-status').find('div[ques-id='+questionId+']').removeClass('not-visited answered marked marked-answered').addClass('unanswered');
		}
		if(flag == true){
			if(questionFlag == 'true'){
				$('.ques-status').find('div[ques-id='+questionId+']').removeClass('not-visited answered unanswered marked').addClass('marked-answered');
			}
			else{
				$('.ques-status').find('div[ques-id='+questionId+']').removeClass('not-visited unanswered marked marked-answered').addClass('answered');
			}
			answer = '[';
			for(var i=0;i<=selectedOption;i++){
				if(i == selectedOption){
					answer += 'true]';
				}
				else{
					answer += 'false,';
				}
			}
		}
		this.questionsData[this.currentQues-1].markedOption = answer;
		this.currentQues = this.currentQues - 1;
		var requestData = {
				'sessionId': this.sessionId,
				'quesId': questionId,
				'answer': answer,
				'corectAnswer': null,
				'timeSpent': (this.startSecs - this.totalSecs),
				'markedForReview': 'false'
		};
		this.UpdateTestSessionData(requestData);
		
		this.DisplayQuestion();
		this.ManageControls();
	}.bind(this));
	$('.test').find('.test-questions').find('.attempt-controls').find('.linkClearSelection').unbind().bind('click', function(e){
		e.preventDefault();
		this.questionsData[this.currentQues-1].markedOption = "null";
		var questionId = this.questionsData[this.currentQues-1].id;
		var requestData = {
				'sessionId': this.sessionId,
				'quesId': questionId,
				'answer': "null",
				'corectAnswer': null,
				'timeSpent': 10,
				'markedForReview': 'false'
		};
		this.UpdateTestSessionData(requestData);
		if(this.questionsData[this.currentQues-1].marked == 'true'){
			//marked for review
			$('.ques-status').find('div[ques-id='+questionId+']').removeClass('answered unanswered not-visited marked-answered').addClass('marked');
		}
		else{
			$('.ques-status').find('div[ques-id='+questionId+']').removeClass('not-visited answered marked marked-answered').addClass('unanswered');
		}
		this.UnselectAllOptions();
	}.bind(this));
	$('.test').find('.test-questions').find('.attempt-controls').find('.linkMark').unbind().bind('click', function(e){
		e.preventDefault();
		this.questionsData[this.currentQues-1].marked = 'true';
		var questionId = this.questionsData[this.currentQues-1].id;
		var requestData = {
				'sessionId': this.sessionId,
				'quesId': questionId,
				'answer': this.questionsData[this.currentQues-1].markedOption,
				'corectAnswer': null,
				'timeSpent': 10,
				'markedForReview': 'true'
		};
		this.UpdateTestSessionData(requestData);
		if(this.questionsData[this.currentQues-1].markedOption != 'null' && this.questionsData[this.currentQues-1].markedOption != '[]'){
			//means answered and marked
			$('.ques-status').find('div[ques-id='+questionId+']').removeClass('not-visited answered unanswered marked').addClass('marked-answered');
		}
		else{
			$('.ques-status').find('div[ques-id='+questionId+']').removeClass('not-visited answered unanswered marked-answered').addClass('marked');
		}
	}.bind(this));
	$('.test').find('.test-questions').find('.attempt-controls').find('.linkUnmark').unbind().bind('click', function(e){
		e.preventDefault();
		this.questionsData[this.currentQues-1].marked = 'false';
		var questionId = this.questionsData[this.currentQues-1].id;
		var requestData = {
				'sessionId': this.sessionId,
				'quesId': questionId,
				'answer': this.questionsData[this.currentQues-1].markedOption,
				'corectAnswer': null,
				'timeSpent': 10,
				'markedForReview': 'false'
		};
		this.UpdateTestSessionData(requestData);
		if(this.questionsData[this.currentQues-1].markedOption != 'null' && this.questionsData[this.currentQues-1].markedOption != '[]'){
			//means answered and unmarked
			$('.ques-status').find('div[ques-id='+questionId+']').removeClass('not-visited marked-answered unanswered marked').addClass('answered');
		}
		else{
			$('.ques-status').find('div[ques-id='+questionId+']').removeClass('not-visited answered marked-answered marked').addClass('unanswered');
		}
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
		url: remoteServer+'/test2bsure/lastsavedques?sessionId='+sessionId+'&lastQues='+lastQues,
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
		url: remoteServer+'/test2bsure/updatetestsessiondata',
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
testController.prototype.UnselectAllOptions = function()
{
	$('.test').find('.test-questions').find('.questions').find('.option').each(function(key, value){
		$(value).css('border-color','#E4E4E4');
		$(value).find('.option-count').css('background-color', '#E4E4E4');
		$(value).find('.option-count').css('border-color', '#E4E4E4');
		$(value).find('.option-count').css('color', '#000');
		$(value).removeAttr('selected');
	});
};
testController.prototype.Timer = function()
{
	var totalSecs = (parseInt(this.testInfo.totalTime) * 60) + 1;
	this.totalSecs = (parseInt(this.testInfo.totalTime) * 60) + 1;
	var interval = setInterval(function() {
		totalSecs = parseInt(totalSecs) - 1;
		this.totalSecs = parseInt(this.totalSecs) - 1;
		if(totalSecs <= 0){
			clearInterval(interval);
			this.SubmitTest();
			alert("Time is Over !!");
		}
		var mins =  parseInt(totalSecs / 60);
		var secs = parseInt(totalSecs % 60);
		var hrs =  parseInt(mins / 60);
		mins = parseInt(mins % 60);
		
		if(hrs<10){
			hrs = '0'+hrs;
		}
		if(mins<10){
			mins = '0'+mins;
		}
		if(secs<10){
			secs = '0'+secs;
		}
		$('.test-header').find('.time-left').html(hrs + " : " + mins + " : " + secs);
	}.bind(this), 1000);
};
testController.prototype.SubmitTest = function()
{
	$('#submitTestModal').modal('show');
	var answered = 0;
	var unanswered = 0;
	var notvisited = 0;
	var marked = 0;
	$('.test-ques-status').find('.ques-status').find('div[ques-no]').each(function(key, value){
		if($(value).hasClass('not-visited')){
			notvisited++;
		}
		else if($(value).hasClass('answered')){
			answered++;
		}
		else if($(value).hasClass('unanswered')){
			unanswered++;
		}
		else if($(value).hasClass('marked')){
			marked++
		}
		else if($(value).hasClass('marked-answered')){
			marked++;
			answered++;
		}
	}.bind(this));
	var html = '<table>'+
					'<tr>'+
						'<td>Total Questions</td>'+
						'<td>'+this.testInfo.totalQues+'</td>'+
					'</tr>'+
						'<tr>'+
						'<td>Attempted</td>'+
						'<td>'+answered+'</td>'+
					'</tr>'+
					'<tr>'+
						'<td>Unattempted</td>'+
						'<td>'+unanswered+'</td>'+
					'</tr>'+
					'<tr>'+
						'<td>Not Visited</td>'+
						'<td>'+notvisited+'</td>'+
					'</tr>'+
					'<tr>'+
						'<td>Marked for Review</td>'+
						'<td>'+marked+'</td>'+
					'</tr>'+
			   '</table>';
	$('#submitTestModal').find('.modal-body').html(html);
	$('#submitTestModal').find('#btnSubmitTestYes').unbind().bind('click', function(){
		this.SaveReportData();
	}.bind(this));
	$('#submitTestModal').find('#btnSubmitTestNo').unbind().bind('click', function(){
		$('#submitTestModal').modal('hide');
	});
};
testController.prototype.SaveReportData = function()
{
	var session = this.sessionId;
	var userId = -1;
	if(typeof userController != 'undefined' && typeof userController.getObj() != 'undefined' && (typeof userController.getObj().userData != 'undefined' && userController.getObj().userData != null) && typeof userController.getObj().userData.id != 'undefined'){
		userId = userController.getObj().userData.id;
	}
	fetch(remoteServer+'/test2bsure/submittest?sessionId='+session+'&userId='+userId)
	  .then(response => response.json())
	  .then(data => this.HandleTestSubmit());
};
testController.prototype.HandleTestSubmit = function()
{
	this.OpenTestReport();
}
testController.prototype.OpenTestReport = function()
{
	//report=1 means show report, report=0 means show solution
	window.location.href = 'testreport.html?sessionId='+this.sessionId+'&report=1';
}