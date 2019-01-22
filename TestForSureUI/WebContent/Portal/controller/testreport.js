var testReportController = function(){
	this.id = 0;
	//report=1 means show report, report=0 means show solution
	this.report = 1;
	this.reportData = {};
	this.solutionData = {};
	this.testInfo = {};
	this.currentQues = 1;
	this.Init();
};
testReportController.prototype.Init = function()
{
	//Read id from query string
	this.id = test2bsureController.getObj().QueryString(window.location.href, 'sessionId');
	this.report = test2bsureController.getObj().QueryString(window.location.href, 'report');
	if(this.report == undefined){
		this.report = 1;
	}
	this.LoadData();
}
testReportController.prototype.LoadData = function()
{
	var id = this.id;
	fetch('http://localhost:8083/test2bsure/testreportdata?sessionId='+id)
	  .then(response => response.json())
	  .then(data => this.SetState({ testInfo: data.testInfo, reportData: data.reportData, solutionData: data.solutionData }));
}
testReportController.prototype.SetState = function(obj)
{
	for(var key in obj){
		this[key] = obj[key];
	}
	this.PopulateReportHeader();
	if(this.report == 1){
		$('.solution-section').hide();
		$('.report-section').show();
		this.PopulateReport();
	}
	else if(this.report == 0){
		this.currentQues = 1;
		$('.report-section').hide();
		$('.solution-section').show();
		$('.btnSolution').text('Analysis');
		this.PopulateSolution();
	}
};
testReportController.prototype.PopulateReportHeader = function()
{
	var html = "<div class='col-xs-12 col-sm-12 col-md-8 col-lg-8'><h4>"+this.testInfo.title+"</h4></div>"+
		       "<div class='col-xs-6 col-sm-6 col-md-2 col-lg-2 divButton'>"+
			   		"<button class='button button-default btnSolution'>Solutions</button>"+
			   "</div>"+
			   "<div class='col-xs-6 col-sm-6 col-md-2 col-lg-2 divButton'>"+
					"<button class='button button-default btnDownloadReport'>Download Report</button>"+
			   "</div>";
	$('.report-header').html(html);
	$('.report-header').find('.btnSolution').unbind().bind('click', function(){
		this.SwitchReportSolution();
	}.bind(this));
};
testReportController.prototype.SwitchReportSolution = function()
{
	if(this.report == 1){
		this.report = 0;
		$('.report-section').hide();
		$('.solution-section').show();
		$('.btnSolution').text('Analysis');
		this.PopulateReport();
	}
	else if(this.report == 0){
		this.report = 1;
		this.currentQues = 1;
		$('.solution-section').hide();
		$('.report-section').show();
		$('.btnSolution').text('Solutions');
		this.PopulateSolution();
	}
};
testReportController.prototype.PopulateReport = function()
{
	this.PopulateBasicReport();
	this.PopulateTopperAverage();
	this.PopulateLeaderboard();
	this.DisplayCharts();
}
testReportController.prototype.PopulateBasicReport = function()
{
};
testReportController.prototype.PopulateTopperAverage = function()
{
};
testReportController.prototype.PopulateLeaderboard = function()
{
};
testReportController.prototype.DisplayCharts = function()
{
};


