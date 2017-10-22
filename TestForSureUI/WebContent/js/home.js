
//Show tests on home.html load
function showTests(categoryId, subCatId){
	$('#tests_home').empty();
	console.log("Category id: "+categoryId);
	console.log("Subcategory id: "+subCatId);
	var url = "http://localhost:8083/test-for-sure/test/get-tests-bystatus?categoryId="+categoryId+"&subCatId="+subCatId;
	$.ajax({
                url: url,
                type: "GET",
                
                dataType: 'json',
                success: function (result) {
					if(result.status){
						if(result.testDetails != null) {
							console.log(JSON.stringify(result.testDetails));
							$.each(result.testDetails, function(i, test) {
								var btnId = 'btnTest-'+test.id;
								var query_string = 'test_id='+btnId;
								console.log("Image Path: "+test.imagePath);
								var image_path = "'"+test.imagePath+"'";
								
												
								var newTest = "<div class='outer-test-div'>"+
												"<div class='col-md-3 float-left'>"+
												"<img class='test-image' src="+image_path+"/>"+
												"</br><h5 class='test-title'>"+test.testTitle+"</h5>"+
												"</div>"+
												"<div class='col-md-1.5 float-left max-marks'>"+
												"<span>Maximum Marks"+
												"</span></br>"+
												"<span class='max_marks_value'>"+test.no_of_ques*test.correct_ques_marks+
												"</span>"+
												"</div>"+
												"<div class='col-md-2.75 float-left margin-top-30 margin-left-10 div-width'>"+
												"<span class='glyphicon glyphicon-th-list'></span><label class='clear-both test-size'>&nbsp;Number of Questions: </label><span class='test-size'>"+test.no_of_ques+"</span>"+
												"</br><span class='glyphicon glyphicon-time'></span><label  class='clear-both test-size'>&nbsp;Time Limit(in mins): </label><span class='test-size'>"+test.time_limit+"</span>"+
												"</div>"+
												"<div class='col-md-2.75 float-left margin-top-30 div-width'>"+
												"<span class='glyphicon glyphicon-ok-sign'></span><label  class='clear-both test-size'>&nbsp;Correct Ques Marks: </label><span class='test-size'>"+test.correct_ques_marks+"</span>"+
												"</br><span class='glyphicon glyphicon-minus-sign'></span><label  class='clear-both test-size'>&nbsp;Negative marks: </label><span class='test-size'>"+test.negative_marks+"</span>"+
												"</div>"+
												"<div class='col-md-2 float-left margin-top-40'><a id="+btnId+" onclick='checkAlreadyAttempted(id)' href='javascript:void(0);' class='btn btn-default btn-block btn-primary'>TAKE TEST</a></div>"
												//href='start-test-option.html?"+query_string+"'
												"</div>";
								$('#tests_home').append(newTest);
							});
							
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
		var url ='http://localhost:8083/test-for-sure/test/test-already-attempted?test_id='+test_id+'&email_id='+emailid;
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
		var getAllNews_url = "http://localhost:8083/test-for-sure/news-notifications/get-all-news";
        $.ajax({
            url: getAllNews_url,
            type: type,
			contentType: 'application/json',
			success: function (result) {
                if (result.response.status) {
					console.log("Got News successfully: "+JSON.stringify(result));
					
					for(var i=0;i<(result.news).length;i++){
						var news = newsStructure((result.news)[i].id, (result.news)[i].headline);
						$('#news').append(news);
					}
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
	var structure = "<div style='margin-top:20px;margin-left:20px;'><span style='display:inline-block;' class='glyphicon glyphicon-menu-right'></span>"
					+"<a  style='display:inline-block;' target='_blank' id='news-"+id+"' href='news-detail.html?id="+id+"'>"+headline+"</a></div>";
	return structure;
}
$(document).ready(function () {
	console.log("Document is ready");
	getExistingNews();

	//localStorage.clear();
	
	console.log("Logged in: "+localStorage.getItem('loggedIn'));
	if(localStorage.getItem('loggedIn') == "true"){
		//means the user is logged in
		$('#loggedInUSer').text(" "+localStorage.getItem('username'));
		$('#menuLogin').addClass('hide');
		$('#menuLogin').removeClass('show');
		$('#menuLogout').removeClass('hide');
		$('#menuLogout').addClass('show');
	}
	else{
		$('#menuLogin').removeClass('hide');
		$('#menuLogin').addClass('show');
		$('#menuLogout').addClass('hide');
		$('#menuLogout').removeClass('show');
	}
	//Initially, on page load show all the tests(Select in category and subcategory has value 0)
	showTests(0, 0);
	
})

