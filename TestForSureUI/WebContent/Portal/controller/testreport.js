var testreportController = function(id){
	this.id = id;
	//report=1 means show report, report=0 means show solution
	this.report = 1;
	this.reportData = {};
	this.solutionData = {};
	this.testInfo = {};
	this.currentQues = 1;
};
testreportController.prototype.Init = function(callback)
{
	this.LoadPage();
	LoadJS('WebContent/helperJS/highcharts-8.0.0');
	this.id = test2bsureController.getObj().QueryString(window.location.href, 'sessionId');
	this.report = test2bsureController.getObj().QueryString(window.location.href, 'report');
	this.reward = test2bsureController.getObj().QueryString(window.location.href, 'reward');
	if(this.report == undefined){
		this.report = 1;
	}
	test2bsureController.getObj().SelfAuth(function(){
		this.LoadData();
		callback();
	}.bind(this));
	
	//Show reward points after 1 second on submission, if earned
	setTimeout(function(){
		if(typeof this.reward != 'undefined' && this.reward != undefined && this.reward != null){
			if(parseInt(this.reward) > 0){
				test2bsureController.getObj().ShowRewardPointsEarned(0, this.reward);
			}
			//var newUrl = window.location.pathname + "?sessionId="+this.id+"&report="+this.report;
			//window.history.replaceState({}, document.title, newUrl);
		}
	}.bind(this), 1000);
};
testreportController.prototype.LoadPage = function()
{
	var html = "<div class='report-header col-xs-12 col-sm-12 col-md-12 col-lg-12'>"+
				"</div>"+
				"<div class='report-section col-xs-12 col-sm-12 col-md-12 col-lg-12'>"+
					"<div class='report-basic col-xs-12 col-sm-12 col-md-12 col-lg-12'>"+
					"</div>"+
					"<div class='report-advanced col-xs-12 col-sm-12 col-md-12 col-lg-12 container'>"+
						"<div class='left-side col-xs-12 col-sm-12 col-md-3 col-lg-3'>"+
							"<div class='topper-average col-xs-12 col-sm-12 col-md-12 col-lg-12'>"+
							"</div>"+
							"<div class='suggested-tests col-xs-12 col-sm-12 col-md-12 col-lg-12'>"+
								"<h5>Suggested Tests</h5>"+
							"</div>"+
						"</div>"+
						"<div class='charts col-xs-12 col-sm-12 col-md-9 col-lg-9'>"+
							"<div id='questionsChart' class='col-xs-12 col-sm-12 col-md-6 col-lg-6'>"+
								"<div id='questionsPieChart'></div>"+
							"</div>"+
							"<div id='timeChart' class='col-xs-12 col-sm-12 col-md-6 col-lg-6'>"+
								"<div id='timePieChart'></div>"+
							"</div>"+
							"<div class='col-xs-12 col-sm-12 col-md-4 col-lg-4 col-md-offset-4 col-lg-offset-4 chartsSummary'>"+
								"<div class='correct'>"+
									"<span class='info'>CORRECT</span>"+
									"<span class='value'></span>"+
								"</div>"+
								"<div class='incorrect'>"+
									"<span class='info'>INCORRECT</span>"+
									"<span class='value'></span>"+
								"</div>"+
								"<div class='unattempted'>"+
									"<span class='info'>UNATTEMPTED</span>"+
									"<span class='value'></span>"+
								"</div>"+
								"<div class='unvisited'>"+
									"<span class='info'>UNVISITED</span>"+
									"<span class='value'></span>"+
								"</div>"+
							"</div>"+
						"</div>"+
						"<div id='test2bsure_summary'></div>"+
					"</div>"+
				"</div>"+
				"<div class='solution-section col-xs-12 col-sm-12 col-md-12 col-lg-12 container'>"+
					"<div class='link-pallete'>"+
						"<img src='WebContent/Portal/images/left-arrow.png' alt='Open'/>"+
					"</div>"+
					"<div class='solution-questions col-xs-12 col-sm-12 col-md-9 col-lg-9'>"+
						"<div class='questions col-xs-12 col-sm-12 col-md-12 col-lg-12'>"+
						"</div>"+
						"<div class='attempt-controls col-xs-12 col-sm-12 col-md-12 col-lg-12'>"+
						"</div>"+
					"</div>"+
					"<div class='solution-ques-status xs-12 col-sm-12 col-md-3 col-lg-3'>"+
						"<h4>Question Status</h4>"+
						"<div class='ques-status'>"+
						"</div>"+
						"<div class='ques-status-info'>"+
							"<div class='main-status'><div class='status-info correct'><span>0</span></div><span class='status-span'>Correct Attempt</span></div>"+
							"<div class='main-status'><div class='status-info wrong'><span>0</span></div><span class='status-span'>Wrong Attempt</span></div>"+
							"<div class='main-status'><div class='status-info missed'><span>0</span></div><span class='status-span'>Missed(Unvisited) Question</span></div>"+
							"<div class='main-status'><div class='status-info skipped'><span>0</span></div><span class='status-span'>Skipped(Unattempted) Question</span></div>"+
							"<div class='main-status'><div class='status-info marked'><span>0</span></div><span class='status-span'>Marked For Review</span></div>"+
						"</div>"+
					"</div>"+
				"</div>";
	$('body').find('.common-header').remove();
	$('body').find('.common-content').remove();
	$('body').find('.common-footer').remove();
	$('body').append(html);
	$('body').addClass('test-report-page');
};
testreportController.prototype.LoadData = function()
{
	var id = this.id;
	fetch(remoteServer+'/test2bsure/testreportdata?sessionId='+id)
	  .then(response => response.json())
	  .then(data => this.SetState({ testInfo: data.testInfo, reportData: data.reportData, solutionData: data.solutionData }));
}
testreportController.prototype.SetState = function(obj)
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
		this.UpdateQuestionStatusCount();
	}
};
testreportController.prototype.BindEvents = function()
{
	$('.link-pallete').unbind().bind('click', function(){
		if($('.solution-ques-status').css('display') == 'none'){
			//means question pallete is not visible
			$('.solution-ques-status').css('display', 'block');
			$('.link-pallete').find('img').attr('src', 'WebContent/Portal/images/right-arrow.png');
			$('.link-pallete').css('right', $('.solution-ques-status').width()+34+'px');
		}
		else{
			//means question pallete is visible
			$('.solution-ques-status').css('display', 'none');
			$('.link-pallete').find('img').attr('src', 'WebContent/Portal/images/left-arrow.png');
			$('.link-pallete').css('right', '0px');
		}
	});
};
testreportController.prototype.PopulateReportHeader = function()
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
testreportController.prototype.SwitchReportSolution = function()
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
testreportController.prototype.PopulateReport = function()
{
	this.PopulateBasicReport();
	this.PopulateTopperAverage();
	this.PopulateSuggestedTests();
	this.PopulateLeaderboard();
	this.DisplayCharts();
}
testreportController.prototype.PopulateBasicReport = function()
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
				"<img src='WebContent/Portal/images/trophy.png' alt='Trophy' class='trophy'/>"+
				"<h4>Congrats "+ userController.getObj().userData.name + " !!</h4>"+
			"</div>"+
			"<div class='report-detail col-xs-12 col-sm-12 col-md-12 col-lg-12'>"+
				"<div class='item rank col-xs-12 col-sm-12 col-md-4 col-lg-4'>"+
					"<img src='WebContent/Portal/images/rank.png' alt='Rank'/><div class='values'><span>Rank</span><span class='detail'>"+
					this.reportData.rank+" / "+this.reportData.totalCandidate+"</span></div>"+
				"</div>"+
				"<div class='item score col-xs-12 col-sm-12 col-md-4 col-lg-4'>"+
					"<img src='WebContent/Portal/images/score.png' alt='Score'/><div class='values'><span>Score</span><span class='detail'>"+
					this.reportData.markesScored+" / "+this.testInfo.totalMarks+"</span></div>"+
				"</div>"+
				"<div class='item ques col-xs-12 col-sm-12 col-md-4 col-lg-4'>"+
					"<img src='WebContent/Portal/images/attempts.png' alt='Attempts'/><div class='values'><span>Qs Attempt</span><span class='detail'>"+
					this.reportData.quesAttempted+" / "+this.testInfo.totalQues+"</span></div>"+
				"</div>"+
				"<div class='item time col-xs-12 col-sm-12 col-md-4 col-lg-4'>"+
					"<img src='WebContent/Portal/images/time.png' alt='Time'/><div class='values'><span>Time Taken</span><span class='detail'>"+
					test2bsureController.getObj().getTimeFormat(this.reportData.timeTaken)+"</span></div>"+
				"</div>"+
				"<div class='item accuracy col-xs-12 col-sm-12 col-md-4 col-lg-4'>"+
					"<img src='WebContent/Portal/images/accuracy.png' alt='Accuracy'/><div class='values'><span>Accuracy</span><span class='detail'>"+
					accuracy+"%</span></div>"+
				"</div>"+
				"<div class='item percentile col-xs-12 col-sm-12 col-md-4 col-lg-4'>"+
					"<img src='WebContent/Portal/images/percentile.png' alt='Percentile'/><div class='values'><span>Percentile</span><span class='detail'>"+
					percentile+"</span></div>"+
				"</div>"+
			"</div>";
	$('.report-section').find('.report-basic').html(html);
			
};
testreportController.prototype.PopulateTopperAverage = function()
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
testreportController.prototype.PopulateSuggestedTests = function()
{
	var html = "";
	if(this.testInfo.suggestedTests != null && this.testInfo.suggestedTests.length > 0){
		for(var i in this.testInfo.suggestedTests){
			var test = this.testInfo.suggestedTests[i];
			html += "<div class='col-xs-12 col-sm-12 col-md-12 col-lg-12' test-id='" + test["id"] + "' data-action='"+test["urlKey"]+"'>"+
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
			var action = $(e.currentTarget).parents('div[test-id]').attr('data-action');
			window.open(action+'?start=0');
		});
	}
	else{
		$('.left-side').find('.suggested-tests').hide();
	}
};
testreportController.prototype.PopulateLeaderboard = function()
{
	var html = "";
	html += "<div class='btnHolder'><button class='button button-primary' id='btnShowLeaderboard'>View Full Leaderboard</button>";
	$('.report-section').find('.report-advanced').find('.topper-average').append(html);
	$('#btnShowLeaderboard').unbind().bind('click', function(){
		window.location.href = window.location.pathname+'?leaderboard=1&type=test&id='+this.testInfo.id;
	}.bind(this));
};
testreportController.prototype.DisplayCharts = function()
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


