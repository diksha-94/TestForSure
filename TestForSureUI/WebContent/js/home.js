var attemptedTests = {};

//Show tests on home.html load
function showTests(categoryId, subCatId){
	console.log("Attempted Tests from Show tests: "+JSON.stringify(attemptedTests));
	//create an array of all the test_id of attempted tests
	var testIds = [];
	if(attemptedTests && attemptedTests.length>0){
		for(var i=0;i<attemptedTests.length;i++){
			testIds.push(attemptedTests[i].test_id);
		}
	}
	$('#all_tests').empty();
	console.log("Category id: "+categoryId);
	console.log("Subcategory id: "+subCatId);
	var url = serviceIp+"/test-for-sure/test/get-tests-bystatus?categoryId="+categoryId+"&subCatId="+subCatId;
	$.ajax({
                url: url,
                type: "GET",
                
                dataType: 'json',
                success: function (result) {
					if(result.status){
						if(result.testDetails != null) {
							console.log(JSON.stringify(result.testDetails));
							console.log("Number of tests: "+(result.testDetails).length);
							var number = (result.testDetails).length;
							var testToDisplay = 0;
							
							if(number<10){
								testToDisplay = number;
							}
							else{
								number = 10;
							}
							
							for(var i = 0;i<number;i++){
							//$.each(result.testDetails, function(i, test) {
								var btnId = 'btnTest-'+(result.testDetails)[i].id;
								var divId = 'markAttempted-'+(result.testDetails)[i].id;
								var query_string = 'test_id='+btnId;
								console.log("Image Path: "+(result.testDetails)[i].imagePath);
								var image_path = "'"+(result.testDetails)[i].imagePath+"'";
								
												
								var newTest = "<div class='outer-test-div'>"+
												"<div class='col-md-3 float-left'>"+
												"<img class='test-image' src="+image_path+"/>"+
												"</br><h3 class='test-title'>"+(result.testDetails)[i].testTitle+"</h3>"+
												"</div>"+
												"<div class='col-md-1.5 float-left max-marks'>"+
												"<span>Maximum Marks"+
												"</span></br>"+
												"<span class='max_marks_value'>"+(result.testDetails)[i].no_of_ques*(result.testDetails)[i].correct_ques_marks+
												"</span>"+
												"</div>"+
												"<div class='col-md-2.75 float-left margin-top-30 margin-left-10 div-width'>"+
												"<span class='glyphicon glyphicon-th-list'></span><label class='clear-both test-size'>&nbsp;No. of Questions: </label><span class='test-size'>"+(result.testDetails)[i].no_of_ques+"</span>"+
												"</br><span class='glyphicon glyphicon-time'></span><label  class='clear-both test-size'>&nbsp;Time Limit(in mins): </label><span class='test-size'>"+(result.testDetails)[i].time_limit+"</span>"+
												"</div>"+
												"<div class='col-md-2.75 float-left margin-top-30 div-width'>"+
												"<span class='glyphicon glyphicon-ok-sign'></span><label  class='clear-both test-size'>&nbsp;Correct Ques Marks: </label><span class='test-size'>"+(result.testDetails)[i].correct_ques_marks+"</span>"+
												"</br><span class='glyphicon glyphicon-minus-sign'></span><label  class='clear-both test-size'>&nbsp;Negative marks: </label><span class='test-size'>"+(result.testDetails)[i].negative_marks+"</span>"+
												"</div>"+
												"<div class='col-md-2 col-xs-10 col-xs-offset-1 col-md-offset-0 float-left margin-top-40 take-test-button'><a id="+btnId+" onclick='checkAlreadyAttempted(id)' href='javascript:void(0);' class='btn btn-default btn-block btn-primary'>TAKE TEST</a></div>"+
												"<div id="+divId+" class='glyphicon glyphicon-ok markAttempted' title='attempted'></div>"
												//href='start-test-option.html?"+query_string+"'
												"</div>";
								
								$('#all_tests').append(newTest);
								 if(!testIds.includes((result.testDetails)[i].id)){
									//Means this test is already attempted by the user, so mark it
									$('#markAttempted-'+(result.testDetails)[i].id).addClass('hide');
									//$('#markAttempted-'+(result.testDetails)[i].id).addClass('show');
								}
								if(i == 6){
									var ad = "<div class='outer-test-ad'>"+
											"<ins class='adsbygoogle' style='display:block;width:100%;' data-ad-format='fluid' data-ad-layout-key='-fm+5r+6l-ft+4e' data-ad-client='ca-pub-1988549768988881' data-ad-slot='9540632733'></ins>"+
											"<script>"+
											"(adsbygoogle = window.adsbygoogle || []).push({});"+
											"</script>"+
											"</div>";
											$('#all_tests').append(ad);
								}
							}
							
						}
					}
					else if(!result.status){
						console.log("Error: "+result.message);
					}
                },
                error: function () {
					console.log("Error in getting test details");
                }
            });
}

