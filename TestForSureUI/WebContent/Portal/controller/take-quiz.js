var quizController = function(){
	this.id = 0;
	this.quizInfo = {};
	this.questionsData = {};
	this.sessionId = 0;
	this.currentQues = 0;
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
	fetch('http://localhost:8083/test2bsure/quizdata?quizId='+id)
	  .then(response => response.json())
	  .then(data => this.SetState({ quizInfo: data.quizInfo, questionsData: data.questionsData, sessionId: data.sessionId }));
}
quizController.prototype.SetState = function(obj)
{
	for(var key in obj){
		this[key] = obj[key];
	}
	if(typeof this.quizInfo.attemptInfo != 'undefined' && this.quizInfo.attemptInfo != null){
		this.currentQues = this.quizInfo.attemptInfo.lastQues;
	}
	this.PopulateQuizDetails();
	this.PopulateQuestion();
	this.currentQues = this.currentQues + 1;
	this.PopulateQuestionStatus();
	this.PopulateControls();
};
quizController.prototype.PopulateQuizDetails = function()
{
	var html = "<h4 class='col-xs-6 col-sm-6 col-md-8 col-lg-8 col-xs-offset-0 col-sm-offset-0 col-md-offset-1 col-lg-offset-1'>"+this.quizInfo.title+"</h4>"+
			   "<span>"+this.quizInfo.noOfQues+" Ques / "+(this.quizInfo.noOfQues * this.quizInfo.marksPerQues)+" Marks</span>";
	$('.quiz-header').html(html);
};
quizController.prototype.PopulateQuestion = function(qno)
{
	var question = this.questionsData[this.currentQues];
	var html = "<div class='question' question-id='"+question.id+"' question-index='"+this.currentQues+"'>"+
					"<div class='question-desc'>"+
						"<span class='question-number'>"+(this.currentQues+1)+"</span>";
	if(question.paragraph == "true"){
		html += "<span class='para-text'>"+question.paragraphText+"</span>";
	}
	html += "<span class='question-text'>"+question.questionText+"</span>"+
			"</div>"+
			"<div class='options'>";
	$(question.options).find('option').each(function(key, value){
		html += "<div class='option' data-option='"+key+"'>"+
					"<span class='option-count'>"+(key+1)+"</span>"+
					"<span class='option-value'>"+$(value).html()+"</span>"+
					"<span class='answer-status'></span>"+
				"</div>";
	});
	html += "</div>";
	html += "<div class='solution'>"+
			"</div>";
	$('.quiz').find('.quiz-left').html(html);
	this.currentQues  = this.currentQues + 1;
	$('.quiz').find('.quiz-left').find('.option').unbind().bind('click', function(e){
		this.CheckAnswer(e.currentTarget);	
	}.bind(this));
					
};
quizController.prototype.PopulateQuestionStatus = function()
{
	var html = "<h5>Question Status</h5>"+
			   "<div class='question-status'>";
	for(var question in this.questionsData){
		html += "<span class='notvisited' qindex='"+(question)+"' qId='"+(this.questionsData[question]).id+"'>"+(parseInt(question)+1)+"</span>";
	}
	html += "</div>";
	$('.quiz').find('.quiz-right').html(html);
};
quizController.prototype.CheckAnswer = function(node)
{
	var option = $(node).attr('data-option');
	console.log('Option selected: '+option);
	
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
	var quesId = $(node).parents('.question').attr('question-id');
	console.log(quesId);
	console.log(sessionId);
	var submit = 0;
	if(this.currentQues == this.quizInfo.noOfQues){
		submit = 1;
	}
	var url = 'http://localhost:8083/test2bsure/checkanswer?quesid='+quesId+'&sessionid='+sessionId+'&answer='+answer+'&submit='+submit;
	fetch(url)
	  .then(response => response.json())
	  .then(function(data){
		console.log(data);
		if(data.indexOf(true) == option){
			console.log('Correct answer');
			$(node).addClass('correct');
		}
		else{
			console.log('Wrong answer');
			$(node).addClass('incorrect');
			var correctIndex = data.indexOf(true);
			$('.question[question-id='+quesId+']').find('.option[data-option='+correctIndex+']').addClass('correct');
		}
		$(node).parents('.options').find('.option').addClass('block-events');
		$(node).parents('.options').find('.option').addClass('no-hover');
	  });
};
quizController.prototype.PopulateControls = function(){
	var html = "<div class='attempt-controls'>"+
					"<button type='button' class='button button-primary'>Next</button>"+
					"<button type='button' class='button button-primary' style='display:none;'>Submit</button>"+
				"</div>";
	$('.quiz').find('.quiz-left').append(html);
}