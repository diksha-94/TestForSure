var testController = function(){
	this.id = 0;
	this.testInfo = {};
	this.questionsData = {};
	this.sessionId = 0;
	this.currentQues = 1;
	this.attemptInfo = null;
	this.totalSecs = 0;
	this.startSecs = 0;
	this.start = -1; //start=1 means start the test, else show the instructions
	this.Init();
};
testController.prototype.Init = function()
{
	document.addEventListener('contextmenu', event => event.preventDefault());
	//Read id from query string
	this.id = test2bsureController.getObj().QueryString(window.location.href, 'id');
	this.start = test2bsureController.getObj().QueryString(window.location.href, 'start');
	this.start = typeof this.start == 'undefined' ? -1 : this.start;
	test2bsureController.getObj().SelfAuth(function(){
		if(this.start == 1){
			$('.testStart').removeClass('hide');
			this.LoadData();
		}
		else{
			$('.testInstruction').removeClass('hide');
			this.LoadInstructions();
		}
	}.bind(this));
};
testController.prototype.LoadInstructions = function()
{
	var id = this.id;
	var userId = -1;
	if(typeof userController != 'undefined' && typeof userController.getObj() != 'undefined' && (typeof userController.getObj().userData != 'undefined' && userController.getObj().userData != null) && typeof userController.getObj().userData.id != 'undefined'){
		userId = userController.getObj().userData.id;
	}
	fetch(remoteServer+'/test2bsure/test?id='+id)
	  .then(response => response.json())
	  .then(data => this.SetInstructionState({ testInfo: data.data[0] }));
}
testController.prototype.SetInstructionState = function(obj)
{
	for(var key in obj){
		this[key] = obj[key];
	}
	this.PopulateInstructions();
	this.BindInstructionEvents();
};
testController.prototype.PopulateInstructions = function()
{
	$('.testInstruction .instruction-header').find('h4').html(this.testInfo.title);
	$('.testInstruction .instruction-data').find('.right .username').text(userController.getObj().userData.name);
	$('.instruction-content').find('.totalQues').text(this.testInfo.totalQues);
	$('.instruction-content').find('.correctMark').text(parseInt(this.testInfo.totalMarks) / parseInt(this.testInfo.totalQues) + ' mark(s)');
	$('.instruction-content').find('.incorrectMark').text(this.testInfo.negativeMarks + ' mark(s)');
	$('.instruction-content').find('.totalTime').text(this.testInfo.totalTime);
	if(this.testInfo.instructions.length > 0){
		//Additional Instructions
		var html = "<h5>Additional Instructions</h5>";
		html += this.testInfo.instructions;
		$('.instruction-content').find('.additional-instructions').html(html);
	}
};
testController.prototype.BindInstructionEvents = function()
{
	$('.instruction-acceptance').unbind().on('change', function(e){
		if($(e.currentTarget).prop('checked')){
			$('.btnStartTestIns').attr('disabled', false);
			$('.instruction-footer').find('span.red').hide();
		}
		else{
			$('.btnStartTestIns').attr('disabled', true);
			$('.instruction-footer').find('span.red').show();
		}
	});
	$('.btnStartTestIns').unbind().bind('click', function(){
		window.location.href = 'take-test.html?id='+this.id+'&start=1';
	}.bind(this));
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
	var html = "<div class='col-xs-12 col-sm-12 col-md-3 col-lg-3 first'>"+
			   		"<h4>"+this.testInfo.title+"</h4></div>"+
			   "<div class='col-xs-12 col-sm-12 col-md-3 col-lg-3 quesMark-info removeInMobile'>"+
			   		"<div class='info'>"+
			   			"<h5>"+this.testInfo.totalQues+" Ques / "+this.testInfo.totalMarks+" Marks</h5>"+
			   		"</div>"+
			   		"<div class='detail'>"+
			   			"<span class='correct'>+"+(this.testInfo.totalMarks/this.testInfo.totalQues)+" Mark</span>";
	if(this.testInfo.negativeMarks > 0){
		html += "<span class='incorrect'>-"+this.testInfo.negativeMarks+" Mark</span>";
	}
	html += "</div>"+
			   	"</div>"+
			   	"<div class='col-xs-0 col-sm-0 col-md-2 col-lg-2 removeInMobile timeLimit'>"+
			   		"<h5>Time Limit: "+this.testInfo.totalTime+" mins</h5>"+
			   "</div>"+
			   "<div class='col-xs-6 col-sm-6 col-md-2 col-lg-2 divTimer'>"+
			   		"<img src='../images/circular-clock.png' alt='Test Time' class='test-timer-img'>"+
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
		var requestData = {
				'sessionId': this.sessionId,
				'quesId': questionId,
				'answer': answer,
				'corectAnswer': null,
				'timeSpent': (this.startSecs - this.totalSecs),
				'markedForReview': 'false'
		};
		this.UpdateTestSessionData(requestData);
		this.currentQues = parseInt($(e.currentTarget).attr('ques-no'));
		
		if($('.link-pallete').css('display') == 'block'){
			$('.test-ques-status').css('display', 'none');
			$('.link-pallete').find('img').attr('src', '../images/left-arrow.png');
			$('.link-pallete').css('right', '0px');
		}
		this.DisplayQuestion();
		this.ManageControls();
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
	if(question.paragraph == "true" || question.paragraph == "1"){
		html += "<div class='ques-detail'>"+
					"<span class='para-text'>"+question.paragraphText+"</span>"+
					"<span class='question-text'>"+question.questionText+"</span>"+
				"</div>";
	}
	else{
		html += "<span class='question-text'>"+question.questionText+"</span>";
	}
	html += "</div>"+
			"<div class='options'>";
	var markedAnswer = -1;
	if(question.markedOption != 'null' && question.markedOption != null && question.markedOption != '[]'){
		markedAnswer = (JSON.parse(question.markedOption)).indexOf(true);
	}
	var options = question.options;
	if(options.startsWith('"')){
		options = options.substring(1);
	}
	if(options.endsWith('"')){
		options = options.substring(0, options.length-1);
	}
	$(options).find('option').each(function(key, value){
		var addClass = 'option';
		if(key == markedAnswer){
			html += "<div class='"+addClass+" col-xs-12 col-sm-12 col-md-12 col-lg-12' data-option='"+key+"' selected='selected' style='border-color:rgb(46, 109, 164)'>"+
						"<div class='col-xs-2 col-sm-1 col-md-1 col-lg-1' style='padding:0px;'>"+
							"<span class='option-count' style='background-color: rgb(46, 109, 164); border-color: rgb(46, 109, 164); color: rgb(255, 255, 255);'>"+optionValues[key]+"</span>"+
						"</div>"+
						"<div class='col-xs-10 col-sm-11 col-md-11 col-lg-11' style='padding:0px; margin-top: 8px;'>"+
							"<span class='option-value'>"+$(value).html()+"</span>"+
						"</div>"+
						"<span class='answer-status'></span>"+
					"</div>";
		}
		else{
			html += "<div class='"+addClass+" col-xs-12 col-sm-12 col-md-12 col-lg-12' data-option='"+key+"'>"+
						"<div class='col-xs-2 col-sm-1 col-md-1 col-lg-1' style='padding:0px;'>"+
							"<span class='option-count'>"+optionValues[key]+"</span>"+
						"</div>"+
						"<div class='col-xs-10 col-sm-11 col-md-11 col-lg-11' style='padding:0px; margin-top: 8px;'>"+
							"<span class='option-value'>"+$(value).html()+"</span>"+
						"</div>"+
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
				'timeSpent': (this.startSecs - this.totalSecs),
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
	var html =  "<div class='clearDiv col-xs-6 col-sm-6 col-md-2 col-lg-2'>"+
					"<div class='col-xs-12 col-sm-12 col-md-12 col-lg-12'>"+
						"<a href='#' class='linkClearSelection'>Clear Selection</a>"+
					"</div>"+
				"</div>"+
				"<div class='markDiv col-xs-6 col-sm-6 col-md-4 col-lg-4'>"+
					"<div class='divMark col-xs-12 col-sm-12 col-md-6 col-lg-6'>"+
						"<a href='#' class='linkMark'>Mark for Review</a>"+
					"</div>"+
					"<div class='divUnmark col-xs-12 col-sm-12 col-md-6 col-lg-6'>"+
						"<a href='#' class='linkUnmark'>Unmark for Review</a>"+
					"</div>"+
				"</div>"+
				"<div class='buttonsDiv col-xs-12 col-sm-12 col-md-5 col-lg-5'>"+
					"<div class='divPrevious col-xs-6 col-sm-6 col-md-5 col-lg-5 col-md-offset-2 col-lg-offset-2'>"+
						"<button class='button button-primary btnPrevious'>Previous</button>"+
				    "</div>"+
				    "<div class='divNext col-xs-6 col-sm-6 col-md-5 col-lg-5'>"+
				    	"<button class='button button-primary btnNext'>Next</button>"+
					"</div>"+
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
				'timeSpent': (this.startSecs - this.totalSecs),
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
				'timeSpent': (this.startSecs - this.totalSecs),
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
				'timeSpent': (this.startSecs - this.totalSecs),
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
	this.startSecs = this.totalSecs;
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
	//Resumed state
	var startedAt = "";
	if(typeof this.testInfo.attemptInfo != 'undefined' && this.testInfo.attemptInfo != null && this.testInfo.attemptInfo.length > 0){
		for(var attempt in this.testInfo.attemptInfo){
			if(this.testInfo.attemptInfo[attempt].state == 1){
				//means the test is in resumed state
				startedAt = this.testInfo.attemptInfo[attempt].updatedOn;
			}
		}
	}
	var passedSeconds = 0;
	if(startedAt.length > 0){
		startedAt = new Date(startedAt);
		passedSeconds = (new Date() - startedAt)/1000;
	}
	
	var totalSecs = (parseInt(this.testInfo.totalTime) * 60) + 1;
	this.totalSecs = (parseInt(this.testInfo.totalTime) * 60) + 1;
	if(passedSeconds > 0){
		totalSecs = totalSecs - passedSeconds;
		this.totalSecs = this.totalSecs - passedSeconds;
	}
	if(totalSecs <= 0){
		this.SubmitTest(1);
		alert("Time is Over !!");
		return;
	}
	var interval = setInterval(function() {
		totalSecs = parseInt(totalSecs) - 1;
		this.totalSecs = parseInt(this.totalSecs) - 1;
		if(totalSecs <= 0){
			clearInterval(interval);
			this.SubmitTest(1);
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
testController.prototype.SubmitTest = function(timeover = 0)
{
	//Save the last question
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
	
	if(timeover == 1){
		//Auto submit the test
		this.SaveReportData();
		return;
	}
	
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
	//Calculate reward points here
	test2bsureController.getObj().CalculateRewardPointsEarned(0, this.sessionId, this.id, parseInt(this.testInfo.totalMarks), function(response){
		window.location.href = 'testreport.html?sessionId='+this.sessionId+'&report=1&reward='+response.earnedRewardPoints;
	}.bind(this));
	
}