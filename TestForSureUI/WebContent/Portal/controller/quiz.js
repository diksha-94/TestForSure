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
	fetch('http://localhost:8083/test2bsure/quizzes')
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
		html += this.QuizCard(this.quizzes[quiz]);
		html += "</li>";
	}
	$('.quiz-listing .right').append(html);
	$('.quiz-listing .right').find('.btnQuizAction').unbind().bind('click', function(e){
		var quizId = $(e.currentTarget).parents('li[quiz-id]').attr('quiz-id');
		window.location.href = 'take-quiz.html?id='+quizId;
	});
};
quizController.prototype.QuizCard = function(quiz)
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