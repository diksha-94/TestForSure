var allQuestions=[];
var no_of_ques;
var candidateResponse={};
candidateResponse.testDetails={};
candidateResponse.result=[];
$('#btnProceed').on('click', function(){
	$('#divInstructions').removeClass('show');
	$('#divInstructions').addClass('hide');
	$('#divQuestions').removeClass('hide');
	$('#divQuestions').addClass('show');
	var testId = ((localStorage.getItem('test_id')).split('-'))[1];
	console.log("Test id: "+testId);
	
	var getTest_url = "http://localhost:8083/test-for-sure/test/get-testsbyId?testId="+testId;
	
	$.ajax({
                url: getTest_url,
                type: "GET",
                dataType: 'json',
                success: function (result) {
					if(result.status){
						$('#categoryDisplay').text(result.category+" - "+result.subcategory);
						var questionNumber = "";
						console.log(result.testDetails.no_of_ques);
						for(var i=1;i<=parseInt(result.testDetails.no_of_ques);i++){
							questionNumber += "<a href='#'><div style='float:left;border:solid 1px black;width:20%'>" + i + "</div></a>";
						}
						console.log(questionNumber);
						$('#questionNumber').append(questionNumber);
						
						$('#quesAttemptedCount').text('0/'+result.testDetails.no_of_ques);
						no_of_ques = parseInt(result.testDetails.no_of_ques);
					}
					else if(!result.status){
						console.log("Error: "+result.message);
					}
                },
                error: function () {
					console.log("Error in getting questions");
                }
            });
			
			
	var getQuestions_url = "http://localhost:8083/test-for-sure/test/get-questions?test_id="+testId;
	$.ajax({
                url: getQuestions_url,
                type: "GET",
                dataType: 'json',
                success: function (result) {
					if(result.status){
						if(result.question != null) {
							//console.log(JSON.stringify(result.question));
							$.each(result.question, function(i, question) {
								allQuestions.push(question);
							});
							console.log(JSON.stringify(allQuestions));
							$('#displayQuestion').append(questionStructure(result.question[0].paragraph_text, result.question[0].ques_text, result.question[0].optionA, result.question[0].optionB, result.question[0].optionC, result.question[0].optionD));
							console.log("no_of_ques: "+no_of_ques);
							if(no_of_ques == 1){
								$('#btnSaveNext').html('Save');
							}
							else{
								$('#btnSaveNext').html('Save & Next');
							}
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

$('#btnViewAll').on('click', function(){
	console.log("AllQuestions:"+JSON.stringify(allQuestions));

})

function questionStructure(paraText, quesText, optionA, optionB, optionC, optionD){
	var question = "";
	question+="<span>Question "+localStorage.getItem('questionCount')+".</span>"
	if(paraText != ""){
		question += "<span>"+paraText+"</span>";
	}
	question += "<span>"+quesText+"</span>";
	var optionsRadioButton = "<input type='radio' id='optionsA' name='options' value='a' text='"+optionA+"'>"+optionA+"</input>"+
							 "<input type='radio' id='optionsB' name='options' value='b' text='"+optionB+"'>"+optionB+"</input>"+
							 "<input type='radio' id='optionsC' name='options' value='c' text='"+optionC+"'>"+optionC+"</input>"+
							 "<input type='radio' id='optionsD' name='options' value='d' text='"+optionD+"'>"+optionD+"</input>";
	
	question+=optionsRadioButton;
	return(question);
}

$('#btnClearSelection').on('click', function(){
	$('#displayQuestion input').removeAttr('checked');
})

$('#btnSaveNext').on('click', function(){
	
	
	//getting the candidate's response
	var response = {};
	var exist = false;
	var ques_id = allQuestions[parseInt(localStorage.getItem('questionCount'))-1].id;
	var option_selected = $('input[name=options]:checked').val();
	response.question_id = ques_id;
	response.marked_option = option_selected;
	for(var i = 0;i<(candidateResponse.result).length;i++){
		if(candidateResponse.result[i].question_id == ques_id){
			candidateResponse.result[i].marked_option = option_selected;
			exist=true;
			break;
		}
	}
	if(!exist){
		(candidateResponse.result).push(response);
	}
	//Count number of questions attempted
	var count = 0;
	for(var i = 0;i<(candidateResponse.result).length;i++){
		if(candidateResponse.result[i].marked_option){
			count++;
		}
	}
	console.log("Candidate Response: "+JSON.stringify(candidateResponse));
	console.log($('#btnSaveNext').html());
	console.log("Questions attempted: "+count);
	$('#quesAttemptedCount').text(count+'/'+no_of_ques);
	var num;
	
	if($('#btnSaveNext').html() == 'Save &amp; Next'){
		localStorage.setItem('questionCount', parseInt(localStorage.getItem('questionCount'))+1);
		num = parseInt(localStorage.getItem('questionCount'))-1;
		$('#displayQuestion').empty();
		$('#displayQuestion').append(questionStructure(allQuestions[num].paragraph_text, allQuestions[num].ques_text, allQuestions[num].optionA, allQuestions[num].optionB, allQuestions[num].optionC, allQuestions[num].optionD ))
		//Selecting the already selected response
		var ques_id = allQuestions[num].id;
		for(var i = 0;i<candidateResponse.result.length;i++){
			if(candidateResponse.result[i].question_id == ques_id){
				$('input[value="'+candidateResponse.result[i].marked_option+'"]').prop("checked", true);
				break;
			}
		}
		if((num+1)>1){
			$('#btnPreviousQuestion').attr('disabled', false);
		}
		else{
			$('#btnPreviousQuestion').attr('disabled', true);
		}
		if((num+1) == no_of_ques){
			$('#btnSaveNext').html('Save');
		}
		else{
			$('#btnSaveNext').html('Save & Next');
		}
	}
})
$('#btnPreviousQuestion').on('click', function(){
	localStorage.setItem('questionCount', parseInt(localStorage.getItem('questionCount'))-1);
	$('#displayQuestion').empty();
	var num = parseInt(localStorage.getItem('questionCount'))-1;
	$('#displayQuestion').append(questionStructure(allQuestions[num].paragraph_text, allQuestions[num].ques_text, allQuestions[num].optionA, allQuestions[num].optionB, allQuestions[num].optionC, allQuestions[num].optionD ))
	//Selecting the already selected response
	var ques_id = allQuestions[num].id;
	for(var i = 0;i<candidateResponse.result.length;i++){
		if(candidateResponse.result[i].question_id == ques_id){
			console.log('Inside matched question_id');
			$('input[value="'+candidateResponse.result[i].marked_option+'"]').prop("checked", true);
			break;
		}
	}
	
	if((num+1)>1){
		$('#btnPreviousQuestion').attr('disabled', false);
	}
	else{
		$('#btnPreviousQuestion').attr('disabled', true);
	}
	if((num+1) == no_of_ques){
		$('#btnSaveNext').html('Save');
	}
	else{
		$('#btnSaveNext').html('Save & Next');
	}
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
	localStorage.setItem('questionCount', 1);
	console.log("Test id: "+test_id);
	candidateResponse.testDetails.test_id = (test_id.split('-'))[1];
	
	
})

