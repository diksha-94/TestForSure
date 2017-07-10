$('#btnProceed').on('click', function(){
	$('#divInstructions').removeClass('show');
	$('#divInstructions').addClass('hide');
	$('#divQuestions').removeClass('hide');
	$('#divQuestions').addClass('show');
	var testId = ((localStorage.getItem('test_id')).split('-'))[1];
	console.log("Test id: "+testId);
	var url = "http://localhost:8083/test-for-sure/test/get-questions?test_id="+testId;
	$.ajax({
                url: url,
                type: "GET",
                dataType: 'json',
                success: function (result) {
					if(result.status){
						if(result.question != null) {
							console.log(JSON.stringify(result.question));
							$.each(result.question, function(i, question) {
								//var btnId = 'btnTest-'+test.id;
								//var query_string = 'test_id='+btnId;
								var newQuestion = "<div style='border:solid 1px red;'>"+
												"</br>Question Id: "+question.id+
												"</br>Question Type: "+question.ques_type;
								if((question.ques_type).toLowerCase() == "paragraph"){
									newQuestion += "</br>Paragraph text: "+question.paragraph_text;
								}
												newQuestion += "</br>Question Text: "+question.ques_text+
												"</br>a. "+question.optionA+
												"</br>b. "+question.optionB+
												"</br>c. "+question.optionC+
												"</br>d. "+question.optionD+
												"</div>";
								$('#divQuestions').append(newQuestion);
							});
							
						}
					}
					else if(!result.status){
						console.log("Error: "+result.message);
					}
                },
                error: function () {
					console.log("Error in getting questions");
                }
            });
})

function getQueryParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

$(document).ready(function () {
	console.log("Document start-test is ready");
	var test_id = getQueryParameterByName('test_id');
	localStorage.setItem('test_id', test_id);
	console.log("Test id: "+test_id);
	
	
})

