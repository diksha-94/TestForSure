
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
								var newTest = "<div style='border:solid 1px red;float:left;width:33%;text-align:center'>"+
												"</br>Test Id: "+test.id+
												"</br>Test title: "+test.testTitle+
												"</br>Number of Questions: "+test.no_of_ques+
												"</br>Time Limit(in mins): "+test.time_limit+
												"</br>Correct Question Marks: "+test.correct_ques_marks+
												"</br>Negative marks: "+test.negative_marks+
												"</br><a href='start-test-option.html?"+query_string+"' id="+btnId+" class='btn btn-default'>Start Test</a>"
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