testreportController.prototype.PopulateSolution = function()
{
	this.PopulateQuestionStatus();
	this.DisplayQuestion();
	this.PopulateAttemptControls();
};
testreportController.prototype.PopulateQuestionStatus = function()
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
			$('.link-pallete').find('img').attr('src', 'WebContent/Portal/images/left-arrow.png');
			$('.link-pallete').css('right', '0px');
		}
		this.DisplayQuestion();
		this.ManageControls();
	}.bind(this));
};
testreportController.prototype.DisplayQuestion = function()
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
			"<span class='ques-time'><img src='WebContent/Portal/images/time.png' alt='Time Spent'><span>"+test2bsureController.getObj().getTimeFormat(question.timeSpent)+"</span></span>"+
			"<span class='ques-marks'>0 mark(s)</span>"
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
	if(markedAnswer == -1){
		$('.ques-marks').text("0 mark(s)");
	}
	else if(markedAnswer == correctAnswer){
		$('.ques-marks').text("+ "+parseInt(this.testInfo.totalQues)/parseInt(this.testInfo.totalMarks) + " mark(s)");
		$('.ques-marks').addClass('correct');
	}
	else{
		$('.ques-marks').text("- "+this.testInfo.negativeMarks + " mark(s)");
		$('.ques-marks').addClass('wrong');
	}
	$('.question').find('.question-desc').find('.ques-status').css('background-color', bgColor);
	$('.question').find('.question-desc').find('.ques-status').css('color', color);
};
testreportController.prototype.PopulateAttemptControls = function()
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
testreportController.prototype.ManageControls = function()
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
testreportController.prototype.CurrentQuesStatusHighlight = function()
{
	$('.solution-ques-status').find('.ques-status').find('div').removeClass('selected');
	$('.solution-ques-status').find('.ques-status').find('div[ques-no='+this.currentQues+']').addClass('selected');
};
testreportController.prototype.UpdateQuestionStatusCount = function(){
	var correct = 0;
	var wrong = 0;
	var missed = 0;
	var skipped = 0;
	var marked = 0;
	$('.solution-ques-status').find('.ques-status').find('div[ques-no]').each(function(key, value){
		if($(value).hasClass('correct')){
			correct++;
		}
		else if($(value).hasClass('wrong')){
			wrong++;
		}
		else if($(value).hasClass('missed')){
			missed++;
		}
		else if($(value).hasClass('skipped')){
			skipped++;
		}
		else if($(value).hasClass('marked')){
			marked++;
		}
	}.bind(this));
	$('.ques-status-info').find('.status-info.correct').find('span').text(correct);
	$('.ques-status-info').find('.status-info.wrong').find('span').text(wrong);
	$('.ques-status-info').find('.status-info.missed').find('span').text(missed);
	$('.ques-status-info').find('.status-info.skipped').find('span').text(skipped);
	$('.ques-status-info').find('.status-info.marked').find('span').text(marked);
};