testReportController.prototype.PopulateSolution = function()
{
	this.PopulateQuestionStatus();
	this.DisplayQuestion();
	this.PopulateAttemptControls();
};
testReportController.prototype.PopulateQuestionStatus = function()
{
	var html = "";
	for(var i = 0; i < this.testInfo.totalQues; i++){
		var questionStatus = 'missed';
		var question = this.solutionData[i];
		var markedAnswer = -1;
		var correctAnswer = -1;
		if(question.markedOption == 'null' || question.markedOption == null){
			//Skipped Question
			questionStatus = 'skipped';		
		}
		else if(question.markedOption == '[]'){
			//Missed Question
			questionStatus = 'missed';
		}
		else if(question.markedOption != 'null' && question.markedOption != null && question.markedOption != '[]'){
			markedAnswer = (JSON.parse(question.markedOption)).indexOf(true);
			if(question.correctOption != 'null' && question.correctOption != null && question.correctOption != '[]'){
				correctAnswer = (JSON.parse(question.correctOption)).indexOf(true);
			}
			if(markedAnswer == correctAnswer){
				//correct answer
				questionStatus = 'correct';
			}
			else{
				//Wrong answer
				questionStatus = 'wrong';
			}
		}
		
		if(question.marked == 'true'){
			//Marked for review
			questionStatus = 'marked';
		}
			
		html += "<div class='" + questionStatus + "' ques-no='"+(i+1)+"' ques-id='"+(question.id)+"'>"+(i+1)+"</div>";
	}
	$('.solution-ques-status').find('.ques-status').html(html);
	$('.solution-ques-status').find('.ques-status').find('div[ques-id]').unbind().bind('click', function(e){
		this.currentQues = parseInt($(e.currentTarget).attr('ques-no'));
		this.DisplayQuestion();
		this.ManageControls();
	}.bind(this));
};
testReportController.prototype.DisplayQuestion = function()
{
	this.CurrentQuesStatusHighlight();
	var optionValues = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
	var question = this.solutionData[this.currentQues-1];
	var html = "<div class='question' question-id='"+question.id+"' question-index='"+this.currentQues+"'>"+
					"<div class='question-desc'>"+
						"<span class='question-number'>"+(this.currentQues)+"</span>";
	if(question.paragraph == "true"){
		html += "<span class='para-text'>"+question.paragraphText+"</span>";
	}
	html += "<span class='question-text'>"+question.questionText+"</span>"+
			"</div>"+
			"<div class='question-info'><span>Time Spent: "+question.timeSpent+" secs</span></div>"+
			"<div class='options'>";
	var markedAnswer = -1;
	if(question.markedOption != 'null' && question.markedOption != null && question.markedOption != '[]'){
		markedAnswer = (JSON.parse(question.markedOption)).indexOf(true);
	}
	var correctAnswer = -1;
	if(question.correctOption != 'null' && question.correctOption != null && question.correctOption != '[]'){
		correctAnswer = (JSON.parse(question.correctOption)).indexOf(true);
	}
	var correct = -1;
	var incorrect = -1;
	if(markedAnswer == correctAnswer){
		//correct answer
		correct = markedAnswer;
	}
	else{
		//Wrong answer
		correct = correctAnswer;
		incorrect = markedAnswer;
	}
	$(question.options).find('option').each(function(key, value){
		var addClass = 'option';
		if(key == correct){
			html += "<div class='"+addClass+"' data-option='"+key+"' selected='selected' style='border-color:#5CB85C'>"+
						"<span class='option-count' style='background-color: #5CB85C; border-color: #5CB85C; color: rgb(255, 255, 255);'>"+optionValues[key]+"</span>"+
						"<span class='option-value'>"+$(value).html()+"</span>"+
						"<span class='answer-status'></span>"+
					"</div>";
		}
		else if(key == incorrect){
			html += "<div class='"+addClass+"' data-option='"+key+"' selected='selected' style='border-color:#D9534F'>"+
						"<span class='option-count' style='background-color: #D9534F; border-color: #D9534F; color: rgb(255, 255, 255);'>"+optionValues[key]+"</span>"+
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
	
	$('.solution-section').find('.solution-questions').find('.questions').html(html);
};
testReportController.prototype.PopulateAttemptControls = function()
{
	var html = "<div class='col-xs-6 col-sm-6 col-md-2 col-lg-2 col-md-offset-4 col-lg-offset-4'>"+
					"<button class='button button-primary btnPrevious'>Previous</button>"+
			    "</div>"+
			    "<div class='col-xs-6 col-sm-6 col-md-2 col-lg-2'>"+
			    	"<button class='button button-primary btnNext'>Next</button>"+
				"</div>";
	$('.solution-section').find('.solution-questions').find('.attempt-controls').html(html);
	this.ManageControls();
	$('.solution-section').find('.solution-questions').find('.attempt-controls').find('.btnNext').unbind().bind('click', function(e){
		this.currentQues = this.currentQues + 1;
		this.DisplayQuestion();
		this.ManageControls();
	}.bind(this));
	$('.solution-section').find('.solution-questions').find('.attempt-controls').find('.btnPrevious').unbind().bind('click', function(e){
		this.currentQues = this.currentQues - 1;
		this.DisplayQuestion();
		this.ManageControls();
	}.bind(this));
};
testReportController.prototype.ManageControls = function()
{
	if(this.currentQues == 1){
		//means displaying first question
		$('.solution-section').find('.solution-questions').find('.attempt-controls').find('.btnPrevious').attr('disabled', true);
		$('.solution-section').find('.solution-questions').find('.attempt-controls').find('.btnNext').attr('disabled', false);
	}
	else if(this.currentQues == this.testInfo.totalQues){
		$('.solution-section').find('.solution-questions').find('.attempt-controls').find('.btnNext').attr('disabled', true);
		$('.solution-section').find('.solution-questions').find('.attempt-controls').find('.btnPrevious').attr('disabled', false);
	}
	else{
		$('.solution-section').find('.solution-questions').find('.attempt-controls').find('.btnNext').attr('disabled', false);
		$('.solution-section').find('.solution-questions').find('.attempt-controls').find('.btnPrevious').attr('disabled', false);
	}
}
testReportController.prototype.CurrentQuesStatusHighlight = function()
{
	$('.solution-ques-status').find('.ques-status').find('div').removeClass('selected');
	$('.solution-ques-status').find('.ques-status').find('div[ques-no='+this.currentQues+']').addClass('selected');
};