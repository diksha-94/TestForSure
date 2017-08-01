//On click of generate report button
$('#btnGenerateReport').on('click', function(){
	console.log("Generating Test Report");
	$('#testSummary').removeClass('show');
	$('#testSummary').addClass('hide');
	$('#testReport').removeClass('hide');
	$('#testReport').addClass('show');
	
	var generateReport_url = "http://localhost:8083/test-for-sure/test/get-test-result";
	$.ajax({
                url: generateReport_url,
                type: "POST",
                dataType: 'json',
				data: localStorage.getItem('candidate-response'),
				contentType: "application/json",
                success: function (result) {
					console.log("Test Report: "+JSON.stringify(result));
					$('#idTestId').text(result.test_id);
					$('#idTotalQues').text(result.total_ques);
					$('#idAttemptedQues').text(result.ques_attempted);
					$('#idCorrect').text(result.correct_ques);
					$('#idIncorrect').text(result.incorrect_ques);
					$('#idMarksScored').text(result.marks_scored+"/"+result.total_marks);
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
	console.log("Document test-report is ready");
	var total = getQueryParameterByName('total');
	console.log("Total: "+total);
	var attempted = getQueryParameterByName('attempted');
	console.log("Attempted: "+attempted);
	$('#idTotal').text(total);
	$('#idAttempted').text(attempted);
	$('#idUnattempted').text(parseInt(total)-parseInt(attempted));
	
	var candidateResponse = localStorage.getItem('candidate-response');
	console.log("Candidate Response: "+candidateResponse);
})

