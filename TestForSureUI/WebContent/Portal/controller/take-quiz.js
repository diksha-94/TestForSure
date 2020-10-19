
var quizController = function(){
	this.id = 0;
	this.quizInfo = {};
	this.questionsData = {};
	this.sessionId = 0;
	this.currentQues = 0;
	this.reportData = {};
	this.interval = null;
	this.timeTaken = 0;
	this.review = false;
	this.Init();
};
quizController.prototype.Init = function()
{
	//Read id from query string
	this.id = test2bsureController.getObj().QueryString(window.location.href, 'id');
	test2bsureController.getObj().SelfAuth(function(){
		this.LoadData();
	}.bind(this));
};
quizController.prototype.LoadData = function(showReward)
{
	showReward = typeof showReward != 'undefined' ? showReward : false;
	var id = this.id;
	var userId = -1;
	if(typeof userController != 'undefined' && typeof userController.getObj() != 'undefined' && (typeof userController.getObj().userData != 'undefined' && userController.getObj().userData != null) && typeof userController.getObj().userData.id != 'undefined'){
		userId = userController.getObj().userData.id;
	}
	fetch(remoteServer+'/test2bsure/quizdata?quizId='+id+'&userId='+userId)
	  .then(response => response.json())
	  .then(data => this.SetState({ quizInfo: data.quizInfo, questionsData: data.questionsData, sessionId: data.sessionId }));
	
	//Show reward points after 1 second on submission, if earned
	setTimeout(function(){
		if(showReward){
			test2bsureController.getObj().CalculateRewardPointsEarned(1, this.sessionId, this.id, parseInt(this.quizInfo.noOfQues) * parseInt(this.quizInfo.marksPerQues), function(response){
				if(response.earnedRewardPoints > 0)
					test2bsureController.getObj().ShowRewardPointsEarned(1, response.earnedRewardPoints);
			});
		}
	}.bind(this), 1000);
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
		this.review = true;
		$('.quiz-content').css('background-color', '#FFF');
		$('.quizTimer').remove();
		$('.quiz-time-spent').removeClass('hide').addClass('show');
		$('.quiz-info-value').addClass('solution');
		this.DisplayReport();
	}
	else{
		//Display the question wherever left
		$('.quiz-info-value').addClass('attempt');
		$('.quiz-time-spent').removeClass('show').addClass('hide');
		this.PopulateQuestion();
	}
	this.PopulateQuestionStatus();
};
quizController.prototype.PopulateQuizDetails = function()
{
	var html = "<div class='brand-logo-quiz col-xs-1 col-sm-1 col-md-3 col-lg-3'>"+
					"<a class='brand' href='home.html'>"+
						"<img src='../images/final/logo_white.png' alt='TEST-2B-SURE'>"+
						"<i class='fa fa-home'></i>"+
					"</a>"+
				"</div>"+
				"<div class='quiz-details col-xs-10 col-sm-10 col-md-9 col-lg-9'>"+
					"<div class='quiz-title col-xs-12 col-sm-12 col-md-8 col-lg-8'><h4>"+this.quizInfo.title+"</h4></div>"+
					"<div class='quiz-info col-xs-12 col-sm-12 col-md-4 col-lg-4'>"+
						"<span>"+this.quizInfo.noOfQues+" QUES / "+(this.quizInfo.noOfQues * this.quizInfo.marksPerQues)+" MARKS";
	if(parseInt(this.quizInfo.timePerQues) > 0){
		html += " / "+this.quizInfo.timePerQues + "SECS PER QUES";
		$('.quizTimer').removeClass('hide').addClass('show');
	}
	html += 	"</span>"+
					"</div>"+
				"</div>";
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
	if(question.paragraph == "true" || question.paragraph == "1"){
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
	var options = question.options;
	if(options.startsWith('"')){
		options = options.substring(1);
	}
	if(options.endsWith('"')){
		options = options.substring(0, options.length-1);
	}
	$(options).find('option').each(function(key, value){
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
	//Populate Time Spent
	if(parseInt(this.quizInfo.timePerQues) > 0){
		$('.quiz-time-spent').html("Time Spent: "+question.timeSpent + " secs");
	}
	$('.quiz-main').find('.quiz-questions').find('.quiz-options').find('.option').unbind().bind('click', function(e){
		clearInterval(this.interval);
		this.CheckAnswer(e.currentTarget);
	}.bind(this));
	if(!this.review && parseInt(this.quizInfo.timePerQues) > 0){
		this.StartTimer();
	}
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
			if(markedOption.length == 0){
				status = 'notvisited';
			}
			else if(correctOption.indexOf(true) == markedOption.indexOf(true)){
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
	var answer = '[';
	var option = -1;
	if(typeof node == 'undefined'){
		answer = '[]';
	}
	else{
		option = $(node).attr('data-option');
		option = parseInt(option);
		for(var i=0;i<=option;i++){
			if(i == option){
				answer += 'true]';
			}
			else{
				answer += 'false,';
			}
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
	this.timeTaken = this.timeTaken > parseInt(this.quizInfo.timePerQues) ? parseInt(this.quizInfo.timePerQues) : this.timeTaken;
	var url = remoteServer+'/test2bsure/checkanswer?quesid='+quesId+'&quesindex='+quesIndex+'&sessionid='+sessionId+'&answer='+answer+'&submit='+submit+'&timeSpent='+this.timeTaken;
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
			if(option != -1)
				$('.question-status').find('span[qid='+quesId+']').removeClass('notvisited').addClass('incorrect');
			var correctIndex = correctAnswer.indexOf(true);
			$('.quiz-options').find('.option[data-option='+correctIndex+']').addClass('correct');
			$('.quiz-options').find('.option[data-option='+correctIndex+']').find('span.option-count').addClass('correct');
		}
		$('.quiz-options').find('.option').addClass('block-events');
		$('.quiz-options').find('.option').addClass('no-hover');
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
		//Calculate reward points here
		this.LoadData(true);
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
	//var html = "<div class='quiz-report-data'><div>Correct: <span>"+correctCount+" / "+this.quizInfo.noOfQues+"</span></div>";
	//html += "<div>Incorrect: <span>"+(this.quizInfo.noOfQues - correctCount)+" / "+this.quizInfo.noOfQues+"</span></div>";
	//html += "<div>Accuracy: <span>"+(correctCount/this.quizInfo.noOfQues)*100+"%</span></div></div>";
	
	var html = "<div class='report-head'>Quiz Report</div><div class='description-div'>";
	html += '<div class="description-block correct"><span class="report-text">CORRECT</span><div class="svgholder"><svg viewBox="0 0 36 36"><path d="M18 6 a 12 12 0 0 1 0 24 a 12 12 0 0 1 0 -24" fill="none" stroke="#D9534F" stroke-width="2" stroke-dasharray="100, 100"></path></svg><svg class="progress-loader" viewBox="0 0 36 36"><path class="correct-per" d="M18 6 a 12 12 0 0 1 0 24 a 12 12 0 0 1 0 -24" fill="none" stroke="#5CB85C" stroke-width="2" stroke-dasharray="100, 100"></path></svg></div><span class="label"> ('+correctCount+'/'+this.quizInfo.noOfQues+')</span></div>';
	html += '<div class="description-block incorrect"><span class="report-text">INCORRECT</span><div class="svgholder"><svg viewBox="0 0 36 36"><path d="M18 6 a 12 12 0 0 1 0 24 a 12 12 0 0 1 0 -24" fill="none" stroke="#D9534F" stroke-width="2" stroke-dasharray="100, 100"></path></svg><svg class="progress-loader" viewBox="0 0 36 36"><path class="incorrect-per" d="M18 6 a 12 12 0 0 1 0 24 a 12 12 0 0 1 0 -24" fill="none" stroke="#5CB85C" stroke-width="2" stroke-dasharray="100, 100"></path></svg></div><span class="label"> ('+(this.quizInfo.noOfQues - correctCount)+'/'+this.quizInfo.noOfQues+')</span></div>';
	html += '<div class="description-block accuracy"><span class="report-text">ACCURACY</span><div class="svgholder"><svg viewBox="0 0 36 36"><path d="M18 6 a 12 12 0 0 1 0 24 a 12 12 0 0 1 0 -24" fill="none" stroke="#D9534F" stroke-width="2" stroke-dasharray="100, 100"></path></svg><svg class="progress-loader" viewBox="0 0 36 36"><path class="accuracy-per" d="M18 6 a 12 12 0 0 1 0 24 a 12 12 0 0 1 0 -24" fill="none" stroke="#5CB85C" stroke-width="2" stroke-dasharray="100, 100"></path></svg></div><span class="label"> ('+(correctCount/this.quizInfo.noOfQues)*100+'%)</span></div>';
	html += '</div>';
	
	html += "<div class='quiz-report-btn'><button type='button' class='button button-primary btnReviewQuiz'>Review Quiz</button></div>";
	$('.quiz-content').find('.quiz-report').html(html);
	var radius = 12;
	var cf = (2*22*radius) / 7;
	var correctPer = (correctCount*100)/this.quizInfo.noOfQues;
	correctPer = (correctPer/100) * cf;
	var incorrectPer = ((this.quizInfo.noOfQues - correctCount)*100)/this.quizInfo.noOfQues;
	incorrectPer = (incorrectPer/100) * cf;
	$('.correct-per').attr('stroke-dasharray', ''+correctPer+', 100');
	$('.incorrect-per').attr('stroke-dasharray', ''+incorrectPer+', 100');
	$('.accuracy-per').attr('stroke-dasharray', ''+correctPer+', 100');
	$('.quiz-content').find('.quiz-report').find('.btnReviewQuiz').unbind().bind('click', function(e){
		$(e.currentTarget).hide();
		$('.quiz-info-value').removeClass('attempt').addClass('solution');
		$('.quiz-info-head').html('Quiz Solution');
		$('.takeonly').hide();
		//$('.quiz-content').find('.quiz-report').hide();
		$('.quiz-content').find('.quiz-main').show();
		var pos = $('.quiz-content').find('.quiz-main').offset().top - 40;
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
quizController.prototype.StartTimer = function()
{
	if(this.interval != null){
		clearInterval(this.interval);
	}
	this.timeTaken = 0;
	$('.quizTimer').width('100%');
	var fullWidth = $('.quizTimer').width();
	var perSecWidth = fullWidth / parseInt(this.quizInfo.timePerQues);
	this.interval = setInterval(function(){
		if($('.quizTimer').width() <= 0){
			clearInterval(this.interval);
			this.CheckAnswer();
			alert("Time is Over !!");
		}
		else{
			this.timeTaken += 1;
			$('.quizTimer').width($('.quizTimer').width() - perSecWidth);
		}
	}.bind(this), 1000);
};