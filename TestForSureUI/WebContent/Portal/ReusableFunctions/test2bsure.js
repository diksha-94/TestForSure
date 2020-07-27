var obj = null;
//var remoteServer = "http://3.6.58.203:8083";
var remoteServer = "http://localhost:8083";
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
					'<div class="brand-logo col-xs-8 col-sm-8 col-md-2 col-lg-2">'+
						'<a class="brand" href="home.html"><img src="../images/final/logo_white.png" alt="TEST-2B-SURE"></a>'+
					'</div>'+
					'<div class="menu-items col-md-7 col-lg-7 col-md-offset-1 col-lg-offset-1">'+
						'<ul class="test2bsure-menu">'+
							'<li class="menu-item active"><a href="home.html" class="link">Home</a></li>'+
							'<li class="menu-item exam-menu-li"><a class="link">Exams&nbsp;<img src="../images/final/down_arrow.png" style="height: 8px;">'+
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
							'<li class="menu-item"><a href="quiz.html" class="link">Quizzes</a></li>'+
							'<li class="menu-item"><a href="asknanswer.html" class="link">Ask & Answer</a></li>'+
							'<li class="menu-item"><a href="aboutus.html" class="link">About Us</a></li>'+
							'<li class="menu-item"><a href="contactus.html" class="link">Contact Us</a></li>'+
						'</ul>'+
					'</div>'+
					'<div class="login-register-items col-xs-4 col-sm-4 col-md-2 col-lg-2">'+
						'<ul class="test2bsure-options">'+
							'<li id="menuLogin" class="show"><button type="button" class="button button-default" id="btnLogin">'+
								'Login/Register</button>'+
							'</li>'+
							'<li id="userProfile" class="hide">'+
								'<span class="greeting">Hi&nbsp;<span id="loggedInUSer"></span></span>'+
								'<span class="logout"><a id="btnLogout">Logout</a></span>'+
							'</li>'+
						'</ul>'+
					'</div>'+
				'</div>';
	$(dom).append(html);
	//Load CSS, JS
	LoadCSS('header');
	LoadJS('../controller/user', function(){
		LoadJS('../ReusableFunctions/modal-struct', function(){
			LoadJS('../controller/header', function(){
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
						"<img src='../images/final/logo_white.png' class='logo-image-footer' alt='TEST-2B-SURE' />"+
						"<p class='about-us-footer'>Test2BSure.com is an online portal for "+
						"all types of competitive exams (Technical and Non-Technical) to "+
						"check performance/capability of a candidate before the actual exam. "+
						"This portal is especially focussed on those competitive exams which "+
						"are not easily available online. Using this portal, a candidate can "+
						"take a test free of cost and analyze his/her weak and strong points "+
						"with the help of statistics in the form of graphs provided in the "+
						"report section after end of the test and able to improve his/her "+
						"weak points.</p>"+
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
								"<li><a href='aboutus.html' target='_blank'>About Us</a></li>"+
								"<li><a href='contactus.html' target='_blank'>Contact Us</a></li>"+
							"</ul>"+
							"<ul class='list-inline'>"+
								"<li><a href='disclaimer.html' target='_blank'>Disclaimer</a></li>"+
								"<li><a href='privacy.html' target='_blank'>Privacy Policy</a></li>"+
							"</ul>"+
						"</div>"+
					"</div>"+
				"</div>";
	$(dom).append(html);
	LoadCSS('footer');
	LoadJS('../controller/footer');
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
	console.log(quiz);
	var html = "<div class='quiz-title' title='"+quiz.title+"'>"+quiz.title+"</div>"+
			   "<div class='quiz-border'></div>"+
			   "<div class='quiz-image'><img src='../images/quiz-icon.png' alt='Quiz'/></div>"+
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
	return html;
};
test2bsureController.prototype.ExamCard = function(exam, testCount, quizCount)
{
	var imageUrl = "../images/final/default_exam2.png";
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
function LoadCSS(filename) {
	var id = "CSS_" + filename.replace(/[^a-zA-Z0-9_]+/, "_").replace(".", "_");
	if (!document.getElementById(id)) {
		link = document.createElement('link');
		link.id = id;
		link.type = 'text/css';
		link.rel = 'stylesheet';
		link.href = "../css/" + filename + ".css";
		document.head.appendChild(link);
	}
};

function LoadJS(src, callback) {
	var id = "JS_" + src.replace(/[^a-zA-Z0-9_]+/, "_").replace(".", "_");
	if (!document.getElementById(id)) {
		var s = document.createElement('script');
		s.id = id;
		s.src =  src + ".js";
		s.async = true;
		s.onreadystatechange = s.onload = function() {
			if ( typeof this.callback != 'undefined') {
				this.callback();
			}
		}.bind({
			obj : s,
			callback : callback
		});
		document.getElementsByTagName('head')[0].appendChild(s);
	} else {
		if ( typeof callback !== "undefined") {
			callback.done = true;
			callback();
		}
	}
};
test2bsureController.prototype.SelfAuth = function(callback)
{
	LoadJS('../controller/user', function(){
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
				return this.key +": <b>"+ percent +"% </b> <br/> <b> " + y + "</b> " + params.key ;
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
