
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
								/*var newTest = "<div class='test-style margin-top-30'>"+
												"<img class='test-image' src="+image_path+"/>"+
												"</br><h3>"+test.testTitle+"</h3>"+
												"<label class='test-size'>Number of Questions: </label><span class='test-size'>"+test.no_of_ques+"</span>"+
												"</br><label class='test-size'>Time Limit(in mins): </label><span class='test-size'>"+test.time_limit+"</span>"+
												"</br><label class='test-size'>Correct Question Marks: </label><span class='test-size'>"+test.correct_ques_marks+"</span>"+
												"</br><label class='test-size'>Negative marks: </label><span class='test-size'>"+test.negative_marks+"</span>"+
												"</br></br><div class='div-inside-div'><a href='start-test-option.html?"+query_string+"' id="+btnId+" class='btn btn-default btn-block btn-success'>Start Test</a></div>"
												"</div>";*/

								/*if((i+1)%4 != 0){
									newTest += "</div><div class='empty-div margin-top-30'>"+
											  "</div>";
								}*/
								
								/*var newTest = "<div class='outer-test-div'>"+
												"<div class='div-width float-left'>"+
												"<img align='center' class='test-image' src="+image_path+"/>"+
												"</br><h3 class='test-title'>"+test.testTitle+"</h3>"+
												"</div>"+
												"<div class='other-div-width float-left'>"+
												"test"+
												"</div>"+
												"<div class='float-left margin-top-30 margin-left-30 div-width'>"+
												"<label class='clear-both test-size'>Number of Questions: </label><span class='test-size'>"+test.no_of_ques+"</span>"+
												"</br><label  class='clear-both test-size'>Time Limit(in mins): </label><span class='test-size'>"+test.time_limit+"</span>"+
												"</div>"+
												"<div class='float-left margin-top-30 margin-left-30 div-width'>"+
												"<label  class='clear-both test-size'>Correct Question Marks: </label><span class='test-size'>"+test.correct_ques_marks+"</span>"+
												"</br><label  class='clear-both test-size'>Negative marks: </label><span class='test-size'>"+test.negative_marks+"</span>"+
												"</div>"+
												"<div class='float-left margin-left-50 margin-top-40'><a href='start-test-option.html?"+query_string+"' id="+btnId+" class='btn btn-default btn-block btn-primary'>TAKE TEST</a></div>"
												"</div>";*/
												
								var newTest = "<div class='outer-test-div'>"+
												"<div class='col-md-3 float-left'>"+
												"<img class='test-image' src="+image_path+"/>"+
												"</br><h3 class='test-title'>"+test.testTitle+"</h3>"+
												"</div>"+
												"<div class='col-md-1.5 float-left max-marks'>"+
												"<span>Maximum Marks"+
												"</span></br>"+
												"<span>"+test.no_of_ques*test.correct_ques_marks+
												"</span>"+
												"</div>"+
												"<div class='col-md-2.75 float-left margin-top-30 margin-left-10 div-width'>"+
												"<label class='clear-both test-size'>Number of Questions: </label><span class='test-size'>"+test.no_of_ques+"</span>"+
												"</br><label  class='clear-both test-size'>Time Limit(in mins): </label><span class='test-size'>"+test.time_limit+"</span>"+
												"</div>"+
												"<div class='col-md-2.75 float-left margin-top-30 div-width'>"+
												"<label  class='clear-both test-size'>Correct Question Marks: </label><span class='test-size'>"+test.correct_ques_marks+"</span>"+
												"</br><label  class='clear-both test-size'>Negative marks: </label><span class='test-size'>"+test.negative_marks+"</span>"+
												"</div>"+
												"<div class='col-md-2 float-left margin-top-40'><a href='start-test-option.html?"+query_string+"' id="+btnId+" class='btn btn-default btn-block btn-primary'>TAKE TEST</a></div>"
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

$('#linkLogout').on('click', function(){
	localStorage.clear();
	window.location.href = 'home.html';
})
$(document).ready(function () {
	console.log("Document is ready");

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

