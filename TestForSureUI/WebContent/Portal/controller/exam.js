var examController = function(){
	this.id = 0;
	this.exam = {};
	this.tests = {};
	this.quizzes = {};
	this.Init();
};
examController.prototype.Init = function()
{
	//Load header
	test2bsureController.getObj().GetHeader(".exam-header");
	//Read id from query string
	this.id = test2bsureController.getObj().QueryString(window.location.href, 'id');
	this.LoadData();
	//Load footer
	test2bsureController.getObj().GetFooter(".exam-footer");
};
examController.prototype.LoadData = function()
{
	var id = this.id;
	fetch('http://localhost:8083/test2bsure/exampage?id='+id)
	  .then(response => response.json())
	  .then(data => this.SetState({ exam: data.exam, tests: data.tests, quizzes: data.quizzes }));
}
examController.prototype.SetState = function(obj)
{
	for(var key in obj){
		this[key] = obj[key];
	}
	this.PopulateExamDetails();
	this.PopulateTests();
	this.PopulateQuizzes();
};
examController.prototype.PopulateExamDetails = function()
{
	
};
examController.prototype.PopulateTests = function()
{
	var html = '<h4>Mock Tests</h4>';
	html += "<ul class='col-xs-12 col-sm-12 col-md-12 col-lg-12'>";
	for(var test in this.tests){
		html += "<li test-id='"+this.tests[test].id+"' class='col-xs-12 col-sm-12 col-md-3 col-lg-3'>";
		html += this.TestCard(this.tests[test]);
		html += "</li>";
	}
	$('.test-listing .right').append(html);
	$('.test-listing .right').find('.btnStartTest').unbind().bind('click', function(e){
		var testId = $(e.currentTarget).parents('li[test-id]').attr('test-id');
		window.location.href = 'take-test.html?id='+testId;
	});
};
examController.prototype.TestCard = function(test)
{
	var html = "<h4>"+test.title+"</h4>"+
			"<div class='test-detail'>"+
				"<div class='ques'>"+test.totalQues+" Questions</div>"+
				"<div class='marks'>"+test.totalMarks+" Marks</div>"+
				"<div class='time'>"+test.totalTime+" minutes</div>"+
				"<div class='attempts'>Attempted "+(test.candidateCount)+" times</div>"+
			"</div>";
	var attemptFlag = false;
	var resumeFlag = false;
	var attemptCount = 0;
	if(typeof test.attemptInfo != 'undefined' && test.attemptInfo != null && test.attemptInfo.length > 0){
		for(var attempt in test.attemptInfo){
			if(test.attemptInfo[attempt].state == 2){
				attemptFlag = true;
				attemptCount++;
			}
			else if(test.attemptInfo[attempt].state == 1){
				resumeFlag = true;
			}
		}
	}
	html += "<div class='controls'>";
	if(attemptFlag == true){
		//means the test is already attempted atlease once, show the report button
		html += "<button class='col-xs-6 col-sm-6 col-md-6 col-lg-6 btnReportTest button button-default'>Report</button>";
	}
	else{
		//means the test is already attempted atlease once, show the report button
		html += "<button class='col-xs-6 col-sm-6 col-md-6 col-lg-6 btnReportTest button button-default' disabled='disabled'>Report</button>";
	}
	if(resumeFlag == true){
		//means the test is in resumed state
		html += "<button class='col-xs-6 col-sm-6 col-md-6 col-lg-6 btnStartTest button button-primary'>Resume Test</button>";
	}
	else if(test.noOfAttempts == -1 || (test.noOfAttempts > 0 && test.noOfAttempts > attemptCount)){
		html += "<button class='col-xs-6 col-sm-6 col-md-6 col-lg-6 btnStartTest button button-primary'>Start Test</button>";
	}
	else{
		html += "<button class='col-xs-6 col-sm-6 col-md-6 col-lg-6 btnStartTest button button-primary' disabled='disabled'>Start Test</button>";
	}
	html += "</div>";
	return html;
};
examController.prototype.PopulateQuizzes = function(exam)
{
	var html = '<h4>Quizzes</h4>';
	html += "<ul class='col-xs-12 col-sm-12 col-md-12 col-lg-12'>";
	for(var quiz in this.quizzes){
		html += "<li quiz-id='"+this.quizzes[quiz].id+"' class='col-xs-12 col-sm-12 col-md-3 col-lg-3'>";
		html += this.QuizCard(this.quizzes[quiz]);
		html += "</li>";
	}
	$('.quiz-listing .right').append(html);
	$('.quiz-listing .right').find('.btnQuizAction').unbind().bind('click', function(e){
		var quizId = $(e.currentTarget).parents('li[quiz-id]').attr('quiz-id');
		window.location.href = 'take-quiz.html?id='+quizId;
	});
};
examController.prototype.QuizCard = function(quiz)
{
	var html = "<img src='' alt='Quiz'/>"+
				"<h4>"+quiz.title+"</h4>"+
				"<div class='quiz-detail'>"+
					"<span>"+quiz.noOfQues+" Ques / "+(quiz.noOfQues * quiz.marksPerQues)+" Marks</span>"+
				"</div>"+
				"<div class='attempts quiz-detail'>"+
					"<span>Attempted "+(quiz.candidateCount)+" times</span>"+
				"</div>"+
				"<div class='controls'>";
	if(quiz.attemptInfo != null){
		if(quiz.attemptInfo.state == 2){
			//Quiz already attempted & finished
			html += "<button class='btnQuizAction button button-primary'>Report</button>";
		}
		else if(quiz.attemptInfo.state == 1){
			//Quiz already started but not finished
			html += "<button class='btnQuizAction button button-default'>Resume Quiz</button>";
		}
	}
	else{
		//Quiz not yet started
		html += "<button class='btnQuizAction button button-primary'>Start Quiz</button>";
	}
	html += "</div>";
	return html;
};