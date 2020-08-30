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
	this.reward = test2bsureController.getObj().QueryString(window.location.href, 'reward');
	if(this.report == undefined){
		this.report = 1;
	}
	test2bsureController.getObj().SelfAuth(function(){
		this.LoadData();
	}.bind(this));
	setTimeout(function(){
		if(typeof this.reward != 'undefined' && this.reward != undefined && this.reward != null){
			if(parseInt(this.reward) > 0){
				test2bsureController.getObj().ShowRewardPointsEarned(0, this.reward);
			}
			var newUrl = window.location.pathname + "?sessionId="+this.id+"&report="+this.report;
			window.history.replaceState({}, document.title, newUrl);
		}
	}.bind(this), 1000);
};
testReportController.prototype.LoadData = function()
{
	var id = this.id;
	fetch(remoteServer+'/test2bsure/testreportdata?sessionId='+id)
	  .then(response => response.json())
	  .then(data => this.SetState({ testInfo: data.testInfo, reportData: data.reportData, solutionData: data.solutionData }));
}
testReportController.prototype.SetState = function(obj)
{
	for(var key in obj){
		this[key] = obj[key];
	}
	this.BindEvents();
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
		$('.btnSolution').text('Analytics');
		this.PopulateSolution();
	}
};
testReportController.prototype.BindEvents = function()
{
	$('.link-pallete').unbind().bind('click', function(){
		if($('.solution-ques-status').css('display') == 'none'){
			//means question pallete is not visible
			$('.solution-ques-status').css('display', 'block');
			$('.link-pallete').find('img').attr('src', '../images/right-arrow.png');
			$('.link-pallete').css('right', $('.solution-ques-status').width()+34+'px');
		}
		else{
			//means question pallete is visible
			$('.solution-ques-status').css('display', 'none');
			$('.link-pallete').find('img').attr('src', '../images/left-arrow.png');
			$('.link-pallete').css('right', '0px');
		}
	});
};
testReportController.prototype.PopulateReportHeader = function()
{
	var html = "<div class='col-xs-12 col-sm-12 col-md-8 col-lg-8'><h4>"+this.testInfo.title+"</h4></div>"+
		       "<div class='col-xs-6 col-sm-6 col-md-2 col-lg-2 col-xs-offset-0 col-sm-offset-0 col-md-offset-2 col-lg-offset-2 divButton'>"+
			   		"<button class='button button-default btnSolution'>Solutions</button>"+
			   /*"</div>"+
			   "<div class='col-xs-6 col-sm-6 col-md-2 col-lg-2 divButton'>"+
					"<button class='button button-default btnDownloadReport'>Download Report</button>"+*/
			   "</div>";
	$('.report-header').html(html);
	$('.report-header').find('.btnSolution').unbind().bind('click', function(){
		this.SwitchReportSolution();
	}.bind(this));
};
testReportController.prototype.SwitchReportSolution = function()
{
	var newUrl = window.location.pathname + "?sessionId="+this.id+"&report=";
	if(this.report == 1){
		this.report = 0;
		newUrl += this.report;
	}
	else if(this.report == 0){
		this.report = 1;
		newUrl += this.report;
	}
	window.location.href = newUrl;
};
testReportController.prototype.PopulateReport = function()
{
	this.PopulateBasicReport();
	this.PopulateTopperAverage();
	this.PopulateSuggestedTests();
	this.PopulateLeaderboard();
	this.DisplayCharts();
}
testReportController.prototype.PopulateBasicReport = function()
{
	var html = "";
	var accuracy = 0;
	if(this.reportData.quesAttempted > 0){
		accuracy = Math.floor(((this.reportData.correctCount*100)/this.reportData.quesAttempted), 2);
	}
	var percentile = 0;
	if(this.reportData.totalCandidate > 0){
		percentile = ((this.reportData.totalCandidate - this.reportData.rank)*100)/this.reportData.totalCandidate;
		percentile = Math.floor(percentile, 2);
	}
	var totalTestTime = this.testInfo.totalTime * 60;
	this.reportData.timeTaken = this.reportData.timeTaken > totalTestTime ? totalTestTime : this.reportData.timeTaken;
	html += "<div class='greeting'>"+
				"<img src='../images/trophy.png' alt='Trophy' class='trophy'/>"+
				"<h4>Congrats "+ userController.getObj().userData.name + " !!</h4>"+
			"</div>"+
			"<div class='report-detail col-xs-12 col-sm-12 col-md-12 col-lg-12'>"+
				"<div class='item rank col-xs-12 col-sm-12 col-md-4 col-lg-4'>"+
					"<img src='../images/rank.png' alt='Rank'/><div class='values'><span>Rank</span><span class='detail'>"+
					this.reportData.rank+" / "+this.reportData.totalCandidate+"</span></div>"+
				"</div>"+
				"<div class='item score col-xs-12 col-sm-12 col-md-4 col-lg-4'>"+
					"<img src='../images/score.png' alt='Score'/><div class='values'><span>Score</span><span class='detail'>"+
					this.reportData.markesScored+" / "+this.testInfo.totalMarks+"</span></div>"+
				"</div>"+
				"<div class='item ques col-xs-12 col-sm-12 col-md-4 col-lg-4'>"+
					"<img src='../images/attempts.png' alt='Attempts'/><div class='values'><span>Qs Attempt</span><span class='detail'>"+
					this.reportData.quesAttempted+" / "+this.testInfo.totalQues+"</span></div>"+
				"</div>"+
				"<div class='item time col-xs-12 col-sm-12 col-md-4 col-lg-4'>"+
					"<img src='../images/time.png' alt='Time'/><div class='values'><span>Time Taken</span><span class='detail'>"+
					test2bsureController.getObj().getTimeFormat(this.reportData.timeTaken)+"</span></div>"+
				"</div>"+
				"<div class='item accuracy col-xs-12 col-sm-12 col-md-4 col-lg-4'>"+
					"<img src='../images/accuracy.png' alt='Accuracy'/><div class='values'><span>Accuracy</span><span class='detail'>"+
					accuracy+"%</span></div>"+
				"</div>"+
				"<div class='item percentile col-xs-12 col-sm-12 col-md-4 col-lg-4'>"+
					"<img src='../images/percentile.png' alt='Percentile'/><div class='values'><span>Percentile</span><span class='detail'>"+
					percentile+"</span></div>"+
				"</div>"+
			"</div>";
	$('.report-section').find('.report-basic').html(html);
			
};
testReportController.prototype.PopulateTopperAverage = function()
{
	$('.report-section').find('.report-advanced').find('.topper-average').empty();
	var topperScore = this.reportData.leaderboard[0].marksScored;
	var totalTestTime = this.testInfo.totalTime * 60;
	var topperTime = this.reportData.leaderboard[0].timeTaken > totalTestTime ? totalTestTime : this.reportData.leaderboard[0].timeTaken;
	topperTime = test2bsureController.getObj().getTimeFormat(topperTime);
	var averageScore = 0;
	var averageTime = 0;
	var totalScore = 0;
	var totalTime = 0;
	for(var data in this.reportData.leaderboard){
		totalScore += this.reportData.leaderboard[data]["marksScored"];
		totalTime += this.reportData.leaderboard[data]["timeTaken"];
	}
	averageScore = (totalScore/this.reportData.leaderboard.length).toFixed(2);
	averageTime = ((totalTime)/this.reportData.leaderboard.length) > totalTestTime ? totalTestTime : ((totalTime)/this.reportData.leaderboard.length);
	averageTime = test2bsureController.getObj().getTimeFormat(averageTime);
	var html = "<div class='topper'>"+
					"<span>Topper's Score: "+topperScore+"</span>"+
					"<span>Topper's Time: "+topperTime+"</span>"+
			   "</div>"+
			   "<div class='average'>"+
					"<span>Average Score: "+averageScore+"</span>"+
					"<span>Average Time: "+averageTime+"</span>"+
			   "</div>";
	$('.report-section').find('.report-advanced').find('.topper-average').append(html);
};
testReportController.prototype.PopulateSuggestedTests = function()
{
	var html = "";
	if(this.testInfo.suggestedTests != null && this.testInfo.suggestedTests.length > 0){
		for(var i in this.testInfo.suggestedTests){
			var test = this.testInfo.suggestedTests[i];
			html += "<div class='col-xs-12 col-sm-12 col-md-12 col-lg-12' test-id='" + test["id"] + "'>"+
						"<span class='col-xs-9 col-sm-9 col-md-9 col-lg-9'>"+test["title"]+"</span>"+
						"<span class='col-xs-3 col-sm-3 col-md-3 col-lg-3 testBtn'><a>Take Test</a></span>"+
					"</div>";
		}
		$('.left-side').find('.suggested-tests').find('div[test-id]').remove();
		$('.left-side').find('.suggested-tests').append(html);
		$('.suggested-tests').find('.testBtn').unbind().bind('click', function(e){
			var userId = -1;
			if(typeof userController != 'undefined' && typeof userController.getObj() != 'undefined' && (typeof userController.getObj().userData != 'undefined' && userController.getObj().userData != null) && typeof userController.getObj().userData.id != 'undefined'){
				userId = userController.getObj().userData.id;
			}
			if(userId == -1){
				//User not logged in
				if($('#loginModal').length == 0){
					$('body').append(loginModal());
				}
				$('#loginModal').modal('show');
				return false;
			}
			var testId = $(e.currentTarget).parents('div[test-id]').attr('test-id');
			window.location.href = 'take-test.html?id='+testId;
		});
	}
	else{
		$('.left-side').find('.suggested-tests').hide();
	}
};
testReportController.prototype.PopulateLeaderboard = function()
{
	var html = "";
	html += "<div class='btnHolder'><button class='button button-primary' id='btnShowLeaderboard'>View Full Leaderboard</button>";
	$('.report-section').find('.report-advanced').find('.topper-average').append(html);
	$('#btnShowLeaderboard').unbind().bind('click', function(){
		window.location.href = 'leaderboard.html?type=test&id='+this.testInfo.id;
	}.bind(this));
};
testReportController.prototype.DisplayCharts = function()
{
	//Question attempt chart
	var quesObject = {
			"Correct":0,
			"Incorrect":0,
			"Unattempted":0, //Skipped
			"Unvisited":0 //Missed
	};
	//Time Spent Chart
	var timeObject = {
			"Correct":0,
			"Incorrect":0,
			"Unattempted":0,
			"Unvisited":0
	}
	for(var i = 0; i < this.testInfo.totalQues; i++){
		var question = this.solutionData[i];
		var markedAnswer = -1;
		var correctAnswer = -1;
		if(question.markedOption == 'null' || question.markedOption == null){
			//Skipped Question
			quesObject["Unattempted"] += 1;
			timeObject["Unattempted"] += question.timeSpent;
		}
		else if(question.markedOption == '[]'){
			//Missed Question
			quesObject["Unvisited"] += 1;
			timeObject["Unvisited"] += question.timeSpent;
		}
		else if(question.markedOption != 'null' && question.markedOption != null && question.markedOption != '[]'){
			markedAnswer = (JSON.parse(question.markedOption)).indexOf(true);
			if(question.correctOption != 'null' && question.correctOption != null && question.correctOption != '[]'){
				correctAnswer = (JSON.parse(question.correctOption)).indexOf(true);
			}
			if(markedAnswer == correctAnswer){
				//correct answer
				quesObject["Correct"] += 1;
				timeObject["Correct"] += question.timeSpent;
			}
			else{
				//Wrong answer
				quesObject["Incorrect"] += 1;
				timeObject["Incorrect"] += question.timeSpent;
			}
		}
	}
	
	//Question Pie Chart
	var colors 	= ['#54A1EF', '#FF8383', '#FABA20', '#DD8EFF'];
	var series = [
				 ["Correct", quesObject.Correct],
				 ["Incorrect", quesObject.Incorrect],
				 ["Unattempted", quesObject.Unattempted],
				 ["Unvisited", quesObject.Unvisited]
			 ];
	var params = {id: 'questionsPieChart', title: 'ANSWER DISTRIBUTION', key: 'Questions', colors: colors, series: series};
	test2bsureController.getObj().PieChart(params);
	
	var totalTime = this.testInfo.totalTime * 60;
	timeObject["Correct"] = timeObject["Correct"] > totalTime ? totalTime : timeObject["Correct"];
	timeObject["Incorrect"] = timeObject["Incorrect"] > totalTime ? totalTime : timeObject["Incorrect"];
	timeObject["Unattempted"] = timeObject["Unattempted"] > totalTime ? totalTime : timeObject["Unattempted"];
	timeObject["Unvisited"] = (parseInt(this.testInfo.totalTime) * 60) - timeObject["Unattempted"] - timeObject["Correct"] - timeObject["Incorrect"];
	timeObject["Unvisited"] = timeObject["Unvisited"] > totalTime ? totalTime : timeObject["Unvisited"];
	//Time Pie Chart
	colors 	= ['#54A1EF', '#FF8383', '#FABA20', '#DD8EFF'];
	series = [
				 ["Correct", timeObject.Correct],
				 ["Incorrect", timeObject.Incorrect],
				 ["Unattempted", timeObject.Unattempted],
				 ["Unvisited", timeObject.Unvisited]
			 ];
	params = {id: 'timePieChart', title: 'TIME SPENT', key: 'secs', colors: colors, series: series};
	test2bsureController.getObj().PieChart(params);
	//Populate charts summary
	
	$('.chartsSummary').find('div.correct').find('span.value').text(quesObject["Correct"] + " QUES, "+test2bsureController.getObj().getTimeFormat(timeObject["Correct"]));
	$('.chartsSummary').find('div.incorrect').find('span.value').text(quesObject["Incorrect"] + " QUES, "+test2bsureController.getObj().getTimeFormat(timeObject["Incorrect"]));
	$('.chartsSummary').find('div.unattempted').find('span.value').text(quesObject["Unattempted"] + " QUES, "+test2bsureController.getObj().getTimeFormat(timeObject["Unattempted"]));
	$('.chartsSummary').find('div.unvisited').find('span.value').text(quesObject["Unvisited"] + " QUES, "+test2bsureController.getObj().getTimeFormat(timeObject["Unvisited"]));
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
		if($('.link-pallete').css('display') == 'block'){
			$('.solution-ques-status').css('display', 'none');
			$('.link-pallete').find('img').attr('src', '../images/left-arrow.png');
			$('.link-pallete').css('right', '0px');
		}
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
						"<span class='question-number'>Question No. "+(this.currentQues)+"</span>";
	var quesStatus = $('.ques-status').find('div[ques-no='+this.currentQues+']').attr('class').split(' ')[0];
	var bgColor = $('.ques-status').find('div[ques-no='+this.currentQues+']').css('background-color');
	var color = $('.ques-status').find('div[ques-no='+this.currentQues+']').css('color');
	var totalTestTime = this.testInfo.totalTime * 60;
	question.timeSpent = question.timeSpent > totalTestTime ? totalTestTime : question.timeSpent;
	html +=	"<span class='ques-status'>"+quesStatus+"</span>"+
				"<span class='ques-time'><img src='../images/time.png' alt='Time Spent'><span>"+test2bsureController.getObj().getTimeFormat(question.timeSpent)+"</span></span>"+
			"</div>"+
			"<div class='ques-detail'>";
	if(question.paragraph == "true" || question.paragraph == "1"){
		html += "<span class='para-text'>"+question.paragraphText+"</span>";
	}
	html += "<span class='question-text'>"+question.questionText+"</span>"+
			"</div>"+
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
	var options = question.options;
	if(options.startsWith('"')){
		options = options.substring(1);
	}
	if(options.endsWith('"')){
		options = options.substring(0, options.length-1);
	}
	$(options).find('option').each(function(key, value){
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
	$('.question').find('.question-desc').find('.ques-status').css('background-color', bgColor);
	$('.question').find('.question-desc').find('.ques-status').css('color', color);
};
testReportController.prototype.PopulateAttemptControls = function()
{
	var html = "<div class='col-xs-4 col-sm-4 col-md-3 col-lg-3'>"+
					"<button class='col-xs-12 col-sm-12 col-md-2 col-lg-2 button button-primary btnShowSolution'>Show Solution</button>"+
			   "</div>"+
			   "<div class='col-xs-4 col-sm-4 col-md-2 col-lg-2 col-md-offset-5 col-lg-offset-5'>"+
					"<button class='button button-primary btnPrevious'>Prev</button>"+
			    "</div>"+
			    "<div class='col-xs-4 col-sm-4 col-md-2 col-lg-2'>"+
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
		$('.question[question-index='+this.currentQues+']').find('.ques-solution').show();
		var position = $('.question[question-index='+this.currentQues+']').find('.ques-solution').offset();
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
		//$('.question').find('.ques-solution').hide();
		$('.btnShowSolution').hide();
	}
	else{
		//$('.question').find('.ques-solution').show();
		$('.btnShowSolution').show();
	}
}
testReportController.prototype.CurrentQuesStatusHighlight = function()
{
	$('.solution-ques-status').find('.ques-status').find('div').removeClass('selected');
	$('.solution-ques-status').find('.ques-status').find('div[ques-no='+this.currentQues+']').addClass('selected');
};