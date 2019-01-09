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
	var correct = question.correctOption != null ? (JSON.parse(question.correctOption)).indexOf(true) : -1;
	var marked = question.markedOption != null ? (JSON.parse(question.markedOption)).indexOf(true) : -1;
	var redOption = -1;
	var greenOption = -1;
	if(correct != null && marked != null){
		if(correct == marked){
			greenOption = marked;
		}
		else{
			greenOption = correct;
			redOption = marked;
		}
	}
	$(question.options).find('option').each(function(key, value){
		var addClass = 'option';
		if(key == redOption){
			addClass = 'option incorrect';
		}
		else if(key == greenOption){
			addClass = 'option correct';
		}
		if(typeof solution != 'undefined' && solution == true){
			addClass += ' no-hover block-events';
		}
		html += "<div class='"+addClass+"' data-option='"+key+"'>"+
					"<span class='option-count'>"+optionValues[key]+"</span>"+
					"<span class='option-value'>"+$(value).html()+"</span>"+
					"<span class='answer-status'></span>"+
				"</div>";
	});
	html += "</div>";
	
	$('.test').find('.test-questions').find('.questions').html(html);
	
	$('.test').find('.test-questions').find('.questions').find('.option').unbind().bind('click', function(e){
		console.log("Clicked option");
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
		this.currentQues = this.currentQues + 1;
		this.DisplayQuestion();
		this.ManageControls();
	}.bind(this));
	$('.test').find('.test-questions').find('.attempt-controls').find('.btnPrevious').unbind().bind('click', function(e){
		this.currentQues = this.currentQues - 1;
		this.DisplayQuestion();
		this.ManageControls();
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