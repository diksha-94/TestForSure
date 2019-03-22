var quizController = function(){
	this.exam = {};
	this.quizzes = {};
	this.Init();
};
quizController.prototype.Init = function()
{
	//Load header
	test2bsureController.getObj().GetHeader(".quiz-header");
	this.LoadData();
	//Load footer
	test2bsureController.getObj().GetFooter(".quiz-footer");
};
quizController.prototype.LoadData = function()
{
	fetch(remoteServer+'/test2bsure/quizzes')
	  .then(response => response.json())
	  .then(data => this.SetState({ quizzes: data.quizzes }));
}
quizController.prototype.SetState = function(obj)
{
	for(var key in obj){
		this[key] = obj[key];
	}
	this.PopulateQuizzes();
};
quizController.prototype.PopulateQuizzes = function()
{
	var html = '<h4>Quizzes</h4>';
	html += "<ul class='col-xs-12 col-sm-12 col-md-12 col-lg-12'>";
	for(var quiz in this.quizzes){
		html += "<li quiz-id='"+this.quizzes[quiz].id+"' class='col-xs-12 col-sm-12 col-md-3 col-lg-3'>";
		html += test2bsureController.getObj().QuizCard(this.quizzes[quiz]);
		html += "</li>";
	}
	$('.quiz-listing .right').append(html);
	$('.quiz-listing .right').find('.btnQuizAction').unbind().bind('click', function(e){
		var quizId = $(e.currentTarget).parents('li[quiz-id]').attr('quiz-id');
		window.location.href = 'take-quiz.html?id='+quizId;
	});
};