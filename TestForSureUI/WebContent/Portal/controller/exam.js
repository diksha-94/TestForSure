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
	var html = '';
	html += '<h4>'+this.exam.title+'</h4>';
	html += this.exam.description;
	$('.exam-details').html(html);
};
examController.prototype.PopulateTests = function()
{
	var html = '';
	if(this.tests.length > 0){
		html += '<div class="testlisting-head">'+
					'<h4>Mock Tests</h4>'+
					'<span><img src="../images/down-arrow.png" alt="Arrow"></span>'+
				'</div>';
	}
	html += "<ul class='col-xs-12 col-sm-12 col-md-12 col-lg-12'>";
	for(var test in this.tests){
		html += "<li test-id='"+this.tests[test].id+"' class='col-xs-12 col-sm-12 col-md-3 col-lg-3'>";
		html += test2bsureController.getObj().TestCard(this.tests[test]);
		html += "</li>";
	}
	$('.test-listing').append(html);
	$('.test-listing').find('.btnStartTest').unbind().bind('click', function(e){
		var testId = $(e.currentTarget).parents('li[test-id]').attr('test-id');
		window.location.href = 'take-test.html?id='+testId;
	});
};
examController.prototype.PopulateQuizzes = function(exam)
{
	var html = '';
	if(this.quizzes.length > 0){
		html += '<div class="quizlisting-head">'+
					'<h4>Quizzes</h4>'+
					'<span><img src="../images/down-arrow.png" alt="Arrow"></span>'+
				'</div>';
	}
	html += "<ul class='col-xs-12 col-sm-12 col-md-12 col-lg-12'>";
	for(var quiz in this.quizzes){
		html += "<li quiz-id='"+this.quizzes[quiz].id+"' class='col-xs-12 col-sm-12 col-md-3 col-lg-3'>";
		html += test2bsureController.getObj().QuizCard(this.quizzes[quiz]);
		html += "</li>";
	}
	$('.quiz-listing').append(html);
	$('.quiz-listing').find('.btnQuizAction').unbind().bind('click', function(e){
		var quizId = $(e.currentTarget).parents('li[quiz-id]').attr('quiz-id');
		window.location.href = 'take-quiz.html?id='+quizId;
	});
};