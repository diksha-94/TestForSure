var express = require('express');
var app = express();
var request = require('request'),
	Promise = require('q'),
    http = require('request-promise-json'),
    _ = require("lodash"),
    CommandsFactory = require("hystrixjs/lib/command/CommandFactory");


//app.use(express.static('WebContent'));
app.use(express.static(__dirname + '/WebContent')); 
var bodyParser = require('body-parser');
app.use(bodyParser.json({limit: '50mb'}));

app.get('/getenv',function(req,res){
		var protocol = process.env.PROTOCOL;
		var servicesIp = process.env.SERVICES_IP;
		var servicesHost = process.env.SERVICES_PORT;
		var subdomain = process.env.SUBDOMAIN;
		var newsNotifications = process.env.NEWS_NOTIFICATIONS;
		var questionBank = process.env.QUESTION_BANK;
		var test = process.env.TEST;
		var user = process.env.USER;
		//NEWS
		var getAllNews = process.env.GET_ALL_NEWS;
		var getNews = process.env.GET_NEWS;
		var insertNews = process.env.INSERT_NEWS;
		var deleteNews = process.env.DELETE_NEWS;
		var updateNews = process.env.UPDATE_NEWS;
		//QUESTION BANK
		var getSubjectCategory = process.env.GET_SUBJECT_CATEGORY;
		var getSubjectSubcategory = process.env.GET_SUBJECT_SUBCATEGORY;
		var addSubjectCategory = process.env.ADD_SUBJECT_CATEGORY;
		var addSubjectSubcategory = process.env.ADD_SUBJECT_SUBCATEGORY;
		var getQuestionsFromBank = process.env.GET_QUESTIONS_FROM_BANK;
		var addQuestionFromBank = process.env.ADD_QUESTION_FROM_BANK;
		var deleteQuestionFromBank = process.env.DELETE_QUESTION_FROM_BANK;
		var updateQuestionFromBank = process.env.UPDATE_QUESTION_FROM_BANK;
		var addQuestionsToTest = process.env.ADD_QUESTIONS_TO_TEST;
		//TEST
		var getCategory = process.env.GET_CATEGORY;
		var getSubcategory = process.env.GET_SUBCATEGORY;
		var addUpdateTest = process.env.ADD_UPDATE_TEST;
		var addQuestion = process.env.ADD_QUESTION;
		var getTests = process.env.GET_TESTS;
		var getTestsByStatus = process.env.GET_TESTS_BYSTATUS;
		var getTestsById = process.env.GET_TESTSBYID;
		var getQuestions = process.env.GET_QUESTIONS;
		var addCategory = process.env.ADD_CATEGORY;
		var addSubcategory = process.env.ADD_SUBCATEGORY;
		var deleteQuestion = process.env.DELETE_QUESTION;
		var publishTest = process.env.PUBLISH_TEST;
		var unpublishTest = process.env.UNPUBLISH_TEST;
		var getTestResult = process.env.GET_TEST_RESULT;
		var testAlreadyAttempted = process.env.TEST_ALREADY_ATTEMPTED;
		var getAllReports = process.env.GET_ALL_REPORTS;
		var getTestSolution = process.env.GET_TEST_SOLUTION;
		//USER
		var registerUser = process.env.REGISTER_USER;
		var authenticateUser = process.env.AUTHENTICATE_USER;
		var forgotPassword = process.env.FORGOT_PASSWORD;
		var updatePassword = process.env.UPDATE_PASSWORD;
		var getCurrentPassword = process.env.GET_CURRENT_PASSWORD;
		
		var details = protocol+"|"+servicesIp+"|"+servicesHost+"|"+subdomain+"|"+newsNotifications+"|"+questionBank+"|"+test+"|"+user+"|"+getAllNews+"|"+getNews+"|"+insertNews+"|"+deleteNews+"|"+updateNews+"|"+getSubjectCategory+"|"+getSubjectSubcategory+"|"+addSubjectCategory+"|"+addSubjectSubcategory+"|"+getQuestionsFromBank+"|"+addQuestionFromBank+"|"+deleteQuestionFromBank+"|"updateQuestionFromBank+"|"+addQuestionsToTest+"|"+getCategory+"|"+getSubcategory+"|"+addUpdateTest+"|"+addQuestion+"|"+getTests+"|"+getTestsByStatus+"|"+getTestsById+"|"+getQuestions+"|"+addCategory+"|"+addSubcategory+"|"+deleteQuestion+"|"+publishTest+"|"+unpublishTest+"|"+getTestResult+"|"+testAlreadyAttempted+"|"+getAllReports+"|"+getTestSolution+"|"+registerUser+"|"+authenticateUser+"|"+forgotPassword+"|"+updatePassword+"|"+getCurrentPassword;
		res.send(details);

} );


var port = 443;
var server = app.listen(port, function () {

  var host = server.address().address
  var port = server.address().port

  console.log("Example app listening at http://%s:%s", host, port)

})