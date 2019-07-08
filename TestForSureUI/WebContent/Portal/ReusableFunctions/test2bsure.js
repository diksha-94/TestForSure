var obj = null;
var remoteServer = "http://localhost:8083";
//18.219.24.151
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
test2bsureController.prototype.GetHeader = function(dom){
	//should make it custom , as per the need on different pages
	$(dom).load('header.html', function(){
		
	}.bind(this));
	//$(dom).html("<div> TEST2BSURE Header </div>");
}
test2bsureController.prototype.GetFooter = function(dom){
	//should make it custom , as per the need on different pages
	$(dom).load('footer.html', function(){
		
	}.bind(this));
	//$(dom).html("<div> TEST2BSURE Footer </div>");
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
		//means the test is already attempted atlease once, show the report button
		html += "<button class='col-xs-6 col-sm-6 col-md-6 col-lg-6 btnReportTest button button-default'>Report</button>";
	}
	else{
		//means the test is already attempted atlease once, show the report button
		html += "<button class='col-xs-6 col-sm-6 col-md-6 col-lg-6 btnReportTest button button-default' disabled='disabled'>Report</button>";
	}
	if(resumeFlag == true){
		//means the test is in resumed state
		html += "<button class='col-xs-6 col-sm-6 col-md-6 col-lg-6 btnStartTest button button-primary'>Resume Test</button>";
	}
	else if(test.noOfAttempts == -1 || (test.noOfAttempts > 0 && test.noOfAttempts > attemptCount)){
		html += "<button class='col-xs-6 col-sm-6 col-md-6 col-lg-6 btnStartTest button button-primary'>Start Test</button>";
	}
	else{
		html += "<button class='col-xs-6 col-sm-6 col-md-6 col-lg-6 btnStartTest button button-primary' disabled='disabled'>Start Test</button>";
	}
	html += "</div>";
	return html;
};
test2bsureController.prototype.ExamCard = function(exam, testCount, quizCount)
{
	var html = "<div class='top-div'></div>"+
			   "<img src='"+exam.imageUrl+"' alt='"+exam.title+"'>"+
			   "<div class='bottom-div'>"+
			   "<h5>"+exam.title+"</h5>"+
			   "<div class='exam-data'>";
	for(var test in testCount){
		if(testCount[test].examId == exam.id && testCount[test].testCount > 0){
			html += "<div class='test-count item-count'>Number of Tests<span>"+ testCount[test].testCount+"</span></div>";
			break;
		}
	}
	for(var quiz in quizCount){
		if(quizCount[quiz].examId == exam.id && quizCount[quiz].quizCount > 0){
			html += "<div class='test-count item-count'>Number of Quizzes<span>"+ quizCount[quiz].quizCount+"</span></div>";
			break;
		}
	}
	html += "</div>";
	html += "<div class='exam-explore'><button class='button button-primary btnExplore'>Explore Exam</button></div>";
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