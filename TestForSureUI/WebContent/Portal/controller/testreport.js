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
		this.PopulateSolution();
	}
	else if(this.report == 0){
		this.report = 1;
		this.currentQues = 1;
		$('.solution-section').hide();
		$('.report-section').show();
		$('.btnSolution').text('Solutions');
		this.PopulateReport();
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
	var html = "";
	var accuracy = Math.floor(((this.reportData.correctCount*100)/this.reportData.quesAttempted), 2);
	var percentile = ((this.reportData.totalCandidate - this.reportData.rank)*100)/this.reportData.totalCandidate;
	percentile = Math.floor(percentile, 2);
	html += "<div class='greeting'>"+
				"<img src='' alt='award'/>"+
				"<h4>Congrats User !!</h4>"+
			"</div>"+
			"<div class='report-detail col-xs-12 col-sm-12 col-md-12 col-lg-12'>"+
				"<div class='item rank col-xs-6 col-sm-6 col-md-2 col-lg-2'>"+
					"<img src='../images/dummy.jpg' alt='Rank'/><span>Rank</span><span class='detail'>"+
					this.reportData.rank+" / "+this.reportData.totalCandidate+"</span>"+
				"</div>"+
				"<div class='item score col-xs-6 col-sm-6 col-md-2 col-lg-2'>"+
					"<img src='../images/dummy.jpg' alt='Score'/><span>Score</span><span class='detail'>"+
					this.reportData.markesScored+" / "+this.testInfo.totalMarks+"</span>"+
				"</div>"+
				"<div class='item ques col-xs-6 col-sm-6 col-md-2 col-lg-2'>"+
					"<img src='../images/dummy.jpg' alt='Questions'/><span>Ques Attempted</span><span class='detail'>"+
					this.reportData.quesAttempted+" / "+this.testInfo.totalQues+"</span>"+
				"</div>"+
				"<div class='item time col-xs-6 col-sm-6 col-md-2 col-lg-2'>"+
					"<img src='../images/dummy.jpg' alt='Time'/><span>Time Taken</span><span class='detail'>"+
					(parseInt(this.reportData.timeTaken/60))+" mins</span>"+
				"</div>"+
				"<div class='item accuracy col-xs-6 col-sm-6 col-md-2 col-lg-2'>"+
					"<img src='../images/dummy.jpg' alt='Accuracy'/><span>Accuracy</span><span class='detail'>"+
					accuracy+"</span>"+
				"</div>"+
				"<div class='item percentile col-xs-6 col-sm-6 col-md-2 col-lg-2'>"+
					"<img src='../images/dummy.jpg' alt='Percentile'/><span>Percentile</span><span class='detail'>"+
					percentile+"</span>"+
				"</div>"+
			"</div>";
	$('.report-section').find('.report-basic').html(html);
			
};
testReportController.prototype.PopulateTopperAverage = function()
{
	$('.report-section').find('.report-advanced').find('.topper-average').empty();
	var topperScore = this.reportData.leaderboard[0].marksScored;
	var topperTime = parseInt(this.reportData.leaderboard[0].timeTaken/60);
	var averageScore = 0;
	var averageTime = 0;
	var totalScore = 0;
	var totalTime = 0;
	for(var data in this.reportData.leaderboard){
		totalScore += this.reportData.leaderboard[data]["marksScored"];
		totalTime += this.reportData.leaderboard[data]["timeTaken"];
	}
	averageScore = totalScore;
	averageTime = parseInt(totalTime/60);
	var html = "<div class='topper'>"+
					"<span>Topper's Score: "+topperScore+"</span>"+
					"<span>Topper's Time: "+topperTime+" mins</span>"+
			   "</div>"+
			   "<div class='average'>"+
					"<span>Average Score: "+averageScore+"</span>"+
					"<span>Average Time: "+averageTime+" mins</span>"+
			   "</div>";
	$('.report-section').find('.report-advanced').find('.topper-average').append(html);
};
testReportController.prototype.PopulateLeaderboard = function()
{
	var html = "";
	html = "<table>"+
				"<thead>"+
					"<tr>"+
						"<th>Rank</th>"+
						"<th>Marks Scored</th>"+
						"<th>Time Taken</th>"+
					"</tr>"
				"</thead>"+
				"<tbody>";
	var count = 5;
	if(this.reportData.leaderboard.length < 5){
		count = this.reportData.leaderboard.length;
	}
	for(var i=0;i<count;i++){
		html += "<tr>"+
					"<td>"+(parseInt(i)+1)+"</td>"+
					"<td>"+(this.reportData.leaderboard[i].marksScored)+"</td>"+
					"<td>"+(parseInt(this.reportData.leaderboard[i].timeTaken/60))+"</td>"+
				"</tr>";
	}
	if(this.reportData.rank > 5){
		html += "<tr>"+
					"<td>"+(this.reportData.rank)+"</td>"+
					"<td>"+(this.reportData.markesScored)+"</td>"+
					"<td>"+(parseInt(this.reportData.leaderboard[i].timeTaken/60))+"</td>"+
				"</tr>";
	}
	html += "</tbody>"+
			"</table>";
	html += "<div><button class='button button-primary' id='btnShowLeaderboard'>View Full Leaderboard</button>";
	$('.report-section').find('.report-advanced').find('.topper-average').append(html);
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
	html += "<div class='ques-solution'><h5>Solution: </h5><p>"+question.solution+"</p></div>";
	$('.solution-section').find('.solution-questions').find('.questions').html(html);
};
testReportController.prototype.PopulateAttemptControls = function()
{
	var html = "<div class='col-xs-12 col-sm-12 col-md-6 col-lg-6'>"+
					"<button class='col-xs-12 col-sm-12 col-md-6 col-lg-6 button button-primary btnShowSolution'>Show Solution</button>"+
			   "</div>"+
			   "<div class='col-xs-6 col-sm-6 col-md-2 col-lg-2 col-md-offset-2 col-lg-offset-2'>"+
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
	$('.solution-section').find('.solution-questions').find('.attempt-controls').find('.btnShowSolution').unbind().bind('click', function(e){	
		var position = $('.ques-solution').offset();
		$(".question").animate({ scrollTop: position.top }, 1000);
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
	var question = this.solutionData[this.currentQues-1];
	if(question.solution.length == 0){
		$('.question').find('.ques-solution').hide();
		$('.btnShowSolution').hide();
	}
	else{
		$('.question').find('.ques-solution').show();
		$('.btnShowSolution').show();
	}
}
testReportController.prototype.CurrentQuesStatusHighlight = function()
{
	$('.solution-ques-status').find('.ques-status').find('div').removeClass('selected');
	$('.solution-ques-status').find('.ques-status').find('div[ques-no='+this.currentQues+']').addClass('selected');
};