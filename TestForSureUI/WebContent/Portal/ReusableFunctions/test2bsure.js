var obj = null;
var test2bsureController = function(){
	this.userData = null;
};
test2bsureController.getObj = function()
{
	if(obj == null){
		obj = new test2bsureController();
	}
	return obj;
};
test2bsureController.prototype.GetHeader = function(dom, callback){
	//should make it custom , as per the need on different pages
	var html = '<div class="header container-fluid">'+
					'<div class="col-xs-1 col-sm-1 sandwichbtn mobileView">'+
					 	'<div class="first"></div>'+
					 	'<div class="second"></div>'+
					 	'<div class="third"></div>'+
					 '</div>'+
					'<div class="brand-logo col-xs-5 col-sm-5 col-md-2 col-lg-2">'+
						'<a class="brand" href="/"><img src="WebContent/Portal/images/final/logo_white.png" alt="TEST-2B-SURE"></a>'+
					'</div>'+
					'<div class="menu-items col-xs-8 col-md-8 col-md-7 col-lg-7 col-md-offset-1 col-lg-offset-1">'+
						'<ul class="test2bsure-menu">'+
							'<li class="menu-item active"><a href="/" class="link">Home</a></li>'+
							'<li class="menu-item exam-menu-li"><a class="link">Exams&nbsp;<img src="WebContent/Portal/images/final/down_arrow.png" style="height: 8px;">'+
								'</a>'+
								'<div class="exam-menu-div">'+
									'<div class="col-md-4 col-lg-4 exam-tabs">'+
										'<ul class="exam-menu nav nav-tabs">'+
										'</ul>'+
									'</div>'+
									'<div class="tab-content exam-content col-md-8 col-lg-8">'+
									'</div>'+
								'</div>'+
							'</li>'+
							'<li class="menu-item course-menu-li"><a class="link">Courses&nbsp;<img src="WebContent/Portal/images/final/down_arrow.png" style="height: 8px;">'+
								'</a>'+
								'<div class="course-menu-div">'+
									'<ul class="course-menu">'+
									'</ul>'+
								'</div>'+
							'</li>'+
							'<li class="menu-item quiz-menu-li"><a class="link">Quizzes&nbsp;<img src="WebContent/Portal/images/final/down_arrow.png" style="height: 8px;">'+
								'</a>'+
								'<div class="quiz-menu-div">'+
									'<ul class="quiz-menu">'+
									'</ul>'+
								'</div>'+
							'</li>'+
							'<li class="menu-item"><a href="about" class="link">About Us</a></li>'+
							'<li class="menu-item"><a href="contact" class="link">Contact Us</a></li>'+
							'<button type="button" class="btnLogin mobileView button button-default" id="btnLogin1">Login/Register</button>'+
						'</ul>'+
					'</div>'+
					'<div class="exams mobileView col-xs-8 col-sm-8 col-md-7 col-lg-7 col-md-offset-1 col-lg-offset-1">'+
						'<span class="exam-head"><img src="WebContent/Portal/images/final/down_arrow.png" class="closed"/>Exams</span>'+
					'</div>'+
					'<div class="courses mobileView col-xs-8 col-sm-8 col-md-7 col-lg-7 col-md-offset-1 col-lg-offset-1">'+
						'<span class="course-head"><img src="WebContent/Portal/images/final/down_arrow.png" class="closed"/>Courses</span>'+
						'<ul class="course-menu">'+
						'</ul>'+
					'</div>'+
					'<div class="quizzes mobileView col-xs-8 col-sm-8 col-md-7 col-lg-7 col-md-offset-1 col-lg-offset-1">'+
						'<span class="quiz-head"><img src="WebContent/Portal/images/final/down_arrow.png" class="closed"/>Quizzes</span>'+
						'<ul class="quiz-menu">'+
						'</ul>'+
					'</div>'+
					'<div class="mobileView overlay"></div>'+
					'<div class="login-register-items col-xs-6 col-sm-6 col-md-2 col-lg-2">'+
						'<ul class="test2bsure-options">'+
							'<li id="menuLogin" class="show"><button type="button" class="btnLogin button button-default" id="btnLogin">'+
								'Login/Register</button>'+
							'</li>'+
							'<li id="userProfile" class="hide">'+
								'<i class="fa fa-user hide" aria-hidden="true"></i>'+
								'<span class="greeting"><span id="loggedInUSer"></span></span>'+
								'<img src="WebContent/Portal/images/final/down_arrow.png">'+
								//'<span class="logout"><a id="btnLogout">Logout</a></span>'+
							'</li>'+
						'</ul>'+
					'</div>'+
					'<div class="desktopView overlayD"></div>'+
					'<div class="desktopView overlayDMenu"></div>'+
					'<div class="profile-menu">'+
						'<ul>'+
							'<li id="myDashboard">My Dashboard</li>'+
							'<li id="changePassword">Change Password</li>'+
							'<li id="btnLogout">Logout</li>'+
						'</ul>'+
					'</div>'+
				'</div>';
	$(dom).append(html);
	if ($(window).width() < 768) {
		//mobile view
		$('.exam-menu-li').unbind().bind('click', function(){
			$('.exams.mobileView').css('display', 'block');
		});
		$('.exams.mobileView').find('span.exam-head').unbind().bind('click', function(){
			$('.exams.mobileView').css('display', 'none');
		});
		$('.quiz-menu-li').unbind().bind('click', function(){
			$('.quizzes.mobileView').css('display', 'block');
		});
		$('.quizzes.mobileView').find('span.quiz-head').unbind().bind('click', function(){
			$('.quizzes.mobileView').css('display', 'none');
		});
		$('.course-menu-li').unbind().bind('click', function(){
			$('.courses.mobileView').css('display', 'block');
		});
		$('.courses.mobileView').find('span.course-head').unbind().bind('click', function(){
			$('.courses.mobileView').css('display', 'none');
		});
	}
	else {
		$('.exam-menu-li').unbind().bind('mouseover', function(){
			$('.exam-menu-div').css('display', 'block');
			$('.overlayDMenu').css('height', 'calc(100% - 60px)');
			$("body").addClass("nobodyscroll");
		});
		$('.exam-menu-li').bind('mouseout', function(){
			$('.exam-menu-div').css('display', 'none');
			$('.overlayDMenu').css('height', '0px');
			$("body").removeClass("nobodyscroll");
		});
		$('.quiz-menu-li').unbind().bind('mouseover', function(){
			$('.quiz-menu-div').css('display', 'block');
			$('.overlayDMenu').css('height', 'calc(100% - 60px)');
			$("body").addClass("nobodyscroll");
		});
		$('.quiz-menu-li').bind('mouseout', function(){
			$('.quiz-menu-div').css('display', 'none');
			$('.overlayDMenu').css('height', '0px');
			$("body").removeClass("nobodyscroll");
		});
		$('.course-menu-li').unbind().bind('mouseover', function(){
			$('.course-menu-div').css('display', 'block');
			$('.overlayDMenu').css('height', 'calc(100% - 60px)');
			$("body").addClass("nobodyscroll");
		});
		$('.course-menu-li').bind('mouseout', function(){
			$('.course-menu-div').css('display', 'none');
			$('.overlayDMenu').css('height', '0px');
			$("body").removeClass("nobodyscroll");
		});
	}
	
	$('.sandwichbtn').unbind().bind('click', function(e){
		if($(e.currentTarget).hasClass('closebtn')){
			$(e.currentTarget).removeClass('closebtn');
			$('.menu-items').removeClass('expand');
			$('.exams.mobileView').css('display', 'none');
			$('.quizzes.mobileView').css('display', 'none');
			$('.courses.mobileView').css('display', 'none');
			$('.overlay').css('height', '0px');
			$("body").removeClass("nobodyscroll");
		}
		else{
			$(e.currentTarget).addClass('closebtn');
			$('.menu-items').addClass('expand');
			$('.overlay').css('height', '100%');
			$("body").addClass("nobodyscroll");
		}
	});
	$('.overlay').unbind().bind('click', function(){
		$('.sandwichbtn').click();
	});
	//Load CSS, JS
	LoadCSS('WebContent/Portal/css/header');
	LoadJS('WebContent/Portal/controller/user', function(){
		LoadJS('WebContent/Portal/ReusableFunctions/modal-struct', function(){
			LoadJS('WebContent/Portal/controller/header', function(){
				userController.getObj().SelfAuth(false, function(){
					if(typeof callback == 'function'){
						callback();
					}
				});
			});
		});
	});
}
test2bsureController.prototype.GetFooter = function(dom){
	//should make it custom , as per the need on different pages
	var html = "<div class='footer'>"+
					"<div class='left col-xs-12 col-sm-12 col-md-7 col-lg-7'>"+
						"<img src='WebContent/Portal/images/final/logo_white.png' class='logo-image-footer' alt='TEST-2B-SURE' />"+
						
					"</div>"+
					"<div class='right col-xs-12 col-sm-12 col-md-5 col-lg-5'>"+
						"<h3>Follow Us</h3>"+
						"<div class='social-media'>"+
							"<div class='social-media-links' id='facebook'>"+
								"<a href='https://www.facebook.com/test2bsure' target='_blank'><i class='fa fa-facebook'></i></a>"+
							"</div>"+
							"<div class='social-media-links' id='email'>"+
								"<a target='_blank' href='mailto:info.test2bsure@gmail.com'><i class='fa fa-envelope-o'></i></a>"+
							"</div>"+
						"</div>"+
						"<div class='website-links'>"+
							"<ul class='list-inline'>"+
								"<li><a data-action='about'>About Us</a></li>"+
								"<li><a data-action='contact'>Contact Us</a></li>"+
							"</ul>"+
							"<ul class='list-inline'>"+
								"<li><a data-action='disclaimer'>Disclaimer</a></li>"+
								"<li><a data-action='privacy-policy'>Privacy Policy</a></li>"+
							"</ul>"+
						"</div>"+
					"</div>"+
				"</div>";
	$(dom).append(html);
	LoadCSS('WebContent/Portal/css/footer');
	LoadJS('WebContent/Portal/controller/footer', function(){
		new footerController();
	});
}
test2bsureController.prototype.QueryString = function(url, key){
	var queryString = url.split('?')[1];
	var queryParam = queryString.split('&');
	for(var query in queryParam){
		var key1 = queryParam[query].split('=')[0];
		if(key1 == key){
			return queryParam[query].split('=')[1];
		}
	}
};
test2bsureController.prototype.ValidateEmail = function(email){
	 var regEx = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
	 if(regEx.test(email)){
		 return true;
	 }
	 return false;
};
test2bsureController.prototype.QuizCard = function(quiz)
{
	var html = "<div class='quiz-title' title='"+quiz.title+"'>"+quiz.title+"</div>"+
			   "<div class='quiz-border'></div>"+
			   "<div class='quiz-image'>";
	if(quiz.maxRewardPoints > 0){
		html += "<span class='reward' title='Click Here'><img src='WebContent/Portal/images/final/coin.png'/><span>+"+quiz.maxRewardPoints+"</span></span>";
	}
	else{
		html += "<img src='WebContent/Portal/images/quiz-icon.png' alt='Quiz'/>";
	}
	html +=    "</div>"+
			   "<div class='quiz-ques'>No. of Questions: "+quiz.noOfQues+"</div>"+
			   "<div class='quiz-marks'>Total Marks: "+(quiz.noOfQues * quiz.marksPerQues)+"</div>"+
			   "<div class='quiz-attempts'>Attempted "+(quiz.candidateCount)+" times</div>"+
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
test2bsureController.prototype.TestCard = function(test)
{
	var html = "<div class='test-head'>"+
			   		"<h4>"+test.title+"</h4>";
	if(test.maxRewardPoints > 0){
		html += "<span class='reward' title='Click Here'><img src='WebContent/Portal/images/final/coin.png'/><span>+"+test.maxRewardPoints+"</span></span>";
	}
	html += "</div>"+
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
	html += "<div class='controls col-xs-12 col-sm-12 col-md-12 col-lg-12'>";
	if(attemptFlag == true){
		//means the test is already attempted atleast once, show the report button
		html += "<button class='col-xs-6 col-sm-6 col-md-6 col-lg-6 btnReportTest button button-default'>Report</button>";
	}
	else{
		//means the test is already attempted atlease once, show the report button
		html += "<button class='col-xs-6 col-sm-6 col-md-6 col-lg-6 btnReportTest button button-default' disabled='disabled' title='You haven't attempted this test'>Report</button>";
	}
	if(resumeFlag == true){
		//means the test is in resumed state
		html += "<button class='col-xs-6 col-sm-6 col-md-6 col-lg-6 btnStartTest button button-primary'>Resume Test</button>";
	}
	else if(test.noOfAttempts == -1 || (test.noOfAttempts > 0 && test.noOfAttempts > attemptCount)){
		html += "<button class='col-xs-6 col-sm-6 col-md-6 col-lg-6 btnStartTest button button-primary'>Start Test</button>";
	}
	else{
		html += "<button class='col-xs-6 col-sm-6 col-md-6 col-lg-6 btnStartTest button button-primary' disabled='disabled' title='No. of Attempts finished'>Start Test</button>";
	}
	html += "</div>";
	//Attempt info
	html += "<div class='attemptInfo'>";
	var attemptMsg = "";
	var userId = -1;
	if(typeof userController != 'undefined' && typeof userController.getObj() != 'undefined' && (typeof userController.getObj().userData != 'undefined' && userController.getObj().userData != null) && typeof userController.getObj().userData.id != 'undefined'){
		userId = userController.getObj().userData.id;
	}
	if(test.noOfAttempts == -1){
		attemptMsg = "Unlimited Attempts available";
	}
	else{
		if(userId == -1){
			//User not logged in
			attemptMsg = test.noOfAttempts+" Attempts available";
		}
		else{
			//User logged in
			attemptMsg = (parseInt(test.noOfAttempts) - parseInt(attemptCount)) + " / " + test.noOfAttempts+" Attempts available";
		}
	}
	html += "<span>" + attemptMsg + "</span>";
	html += "</div>";
	return html;
};
test2bsureController.prototype.ExamCard = function(exam, testCount, quizCount)
{
	var imageUrl = "WebContent/Portal/images/final/default_exam2.png";
	if(exam.imageUrl.length > 5){
		imageUrl = exam.imageUrl;
	}
	var html = "<div class='main-div'>"+
			   	"<img src='"+imageUrl+"' alt='"+exam.title+"'>"+
			   	"<div class='bottom-div'>"+
			   	"<h5>"+exam.title+"</h5>"+
			   	"<div class='exam-data'>";
	var found = false;
	for(var test in testCount){
		if(testCount[test].examId == exam.id){// && testCount[test].testCount > 0){
			found = true;
			html += "<div class='test-count item-count'><span>Number of Tests</span><span>"+ testCount[test].testCount+"</span></div>";
			break;
		}
	}
	if(!found){
		html += "<div class='test-count item-count'><span>Number of Tests</span><span>0</span></div>";
	}
	found = false;
	for(var quiz in quizCount){
		if(quizCount[quiz].examId == exam.id){// && quizCount[quiz].quizCount > 0){
			found = true;
			html += "<div class='test-count item-count'><span>Number of Quizzes</span><span>"+ quizCount[quiz].quizCount+"</span></div>";
			break;
		}
	}
	if(!found){
		html += "<div class='test-count item-count'><span>Number of Quizzes</span><span>0</span></div>";
	}
	html += "</div>";
	html += "</div>";
	return html;
};
test2bsureController.prototype.Draw3DPieChart = function(valueObject, total, dom, title){
	var dataObject = [];
	for(var obj in valueObject){
		var arrayObj = [];
		arrayObj.push(obj);
		arrayObj.push((valueObject[obj]*100)/total);
		dataObject.push(arrayObj);
	}
	console.log(dataObject);
	var chart = {      
       type: 'pie',
       options3d: {
          enabled: true,
          alpha: 45,
          beta: 0
       }
    };
    var title = {
       text: title   
    };   
	var tooltip = {
	       pointFormat: '<b>{point.percentage:.1f}%</b>'
	};
    var plotOptions = {
       pie: {
          cursor: 'pointer',
          depth: 35,
          
          dataLabels: {
             enabled: true,
             format: '{point.name}'
          }
       }
    };   
    var series = [{
       type: 'pie',
       data: dataObject
    }];     
    var json = {};   
    json.chart = chart; 
    json.title = title;       
    json.tooltip = tooltip; 
    json.plotOptions = plotOptions; 
    json.series = series;   
    $(dom).highcharts(json);
}
test2bsureController.prototype.SetCookie = function(cname, cvalue, exdays)
{
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
};
test2bsureController.prototype.getCookie = function(cname)
{
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
};
test2bsureController.prototype.SelfAuth = function(callback)
{
	LoadJS('WebContent/Portal/controller/user', function(){
		userController.getObj().SelfAuth(false, function(){
			if(typeof callback == 'function'){
				callback();
			}
		});
	});
};
test2bsureController.prototype.PieChart = function(params)
{
	Highcharts.chart(params.id, {
	    chart: {
	        type: 'pie',
	    },
	    title: {
           text: params.title ,
           verticalAlign: 'middle',
		   floating:true,	
		   //widthAdjust: -300,
		   x: 0,
       	   y: 0,
		   style: {
	            color: '#333333',
	            fontWeight: 'bold',
	            fontSize:'10px'
	        }
		},

	    plotOptions: {
           pie: {
		      innerSize: 180,
		      depth: 50,
		      showInLegend: true
		    },
		},
		colors: Highcharts.map(params.colors, function (color) {
	        return {
	            linearGradient: {
	                cx: 0.5,
	                cy: 0.3,
	                r: 0.7
	            },
	            stops: [
	                [0, color],
	                [1, Highcharts.Color(color).brighten(-0.3).get('rgb')] // darken
	            ]
	        };
	    }),
		tooltip: {
			formatter: function () {
				var percent = Math.round(this.percentage * 100) / 100;
				var y = Math.round(this.y * 100) / 100;
				var str = this.key +": <b>"+ percent +"% </b> <br/> <b> ";
				//secs represent time, so format it and show. Else show the value with the key
				if(params.key == 'secs'){
					str += test2bsureController.getObj().getTimeFormat(y) + "</b> ";
				}
				else{
					str += y + " " + params.key;
				}
				return str;
        	}
		},
		credits: {
			enabled: false
		},
	    series: [{
	        data: params.series,
	        size: '70%'
	    }]
	});
};
test2bsureController.prototype.getTimeFormat = function(seconds){
	var secs = 0;
	var mins = 0;
	var hrs = 0;
	var onlySecs = false;
	if(seconds >= 60){
		mins = parseInt(seconds / 60);
		secs = parseInt(seconds % 60);
		if(mins >= 60){
			hrs = parseInt(mins / 60);
			mins = parseInt(mins % 60);
		}
	}
	else{
		onlySecs = true;
		secs = parseInt(seconds);
	}
	var result = (hrs > 0)?(hrs+" hrs "):"";
	result += (mins > 0)?(mins+" mins "):"";
	if(onlySecs){
		result += (secs+" secs ");
	}
	else{
		result += (secs > 0)?(secs+" secs "):"";
	}
	return result;
}

test2bsureController.prototype.CalculateRewardPointsEarned = function(itemType, sessionId, itemId, totalMarks, callback)
{
	var userId = -1;
	if(typeof userController != 'undefined' && typeof userController.getObj() != 'undefined' && (typeof userController.getObj().userData != 'undefined' && userController.getObj().userData != null) && typeof userController.getObj().userData.id != 'undefined'){
		userId = userController.getObj().userData.id;
	}
	//userId, itemType, itemId, sessionId, totalMarks
	$.ajax({
		url: remoteServer + "/test2bsure/reward-calculation?userId="+userId+"&itemType="+itemType+"&itemId="+itemId+"&sessionId="+sessionId+"&totalMarks="+totalMarks,
		type: 'POST',
		success: function(response){
			callback(response);
		}.bind(this),
		error: function(e){
			console.log(e);
		}
	});
};
//Show Rewards after Test/Quiz Completion
test2bsureController.prototype.ShowRewardPointsEarned = function(itemType, earnedPoints)
{
	var modal = '<div class="modal" id="rewardPointModal">'+
					'<div class="modal-dialog col-xs-11 col-sm-11 col-md-4 col-lg-4">'+
						'<div class="modal-content">'+
							'<div class="modal-header">'+
								'<h4 class="modal-title">Congratulations !!</h4>'+
								'<button type="button" class="close" data-dismiss="modal">&times;</button>'+
							'</div>'+
		
							'<div class="modal-body">'+
								
							'</div>'+
							/*'<div class="modal-footer">'+
								'<button type="button" class="btn btn-primary" data-dismiss="modal">Okay</button>'+
							'</div>'+*/
						'</div>'+
					'</div>'+
				'</div>';
	if($('#rewardPointModal').length == 0){
		$('body').append(modal);
	}
	var type = itemType == 0 ? "Test" : "Quiz";
	var html = "<h5>You have earned <span class='rewards'> "+earnedPoints+" reward points </span> based on your performance in the "+type+"</h5>"+
			   "<img src='WebContent/Portal/images/final/smile.png'/>"+
			   "<h4>Attempt More Tests/Quizzes and Earn More Points !!</h4>";
	$('#rewardPointModal .modal-body').html(html);
	$('#rewardPointModal').modal('show');
}
//Show Rewards instructions
test2bsureController.prototype.ShowRewardInstructions = function()
{
	var modal = '<div class="modal" id="rewardInstructionModal">'+
					'<div class="modal-dialog col-xs-11 col-sm-11 col-md-4 col-lg-4">'+
						'<div class="modal-content">'+
							'<div class="modal-header">'+
								'<h4 class="modal-title">Attempt & Earn Reward Points</h4>'+
								'<button type="button" class="close" data-dismiss="modal">&times;</button>'+
							'</div>'+
		
							'<div class="modal-body">'+
								'<p>On scoring <b>40% or above marks</b>, you will get reward points based on the percentage of marks scored.</br>'+
								'You can keep track of your performance and view the reward points history in Dashboard.</p>'+
							'</div>'+
							/*'<div class="modal-footer">'+
								'<button type="button" class="btn btn-primary" data-dismiss="modal">Okay</button>'+
							'</div>'+*/
						'</div>'+
					'</div>'+
				'</div>';
	if($('#rewardInstructionModal').length == 0){
		$('body').append(modal);
	}
	$('#rewardInstructionModal').modal('show');
};
//Show Quiz timer instructions
test2bsureController.prototype.ShowQuizTimerInstructions = function()
{
	var modal = '<div class="modal" id="quizTimerInstructionModal">'+
					'<div class="modal-dialog col-xs-11 col-sm-11 col-md-4 col-lg-4">'+
						'<div class="modal-content">'+
							'<div class="modal-header">'+
								'<h4 class="modal-title">Time Based Quiz</h4>'+
								'<button type="button" class="close" data-dismiss="modal">&times;</button>'+
							'</div>'+
							'<div class="modal-body">'+
								'<p>This is a time-based quiz, where time is given per question.</p>'+
							'</div>'+
							'<div class="modal-footer">'+
								'<button type="button" class="btn btn-primary" data-dismiss="modal">Continue</button>'+
							'</div>'+
						'</div>'+
					'</div>'+
				'</div>';
	if($('#quizTimerInstructionModal').length == 0){
		$('body').append(modal);
	}
	$('#quizTimerInstructionModal').modal('show');
}

test2bsureController.prototype.ChapterCard = function(content)
{
	var html = "<div class='content lock col-xs-12 col-sm-12 col-md-12 col-lg-12' data-id='"+content.chapterId+"' data-action='"+content.urlKey+"'>"+
			   		"<h4>"+content.chapterName+"</h4>"+
					"<span>-></span>"+
			   "</div>";
	return html;
}