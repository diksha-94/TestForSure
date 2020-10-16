var examController = function(id){
	this.id = id;
	this.exam = {};
	this.tests = {};
	this.quizzes = {};
	this.Init();
};
examController.prototype.Init = function()
{
	this.LoadPage();
	this.LoadData();
};
examController.prototype.LoadPage = function()
{
	var html = "<div class='exam-banner col-xs-12 col-sm-12 col-md-12 col-lg-12 container' style='z-index: -1;'>"+
					"<h4 class='col-xs-12 col-sm-12 col-md-5 col-lg-5'></h4>"+
					"<div class='col-xs-12 col-sm-12 col-md-7 col-lg-7'></div>"+
			   "</div>"+
			   "<div class='exam-outer col-xs-12 col-sm-12 col-md-12 col-lg-12'>"+
					"<div class='exam-page col-xs-12 col-sm-12 col-md-12 col-lg-12 container'>"+
						"<div class='exam-items col-xs-12 col-sm-12 col-md-10 col-lg-10 col-xs-offset-0 col-sm-offset-0 col-md-offset-1 col-lg-offset-1'>"+
							"<div id='test-listing' class='test-listing col-xs-12 col-sm-12 col-md-12 col-lg-12'>"+
							"</div>"+
							"<div id='quiz-listing' class='quiz-listing col-xs-12 col-sm-12 col-md-12 col-lg-12'>"+
							"</div>"+
						"</div>"+
					"</div>"+
					"<div class='exam-info-detail col-xs-12 col-sm-12 col-md-12 col-lg-12'></div>"+
			   "</div>";
						
	$('body .common-content').html(html);
}
examController.prototype.LoadData = function()
{
	var id = this.id;
	var userId = -1;
	if(typeof userController != 'undefined' && typeof userController.getObj() != 'undefined' && (typeof userController.getObj().userData != 'undefined' && userController.getObj().userData != null) && typeof userController.getObj().userData.id != 'undefined'){
		userId = userController.getObj().userData.id;
	}
	fetch(remoteServer+'/test2bsure/exampage?id='+id+'&userId='+userId)
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
	$('.exam-details').find('.exam-info').html(html);
	$('.exam-info-detail').html(html);
	$('.exam-banner').find('h4').html(this.exam.title);
	$('.exam-banner').find('div').html(this.exam.description);
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
		html += "<li test-id='"+this.tests[test].id+"' data-action='"+this.tests[test].urlKey+"' class='col-xs-12 col-sm-12 col-md-3 col-lg-3'>";
		html += test2bsureController.getObj().TestCard(this.tests[test]);
		html += "</li>";
	}
	$('.test-listing').append(html);
	$('.test-listing').find('.btnStartTest').unbind().bind('click', function(e){
		var userId = -1;
		if(typeof userController != 'undefined' && typeof userController.getObj() != 'undefined' && (typeof userController.getObj().userData != 'undefined' && userController.getObj().userData != null) && typeof userController.getObj().userData.id != 'undefined'){
			userId = userController.getObj().userData.id;
		}
		if(userId == -1){
			//User not logged in
			$('#btnLogin').click();
			return false;
		}
		var action = $(e.currentTarget).parents('li[test-id]').attr('data-action');
		window.open(action, '_blank');
	});
	$('.test-listing').find('.btnReportTest').unbind().bind('click', function(e){
		var userId = -1;
		if(typeof userController != 'undefined' && typeof userController.getObj() != 'undefined' && (typeof userController.getObj().userData != 'undefined' && userController.getObj().userData != null) && typeof userController.getObj().userData.id != 'undefined'){
			userId = userController.getObj().userData.id;
		}
		if(userId == -1){
			//User not logged in
			$('#btnLogin').click();
			return false;
		}
		var testId = $(e.currentTarget).parents('li[test-id]').attr('test-id');
		//Get the last session Id
		var url = remoteServer+'/test2bsure/testsessionid?testId='+testId+'&userId='+userId;
		var type = 'GET';
		$.ajax({
			url: url,
			type: type,
			contentType: "application/json",
			context: this,
			success: function(response){
				console.log(response);
				var action = $(e.currentTarget).parents('li[test-id]').attr('data-action');
				window.open(action + '?sessionId='+response+'&report=1', "_self");
			},
			error: function(e){
				console.log(e);
			}
		});
	});
	$('.test-listing').find('span.reward').unbind().bind('click', function(){
		test2bsureController.getObj().ShowRewardInstructions();
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
		html += "<li quiz-id='"+this.quizzes[quiz].id+"' data-action='"+this.quizzes[quiz].urlKey+"' class='col-xs-12 col-sm-12 col-md-3 col-lg-3'>";
		html += test2bsureController.getObj().QuizCard(this.quizzes[quiz]);
		html += "</li>";
	}
	$('.quiz-listing').append(html);
	$('.quiz-listing').find('.btnQuizAction').unbind().bind('click', function(e){
		var userId = -1;
		if(typeof userController != 'undefined' && typeof userController.getObj() != 'undefined' && (typeof userController.getObj().userData != 'undefined' && userController.getObj().userData != null) && typeof userController.getObj().userData.id != 'undefined'){
			userId = userController.getObj().userData.id;
		}
		if(userId == -1){
			//User not logged in
			$('#btnLogin').click();
			return false;
		}
		var action = $(e.currentTarget).parents('li[quiz-id]').attr('data-action');
		window.open(action, "_self");
	});
	$('.quiz-listing').find('span.reward').unbind().bind('click', function(){
		test2bsureController.getObj().ShowRewardInstructions();
	});
};