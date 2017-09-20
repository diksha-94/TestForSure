
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
								var newTest = "<div class='test-style margin-top-30'>"+
												"</br><h3>"+test.testTitle+"</h3>"+
												"<label class='test-size'>Number of Questions: </label><span class='test-size'>"+test.no_of_ques+"</span>"+
												"</br><label class='test-size'>Time Limit(in mins): </label><span class='test-size'>"+test.time_limit+"</span>"+
												"</br><label class='test-size'>Correct Question Marks: </label><span class='test-size'>"+test.correct_ques_marks+"</span>"+
												"</br><label class='test-size'>Negative marks: </label><span class='test-size'>"+test.negative_marks+"</span>"+
												"</br></br><div class='div-inside-div'><a href='start-test-option.html?"+query_string+"' id="+btnId+" class='btn btn-default btn-block btn-success'>Start Test</a></div>"
												"</div>";

								if((i+1)%4 != 0){
									newTest += "</div><div class='empty-div margin-top-30'>"+
											  "</div>";
								}
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

