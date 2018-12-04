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
};
examController.prototype.TestCard = function(test)
{
	var html = "<h4>"+test.title+"</h4>"+
			"<div class='test-detail'>"+
				"<div class='ques'>"+test.totalQues+" Questions</div>"+
				"<div class='marks'>"+test.totalMarks+" Marks</div>"+
				"<div class='time'>"+test.totalTime+" minutes</div>"+
				"<div class='attempts'>Attempted "+(test.candidateCount)+" times</div>"+
			"</div>"+
			"<div class='controls'>"+
				"<button class='btnStartTest button button-primary'>Start Test</button>"+
			"</div>";
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
	$('.quiz-listing .right').find('.btnStartQuiz').unbind().bind('click', function(e){
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
				"<div class='controls'>"+
					"<button class='btnStartQuiz button button-primary'>Start Quiz</button>"+
				"</div>";
	return html;
};