//Check if the test is already attempted or not
function checkAlreadyAttempted(id){
	console.log("Take test id: "+id);
	var query_string = 'test_id='+id;
	var test_id = ((id).split('-'))[1];
	
	var loggedIn = localStorage.getItem("loggedIn");
	if(loggedIn){
		var emailid = localStorage.getItem('email');
		console.log("Email id: "+emailid);
		var type='GET';
		var url =serviceIp+'/test-for-sure/test/test-already-attempted?test_id='+test_id+'&email_id='+emailid;
		$.ajax({
            url: url,
            type: type,
			contentType: 'application/json',
			//dataType: 'json',
            success: function (result) {
                if (result.status) {
					//Status true means user is authenticated successfully.
					console.log("Result: "+JSON.stringify(result));
					window.location.href = "start-test-already-attempted.html?test_id="+id;
			    }
                else if (!result.status) {
					console.log("Result: "+JSON.stringify(result));
					window.location.href="start-test-option.html?"+query_string;
                }
                
            },
            error: function () {
                console.log("Service is unavailable");
            }
           
		});
	}
	else{
		//User not logged in
		window.location.href="start-test-option.html?"+query_string;
	}
}

$('#linkLogout').on('click', function(){
	localStorage.clear();
	window.location.href = 'home.html';
})
function getExistingNews(){
	var type='GET';
		//var getAllNews_url = sessionStorage.getItem('PROTOCOL')+"://"+sessionStorage.getItem('SERVICES_IP')+":"+sessionStorage.getItem('SUBDOMAINSERVICES_HOST')+"/test-for-sure/news-notifications/get-all-news";
		var getAllNews_url = serviceIp+"/test-for-sure/news-notifications/get-news-bySatatus?newsStatus="+true;
        $.ajax({
            url: getAllNews_url,
            type: type,
			contentType: 'application/json',
			success: function (result) {
                if (result.response.status) {
					console.log("Got News successfully: "+JSON.stringify(result));
					var len = (result.news).length;
					if(len>5){
						len = 5;
					}
					for(var i=0;i<len;i++){
						var news = newsStructure((result.news)[i].id, (result.news)[i].headline);
						$('#news').append(news);
					}
					var moreLink = "<a href='News.html' class='more-link'>More...</a>";
					$('#news').append(moreLink);
				}
                else if (!result.response.status) {
					console.log("Error in getting News");
                }
                
            },
            error: function () {
                console.log("Service is unavailable");
            }
           
        });
}

function newsStructure(id, headline){
	var structure = "<div style='margin-top:20px;margin-left:20px;'><span style='display:inline;' class='glyphicon glyphicon-menu-right'></span>"
					+"<a style='display:inline;' class='news-link' target='_blank' id='news-"+id+"' href='news-detail.html?id="+id+"' onmouseout='linkWhiteColor();'>"+headline+"</a></div>";
	return structure;
}
function linkWhiteColor(){
	$('.news-link').css('color','white');
}
function populateSlider() {
    imageSlider.reload();
}
$(document).ready(function () {
	console.log("Document is ready");
	
	
	console.log("Logged in: "+localStorage.getItem('loggedIn'));
	if(localStorage.getItem('loggedIn') == "true"){
		//means the user is logged in
		$('#loggedInUSer').text(" "+localStorage.getItem('username'));
		$('#menuLogin').addClass('hide');
		$('#menuLogin').removeClass('show');
		$('#menuLogout').removeClass('hide');
		$('#menuLogout').addClass('show');
		$('#userProfile').removeClass('hide');
		$('#userProfile').addClass('show');
		//get the attempted tests and mark them
		console.log("Email: "+localStorage.getItem('email'));
		getAttemptedTests(localStorage.getItem('email'));
	}
	else{
		$('#menuLogin').removeClass('hide');
		$('#menuLogin').addClass('show');
		$('#menuLogout').addClass('hide');
		$('#menuLogout').removeClass('show');
		$('#userProfile').addClass('hide');
		$('#userProfile').removeClass('show');
		showTests(0, 0);
	}
	
	getExistingNews();
	
	
	populateSlider();
								
})


function getAttemptedTests(email){
	var getTests_url = serviceIp+"/test-for-sure/view-report/get-attempted-tests?emailId="+email;
	$.ajax({
            url: getTests_url,
            type: "GET",
			contentType: 'application/json',
			success: function (result) {
				console.log("Response: "+JSON.stringify(result));
                if (result.response.status) {
					console.log("Length: "+result.attemptedTests.length);
					attemptedTests = result.attemptedTests;
					showTests(0, 0);
				}
                else if (!result.response.status) {
					console.log(result.response.message);
					attemptedTests = result.attemptedTests;
					showTests(0, 0);
                }
                
            },
            error: function () {
                console.log("Service is unavailable");
            }
           
        });
}