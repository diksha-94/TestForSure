var quizController = function(){
	this.id = 0;
	this.quizInfo = {};
	this.questionsData = {};
	this.sessionId = 0;
	this.currentQues = 0;
	this.reportData = {};
	this.Init();
};
quizController.prototype.Init = function()
{
	//Read id from query string
	this.id = test2bsureController.getObj().QueryString(window.location.href, 'id');
	this.LoadData();
};
quizController.prototype.LoadData = function()
{
	var id = this.id;
	fetch(remoteServer+'/test2bsure/quizdata?quizId='+id)
	  .then(response => response.json())
	  .then(data => this.SetState({ quizInfo: data.quizInfo, questionsData: data.questionsData, sessionId: data.sessionId }));
}
quizController.prototype.SetState = function(obj)
{
	for(var key in obj){
		this[key] = obj[key];
	}
	this.QuizInfo();
	this.ManageQuizState();
};
quizController.prototype.QuizInfo = function()
{
	$('.quiz-info-value').find('.quiz-title-value').html(this.quizInfo.title);
};

quizController.prototype.ManageQuizState = function()
{
	if(typeof this.quizInfo.attemptInfo != 'undefined' && this.quizInfo.attemptInfo != null){
		this.currentQues = this.quizInfo.attemptInfo.lastQues;
	}
	this.PopulateQuizDetails();
	if(this.quizInfo.attemptInfo != null && this.quizInfo.attemptInfo.state == 2){
		//Means quiz already attempted, show the report
		this.currentQues = 0;
		this.DisplayReport();
	}
	else{
		//Display the question wherever left
		this.PopulateQuestion();
	}
	this.PopulateQuestionStatus();
};
quizController.prototype.PopulateQuizDetails = function()
{
	var html = "<div class='brand-logo-quiz col-xs-8 col-sm-8 col-md-3 col-lg-3'>"+
					"<a class='brand' href='home.html'><img src='../../Images/Test2bSure_Logo.jpg' alt='TEST-2B-SURE'></a>"+
				"</div>"+
				"<div class='quiz-title col-xs-12 col-sm-12 col-md-6 col-lg-6'><h4>"+this.quizInfo.title+"</h4></div>"+
			   "<div class='quiz-info col-xs-12 col-sm-12 col-md-3 col-lg-3'><span>"+this.quizInfo.noOfQues+" QUES / "+(this.quizInfo.noOfQues * this.quizInfo.marksPerQues)+" MARKS</span></div>";
	$('.quiz-header').html(html);
};
quizController.prototype.PopulateQuestion = function(solution)
{
	var optionValues = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
	$('.quiz-footer').hide();
	var question = this.questionsData[this.currentQues];
	var html = "<div class='question' question-id='"+question.id+"' question-index='"+this.currentQues+"'>"+
					"<div class='question-desc'>"+
						"<div class='question-number'>Question No. "+(this.currentQues+1)+"</div>";
	if(question.paragraph == "true"){
		html += "<span class='para-text'>"+question.paragraphText+"</span>";
	}
	html += "<span class='question-text'>"+question.questionText+"</span>"+
			"</div>"+
			"</div>";
	$('.quiz-content').find('.quiz-questions').find('.quiz-question').html(html);
	var optionHtml = "";
	optionHtml += "<div class='options'><div class='question-number'>Select Option</div>";
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
		optionHtml += "<div class='"+addClass+"' data-option='"+key+"'>"+
					"<span class='option-count'>"+optionValues[key]+".</span>"+
					"<div class='option-value'>"+$(value).html()+"</div>"+
					"<span class='answer-status'><img src=''/></span>"+
				"</div>";
	});
	optionHtml += "<div class='solution' style='display:none;'>"+
			"</div>";
	$('.quiz-content').find('.quiz-questions').find('.quiz-options').html(optionHtml);
	$('.quiz-main').find('.quiz-questions').find('.questions').html(html);
	$('.quiz-main .quiz-questions .quiz-options .options .option.correct').find('.answer-status').find('img').attr('src', '../images/correct.png');
	$('.quiz-main .quiz-questions .quiz-options .options .option.incorrect').find('.answer-status').find('img').attr('src', '../images/wrong.png');
	if(question.solution != null && question.solution.length > 0){
		var html = "<h5>Solution:</h5>"+
				   "<div>"+question.solution+"</div>";
		$('.quiz-questions').find('.questions').find('.question').find('.solution').show();
		$('.quiz-questions').find('.questions').find('.question').find('.solution').html(html);
	}
	$('.quiz-main').find('.quiz-questions').find('.quiz-options').find('.option').unbind().bind('click', function(e){
		this.CheckAnswer(e.currentTarget);	
	}.bind(this));				
};
quizController.prototype.PopulateQuestionStatus = function()
{
	var html = "<h4>Question Status</h4>";
	html += "<div class='status'>";
	for(var question in this.questionsData){
		var status = 'notvisited';
		if(this.questionsData[question].correctOption != null){
			//means already attempted
			var correctOption = JSON.parse(this.questionsData[question].correctOption);
			var markedOption = JSON.parse(this.questionsData[question].markedOption);
			if(correctOption.indexOf(true) == markedOption.indexOf(true)){
				status = 'correct';
			}
			else{
				status = 'incorrect';
			}
		}
		html += "<span class='"+status+"' qindex='"+(question)+"' qId='"+(this.questionsData[question]).id+"'>"+(parseInt(question)+1)+"</span>";
	}
	html += '</div>';
	$('.quiz-main').find('.quiz-status').find('.question-status').html(html);
};
quizController.prototype.CheckAnswer = function(node)
{
	var option = $(node).attr('data-option');
	var answer = '[';
	option = parseInt(option);
	for(var i=0;i<=option;i++){
		if(i == option){
			answer += 'true]';
		}
		else{
			answer += 'false,';
		}
	}
	//Check answer
	var sessionId = this.sessionId;
	var quesId = $('.quiz-main').find('.quiz-question').find('.question').attr('question-id');
	var quesIndex = parseInt($('.quiz-main').find('.quiz-question').find('.question').attr('question-index')) + 1;
	var submit = 0;
	if(this.currentQues == this.quizInfo.noOfQues-1){
		submit = 1;
	}
	var obj = this;
	var url = remoteServer+'/test2bsure/checkanswer?quesid='+quesId+'&quesindex='+quesIndex+'&sessionid='+sessionId+'&answer='+answer+'&submit='+submit;
	fetch(url)
	.then(response => response.json())
	.then(function(data){
		if(data.solution.length > 0){
			var html = "<h5>Solution:</h5>"+
					   "<div>"+data.solution+"</div>";
			$('.quiz-questions').find('.questions').find('.question[question-id='+quesId+']').find('.solution').show();
			$('.quiz-questions').find('.questions').find('.question[question-id='+quesId+']').find('.solution').html(html);
		}
		var correctAnswer = JSON.parse(data.correctAnswer);
		if(correctAnswer.indexOf(true) == option){
			$(node).addClass('correct');
			$(node).find('span.option-count').addClass('correct');
			$('.question-status').find('span[qid='+quesId+']').removeClass('notvisited').addClass('correct');
		}
		else{
			$(node).addClass('incorrect');
			$(node).find('span.option-count').addClass('incorrect');
			$('.question-status').find('span[qid='+quesId+']').removeClass('notvisited').addClass('incorrect');
			var correctIndex = correctAnswer.indexOf(true);
			$('.quiz-options').find('.option[data-option='+correctIndex+']').addClass('correct');
			$('.quiz-options').find('.option[data-option='+correctIndex+']').find('span.option-count').addClass('correct');
		}
		$(node).parents('.options').find('.option').addClass('block-events');
		$(node).parents('.options').find('.option').addClass('no-hover');
		$('.quiz-main .quiz-questions .quiz-options .options .option.correct').find('.answer-status').find('img').attr('src', '../images/correct.png');
		$('.quiz-main .quiz-questions .quiz-options .options .option.incorrect').find('.answer-status').find('img').attr('src', '../images/wrong.png');
		
		obj.ManageControls();
	});
};
quizController.prototype.ManageControls = function(){
	var html = "";
	if(this.currentQues == this.quizInfo.noOfQues - 1){
		html += "<button type='button' class='btnSubmit button button-primary'>Submit</button>";
	}
	else{
		html += "<button type='button' class='btnNext button button-primary'>Next</button>"
	}
	$('.quiz-main').find('.quiz-status').find('.attempt-controls').html(html);
	
	$('.btnNext').unbind().bind('click', function(){
		$('.quiz-main').find('.quiz-status').find('.attempt-controls').find('.btnNext').hide();
		this.currentQues += 1;
		this.PopulateQuestion();
	}.bind(this));
	$('.btnSubmit').unbind().bind('click', function(){
		alert('Quiz submitted !!');
		this.LoadData();
	}.bind(this));
}
quizController.prototype.DisplayReport = function()
{
	$('.quiz-footer').hide();
	$('.quiz-content').find('.quiz-main').hide();
	$('.quiz-content').find('.quiz-report').show();
	//find the correct question count
	var correctCount = 0;
	for(var question in this.questionsData){
		if(this.questionsData[question]["correctOption"] != null && this.questionsData[question]["markedOption"] != null){
			var marked = (JSON.parse(this.questionsData[question]["markedOption"])).indexOf(true);
			var correct = (JSON.parse(this.questionsData[question]["correctOption"])).indexOf(true);
			if(marked == correct){
				correctCount++;
			}
		}
	}
	var html = "<div class='quiz-report-data'><div>Correct: <span>"+correctCount+" / "+this.quizInfo.noOfQues+"</span></div>";
	html += "<div>Incorrect: <span>"+(this.quizInfo.noOfQues - correctCount)+" / "+this.quizInfo.noOfQues+"</span></div>";
	html += "<div>Accuracy: <span>"+(correctCount/this.quizInfo.noOfQues)*100+"%</span></div></div>";
	html += "<div class='quiz-report-btn'><button type='button' class='button button-primary btnReviewQuiz'>Review Quiz</button></div>";
	$('.quiz-content').find('.quiz-report').html(html);
	$('.quiz-content').find('.quiz-report').find('.btnReviewQuiz').unbind().bind('click', function(e){
		$(e.currentTarget).hide();
		//$('.quiz-content').find('.quiz-report').hide();
		$('.quiz-content').find('.quiz-main').show();
		var pos = $('.quiz-content').find('.quiz-main').offset().top;
		$('body').animate({scrollTop:pos});
		this.PopulateQuestion(true);
		this.HandleReviewControls();
	}.bind(this));
};
quizController.prototype.HandleReviewControls = function()
{
	console.log(this.currentQues);
	var html = "<button type='button' class='btnPrev button button-primary'>Previous</button>"+
			"<button type='button' class='btnNext button button-primary'>Next</button>"+
			"<button type='button' class='btnFinish button button-primary'>Finish</button>";
	$('.quiz-main').find('.quiz-status').find('.attempt-controls').html(html);
	$('.quiz-main').find('.quiz-status').find('.attempt-controls').find('.btnPrev').hide();
	if(this.quizInfo.noOfQues == 1){
		$('.quiz-main').find('.quiz-status').find('.attempt-controls').find('.btnNext').hide();
	}
	else{
		$('.quiz-main').find('.quiz-status').find('.attempt-controls').find('.btnFinish').hide();
	}
	$('.quiz-main').find('.quiz-status').find('.attempt-controls').find('.btnPrev').unbind().bind('click', function(){
		this.currentQues -= 1;
		this.PopulateQuestion(true);
		this.HandleReviewControls();
		if(this.currentQues == 0){
			$('.quiz-main').find('.quiz-status').find('.attempt-controls').find('.btnPrev').hide();
			$('.quiz-main').find('.quiz-status').find('.attempt-controls').find('.btnNext').show();
			$('.quiz-main').find('.quiz-status').find('.attempt-controls').find('.btnFinish').hide();
		}
		else if(this.currentQues == this.quizInfo.noOfQues - 1){
			$('.quiz-main').find('.quiz-status').find('.attempt-controls').find('.btnPrev').show();
			$('.quiz-main').find('.quiz-status').find('.attempt-controls').find('.btnNext').hide();
			$('.quiz-main').find('.quiz-status').find('.attempt-controls').find('.btnFinish').show();
		}
		else{
			$('.quiz-main').find('.quiz-status').find('.attempt-controls').find('.btnPrev').show();
			$('.quiz-main').find('.quiz-status').find('.attempt-controls').find('.btnNext').show();
			$('.quiz-main').find('.quiz-status').find('.attempt-controls').find('.btnFinish').hide();
		}
	}.bind(this));
	$('.quiz-main').find('.quiz-status').find('.attempt-controls').find('.btnNext').unbind().bind('click', function(){
		this.currentQues += 1;
		this.PopulateQuestion(true);
		this.HandleReviewControls();
		if(this.currentQues == 0){
			$('.quiz-main').find('.quiz-status').find('.attempt-controls').find('.btnPrev').hide();
			$('.quiz-main').find('.quiz-status').find('.attempt-controls').find('.btnNext').show();
			$('.quiz-main').find('.quiz-status').find('.attempt-controls').find('.btnFinish').hide();
		}
		else if(this.currentQues == this.quizInfo.noOfQues - 1){
			$('.quiz-main').find('.quiz-status').find('.attempt-controls').find('.btnPrev').show();
			$('.quiz-main').find('.quiz-status').find('.attempt-controls').find('.btnNext').hide();
			$('.quiz-main').find('.quiz-status').find('.attempt-controls').find('.btnFinish').show();
		}
		else{
			$('.quiz-main').find('.quiz-status').find('.attempt-controls').find('.btnPrev').show();
			$('.quiz-main').find('.quiz-status').find('.attempt-controls').find('.btnNext').show();
			$('.quiz-main').find('.quiz-status').find('.attempt-controls').find('.btnFinish').hide();
		}
	}.bind(this));
	$('.quiz-main').find('.quiz-status').find('.attempt-controls').find('.btnFinish').unbind().bind('click', function(){
		this.currentQues = 0;
		$('.quiz-content').find('.quiz-main').hide();
		$('.quiz-content').find('.quiz-report').show();
		$('.btnReviewQuiz').show();
	}.bind(this));
};