var testDetailsObject;
var allQuestions=[];
var no_of_ques;
var shuffle_ques;
var candidateResponse={};
candidateResponse.userDetails={};
candidateResponse.testDetails={};
candidateResponse.result=[];
var total_time;
var total_secs;
var request_from;
$('#btnProceed').on('click', function(){
	$('#divInstructions').removeClass('show');
	$('#divInstructions').addClass('hide');
	$('#divQuestions').removeClass('hide');
	$('#divQuestions').addClass('show');
	$('.question-panel-design').removeClass('hide');
	$('.question-panel-design').addClass('show');
	$('.submit-button-div').removeClass('hide');
	$('.submit-button-div').addClass('show');
	
	var testId = ((localStorage.getItem('test_id')).split('-'))[1];
	console.log("Test id: "+testId);
	
	var getTest_url = serviceIp+"/test-for-sure/test/get-testsbyId?testId="+testId;
	
	$.ajax({
                url: getTest_url,
                type: "GET",
                dataType: 'json',
                success: function (result) {
					if(result.status){
						shuffle_ques = result.testDetails.shuffleQuestions;
						$('#categoryDisplay').text(result.category+" - "+result.subcategory);
						var questionNumber = "";
						console.log(result.testDetails.no_of_ques);
						for(var i=1;i<=parseInt(result.testDetails.no_of_ques);i++){
							questionNumber += "<a href='javascript:showQuestionByNumber("+i+")'><div  id='question-"+i+"' class='test_icons unseen question_number'><span class='quesNumberText'>" + i + "</span></div></a>";
						}
						console.log(questionNumber);
						$('#questionNumber').append(questionNumber);
						
						$('#quesAttemptedCount').text(0);
						$('#quesTotalCount').text(result.testDetails.no_of_ques);
						no_of_ques = parseInt(result.testDetails.no_of_ques);
						
						var rem_secs = '0';
						var time_limit = result.testDetails.time_limit;
						total_time = result.testDetails.time_limit;
						total_secs = total_time*60;
						var percentage_per_second = 100/total_secs;
						console.log("Percentage_per_second: "+percentage_per_second);
						var percentage_remaining = 100;
						//var percentage_spent = 0 - 0.85;
						var interval = setInterval(function() {
							
							//$('#spentTime').css('width',percentage_spent+"%");
							//console.log("Time_limit_start: "+time_limit);
							//console.log("Rem_secs_start: "+rem_secs);
							var hours = 0; 
							var mins = time_limit;
							var secs = rem_secs;
							if(time_limit>=60){
								hours = parseInt(time_limit/60);
								mins = time_limit%60;
							}
							if(hours<10){
								hours = '0'+hours;
							}
							if(mins<10){
								mins = '0'+mins;
							}
							if(secs<10){
								secs = '0'+secs;
							}
							if(parseInt(time_limit) == -1){
								clearInterval(interval);
								$('#timeOverModal').modal('show');
							}
							else{
								$('#idHours').text(hours+" hrs");
								$('#idMinutes').text(mins+" mins");
								$('#idSeconds').text(secs+" secs");
								
								if(secs == '00'){
									rem_secs = 59;
									time_limit = parseInt(time_limit)-1;
								}
								else{
									rem_secs = parseInt(secs)-1;
									time_limit = parseInt(time_limit);
								}
							
							//console.log('Rem_secs: '+parseInt(rem_secs));
							//console.log('Time_limit: '+parseInt(time_limit));
							}
							if((time_limit*60)<=(time_limit*60)/3){
								$('#remainingTime').css('background-color','red');
							
							}
							percentage_remaining = percentage_remaining - percentage_per_second;
							//percentage_spent = percentage_spent + percentage_per_second;
							$('#remainingTime').css('width',percentage_remaining+"%");
						}, 1000);
						
						
						//Get questions after successfully getting test details
								var ques_id;
	var getQuestions_url = serviceIp+"/test-for-sure/test/get-questions?test_id="+testId+"&shuffle="+shuffle_ques;
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
							localStorage.setItem('testTitle', testDetailsObject.testDetails.testTitle);
							localStorage.setItem('allQuestions', JSON.stringify(allQuestions));
							ques_id = allQuestions[0].id;
							console.log(JSON.stringify(allQuestions));
							$('#displayQuestion').append(questionStructure(result.question[0].paragraph_text, result.question[0].ques_text, result.question[0].optionA, result.question[0].optionB, result.question[0].optionC, result.question[0].optionD));
							console.log("no_of_ques: "+no_of_ques);
							if(no_of_ques == 1){
								$('#btnSaveNext').attr('disabled', true);
							}
							else{
								$('#btnSaveNext').attr('disabled', false);
							}
							
							console.log("Ques_id: "+ques_id);
			var exists = false;
			
				for(var i = 0;i<(candidateResponse.result).length;i++){
					console.log("ques_id inside loop: "+ques_id);
					if(candidateResponse.result[i].question_id == ques_id){
						//question_id already exists
						candidateResponse.result[i].start_time = parseInt(total_time)*60;
						exists = true;
						break;
					}
				}
				
			
			if(!exists){
				var response = {};
				response.question_id = ques_id;
				response.start_time = parseInt(total_time)*60;
				response.end_time = 0;
				response.time_spent = 0;
				(candidateResponse.result).push(response);
			}
			console.log("Candidate Response: "+JSON.stringify(candidateResponse));
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
					}
					else if(!result.status){
						console.log("Error: "+result.message);
					}
                },
                error: function () {
					console.log("Error in getting questions");
                }
            });
			
	
			
			//get the time spent on first question, initially it will be first question, when the test starts
			//var ques_id = allQuestions[1-1].id;
			
			
})

function convertTimeToSeconds(hrs, mins, secs){
	hrs = parseInt((hrs.split(' '))[0]);
	mins = parseInt((mins.split(' '))[0]);
	secs = parseInt((secs.split(' '))[0]);
	console.log("Received: "+hrs+" : "+mins+" : "+secs);
	return secs + mins*60 + hrs*60*60;
}
function validateEmail(mail)   
{  
 if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail))  
  {  
    return true; 
  }  
   else{
    return false;
   }	
}  
$('#btnNextToInstructions').on('click', function(){
	console.log('Get User details and go next');
	var name=txtName.value;
	var email=txtEmail.value;
	console.log("Name: "+name+"----Email: "+email);
	if(name == '' || email == ''){
		$('#errorOuter').removeClass('hide');
		$('#errorOuter').addClass('show');
		$('#errorMessage').html('Please enter required details.');
		return;
	}
	if(!validateEmail(email)){
		$('#errorOuter').removeClass('hide');
		$('#errorOuter').addClass('show');
		$('#errorMessage').html('Please enter a valid e-mail address.');
		return;
	}
	localStorage.setItem('username', txtName.value);
	localStorage.setItem('email', txtEmail.value);
	localStorage.setItem('mobile', txtMobile.value);
	
	$('#divUserDetails').removeClass('show');
	$('#divUserDetails').addClass('hide');
	$('#divInstructions').removeClass('hide');
	$('#divInstructions').addClass('show');
	//$('#test-title').append(" "+ testDetailsObject.testDetails.testTitle);
		$('#time-limit').append(" "+ testDetailsObject.testDetails.time_limit);
		$('#max-marks').append(" "+ testDetailsObject.testDetails.no_of_ques*testDetailsObject.testDetails.correct_ques_marks);
		$('#total-ques').append(" "+ testDetailsObject.testDetails.no_of_ques+" Questions");
		$('#correct-ques').append(" "+ testDetailsObject.testDetails.correct_ques_marks+" marks");
		$('#negative-marks').append(" "+ testDetailsObject.testDetails.negative_marks+" marks");
		$('#time-limit-test').append(" "+ testDetailsObject.testDetails.time_limit+" minutes");
		console.log("test---------");
		
})

$('#btnViewAll').on('click', function(){
	console.log("AllQuestions:"+JSON.stringify(allQuestions));

})

function questionStructure(paraText, quesText, optionA, optionB, optionC, optionD){
	var question = "";
	question+="<span class='question-num'>Question "+localStorage.getItem('questionCount')+".</span></br>"
	if(paraText != ""){
		question += "<span class='paragraph-text'>"+(paraText.replace('<p>','')).replace('</p>','')+"</span></br>";
	}
	question += "<span class='question-text'>"+(quesText.replace('<p>','')).replace('</p>','')+"</span></br>";
	var optionsRadioButton = "<div class='funkyradio'>"+
							"<div class='funkyradio-primary'><input type='radio' id='optionsA' name='options' value='a'/><label for='optionsA'>"+(optionA.replace('<p>','')).replace('</p>','')+"</label></div>"+
							 "<div class='funkyradio-primary'><input type='radio' id='optionsB' name='options' value='b'/><label for='optionsB'>"+(optionB.replace('<p>','')).replace('</p>','')+"</label></div>"+
							 "<div class='funkyradio-primary'><input type='radio' id='optionsC' name='options' value='c'/><label for='optionsC'>"+(optionC.replace('<p>','')).replace('</p>','')+"</label></div>"+
							 "<div class='funkyradio-primary'><input type='radio' id='optionsD' name='options' value='d'/><label for='optionsD'>"+(optionD.replace('<p>','')).replace('</p>','')+"</label></div>"+
							 "</div>";
	question+=optionsRadioButton;
	return(question);
}

$('#btnClearSelection').on('click', function(){
	$('#displayQuestion input').removeAttr('checked');
	
	var response = {};
	var option_selected = null;
	console.log("option_selected: "+option_selected);
	var exist = false;
	var ques_id = allQuestions[parseInt(localStorage.getItem('questionCount'))-1].id;
	var ques_num = parseInt(localStorage.getItem('questionCount'));
	response.question_id = ques_id;
	response.marked_option = option_selected;
	response.start_time = 0;
	response.end_time = 0;
	response.time_spent = 0;
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
		var marked = candidateResponse.result[i].marked_option;
		if(marked != null){
			count++;
		}
	}
	console.log("Candidate Response: "+JSON.stringify(candidateResponse));
	console.log("Questions attempted: "+count);
	$('#quesAttemptedCount').text(count);
	$('#quesTotalCount').text(no_of_ques);
	//Change the color of the Question number accordingly
	
	var flag = false;
	for(var i = 0;i<(candidateResponse.result).length;i++){
		if(candidateResponse.result[i].question_id == ques_id && candidateResponse.result[i].marked_option != null){
			flag = true;
			break;
		}
	}
	if(flag){
		$('#question-'+ques_num).removeClass('unseen');
		$('#question-'+ques_num).removeClass('skipped');
		$('#question-'+ques_num).addClass('answered');
	}
	else{
		$('#question-'+ques_num).removeClass('answered');
		$('#question-'+ques_num).removeClass('unseen');
		$('#question-'+ques_num).addClass('skipped');
	}
})

$('#btnSaveNext').on('click', function(){
	
	var exists = false;
	var index = -1;
	//get the time spent on first question, initially it will be first question, when the test starts
			var ques_id = allQuestions[parseInt(localStorage.getItem('questionCount'))-1].id;
			console.log("Ques_id: "+ques_id);
			if(candidateResponse.result){
				for(var i = 0;i<(candidateResponse.result).length;i++){
					if(candidateResponse.result[i].question_id == ques_id){
						//question_id already exists
						exists = true;
						candidateResponse.result[i].end_time = convertTimeToSeconds($('#idHours').text(),$('#idMinutes').text(),$('#idSeconds').text())
						candidateResponse.result[i].time_spent = parseInt(candidateResponse.result[i].time_spent)+(parseInt(candidateResponse.result[i].start_time) - parseInt(candidateResponse.result[i].end_time));
						candidateResponse.result[i].end_time = 0;
						candidateResponse.result[i].start_time = 0;
						index = i;
						break;
					}
				}
			}
			if(!exists){
				var response = {};
				response.question_id = ques_id;
				response.start_time = 0;
				response.end_time = 0;
				response.time_spent = 0;
				(candidateResponse.result).push(response);
			}
	//getting the candidate's response
	
	var num;
	
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
			$('#btnSaveNext').attr('disabled', true);
		}
		else{
			$('#btnSaveNext').attr('disabled', false);
		}
		
		//Change the color of the Question number accordingly
		var ques_num = parseInt(localStorage.getItem('questionCount'))-1;
	var ques_id = allQuestions[ques_num-1].id;
	
	var flag = false;
	for(var i = 0;i<(candidateResponse.result).length;i++){
		if(candidateResponse.result[i].question_id == ques_id && candidateResponse.result[i].marked_option != null){
			flag = true;
			break;
		}
	}
	if(flag){
		$('#question-'+ques_num).removeClass('unseen');
		$('#question-'+ques_num).removeClass('skipped');
		$('#question-'+ques_num).addClass('answered');
	}
	else{
		$('#question-'+ques_num).removeClass('answered');
		$('#question-'+ques_num).removeClass('unseen');
		$('#question-'+ques_num).addClass('skipped');
	}
	
	
	exists = false;
	index = -1;
	//get the time spent on first question, initially it will be first question, when the test starts
			ques_id = allQuestions[parseInt(localStorage.getItem('questionCount'))-1].id;
			console.log("Ques_id: "+ques_id);
			if(candidateResponse.result){
				for(var i = 0;i<(candidateResponse.result).length;i++){
					if(candidateResponse.result[i].question_id == ques_id){
						//question_id already exists
						exists = true;
						candidateResponse.result[i].start_time = convertTimeToSeconds($('#idHours').text(),$('#idMinutes').text(),$('#idSeconds').text())
						index = i;
						break;
					}
				}
			}
			
			if(!exists){
				var response = {};
				response.question_id = ques_id;
				response.start_time = convertTimeToSeconds($('#idHours').text(),$('#idMinutes').text(),$('#idSeconds').text());
				response.end_time = 0;
				response.time_spent = 0;
				(candidateResponse.result).push(response);
			}
	
})
$('#btnPreviousQuestion').on('click', function(){
	
	var exists = false;
	var index = -1;
	//get the time spent on first question, initially it will be first question, when the test starts
			var ques_id = allQuestions[parseInt(localStorage.getItem('questionCount'))-1].id;
			console.log("Ques_id: "+ques_id);
			if(candidateResponse.result){
				for(var i = 0;i<(candidateResponse.result).length;i++){
					if(candidateResponse.result[i].question_id == ques_id){
						//question_id already exists
						exists = true;
						candidateResponse.result[i].end_time = convertTimeToSeconds($('#idHours').text(),$('#idMinutes').text(),$('#idSeconds').text())
						candidateResponse.result[i].time_spent = parseInt(candidateResponse.result[i].time_spent)+(parseInt(candidateResponse.result[i].start_time) - parseInt(candidateResponse.result[i].end_time));
						candidateResponse.result[i].end_time = 0;
						candidateResponse.result[i].start_time = 0;
						index = i;
						break;
					}
				}
			}
			if(!exists){
				var response = {};
				response.question_id = ques_id;
				response.start_time = 0;
				response.end_time = 0;
				response.time_spent = 0;
				(candidateResponse.result).push(response);
			}
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
		$('#btnSaveNext').attr('disabled', true);
	}
	else{
		$('#btnSaveNext').attr('disabled', false);
	}
	
	//Change the color of the Question number accordingly
	var ques_num = parseInt(localStorage.getItem('questionCount'))+1;
	var ques_id = allQuestions[ques_num-1].id;
	
	var flag = false;
	for(var i = 0;i<(candidateResponse.result).length;i++){
		if(candidateResponse.result[i].question_id == ques_id && candidateResponse.result[i].marked_option != null){
			flag = true;
			break;
		}
	}
	if(flag){
		$('#question-'+ques_num).removeClass('unseen');
		$('#question-'+ques_num).removeClass('skipped');
		$('#question-'+ques_num).addClass('answered');
	}
	else{
		$('#question-'+ques_num).removeClass('unseen');
		$('#question-'+ques_num).removeClass('answered');
		$('#question-'+ques_num).addClass('skipped');
	}
	
	exists = false;
	index = -1;
	//get the time spent on first question, initially it will be first question, when the test starts
			ques_id = allQuestions[parseInt(localStorage.getItem('questionCount'))-1].id;
			console.log("Ques_id: "+ques_id);
			if(candidateResponse.result){
				for(var i = 0;i<(candidateResponse.result).length;i++){
					if(candidateResponse.result[i].question_id == ques_id){
						//question_id already exists
						exists = true;
						candidateResponse.result[i].start_time = convertTimeToSeconds($('#idHours').text(),$('#idMinutes').text(),$('#idSeconds').text())
						index = i;
						break;
					}
				}
			}
			if(!exists){
				var response = {};
				response.question_id = ques_id;
				response.start_time = convertTimeToSeconds($('#idHours').text(),$('#idMinutes').text(),$('#idSeconds').text());
				response.end_time = 0;
				response.time_spent = 0;
				(candidateResponse.result).push(response);
			}
})

function showQuestionByNumber(num){
	var ques_num = localStorage.getItem('questionCount');
	var quesId = allQuestions[parseInt(localStorage.getItem('questionCount')-1)].id;
	console.log("ques_num: "+ques_num);
	console.log("quesId: "+quesId);
	if(ques_num == num){
		//do nothing, because we are on the same question and clicking on that questio number
	}
	else{
		var flag = false;
	for(var i = 0;i<(candidateResponse.result).length;i++){
		if(candidateResponse.result[i].question_id == quesId && candidateResponse.result[i].marked_option != null){
			flag = true;
			break;
		}
	}
	if(flag){
		$('#question-'+ques_num).removeClass('unseen');
		$('#question-'+ques_num).removeClass('skipped');
		$('#question-'+ques_num).addClass('answered');
	}
	else{
		$('#question-'+ques_num).removeClass('unseen');
		$('#question-'+ques_num).removeClass('answered');
		$('#question-'+ques_num).addClass('skipped');
	}
	}
	
	console.log("Question number clicked on: "+num);
	localStorage.setItem('questionCount', num);
	$('#displayQuestion').empty();
	//var num = parseInt(localStorage.getItem('questionCount'))-1;
	$('#displayQuestion').append(questionStructure(allQuestions[num-1].paragraph_text, allQuestions[num-1].ques_text, allQuestions[num-1].optionA, allQuestions[num-1].optionB, allQuestions[num-1].optionC, allQuestions[num-1].optionD ))
	//Selecting the already selected response
	var ques_id = allQuestions[num-1].id;
	for(var i = 0;i<candidateResponse.result.length;i++){
		if(candidateResponse.result[i].question_id == ques_id){
			console.log('Inside matched question_id');
			$('input[value="'+candidateResponse.result[i].marked_option+'"]').prop("checked", true);
			break;
		}
	}
	
	if((num)>1){
		$('#btnPreviousQuestion').attr('disabled', false);
	}
	else{
		$('#btnPreviousQuestion').attr('disabled', true);
	}
	if((num) == no_of_ques){
		$('#btnSaveNext').attr('disabled', true);
	}
	else{
		$('#btnSaveNext').attr('disabled', false);
	}
}

//On ticking any radio button
$('#displayQuestion').on('click', 'input[name=options]:radio', function(){
	console.log("Clicked radio");
	var response = {};
	var option_selected = $(this).val();
	var exist = false;
	var ques_num = parseInt(localStorage.getItem('questionCount'));
	var ques_id = allQuestions[parseInt(localStorage.getItem('questionCount'))-1].id;
	response.question_id = ques_id;
	response.marked_option = option_selected;
	response.start_time = 0;
	response.end_time = 0;
	response.time_spent = 0;
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
		var marked = candidateResponse.result[i].marked_option;
		if(marked != null){
			count++;
		}
	}
	console.log("Candidate Response: "+JSON.stringify(candidateResponse));
	console.log("Questions attempted: "+count);
	$('#quesAttemptedCount').text(count);
	$('#quesTotalCount').text(no_of_ques);
	
	//Change the color of the Question number accordingly
	var flag = false;
	for(var i = 0;i<(candidateResponse.result).length;i++){
		if(candidateResponse.result[i].question_id == ques_id && candidateResponse.result[i].marked_option != null){
			flag = true;
			break;
		}
	}
	if(flag){
		$('#question-'+ques_num).removeClass('unseen');
		$('#question-'+ques_num).removeClass('skipped');
		$('#question-'+ques_num).addClass('answered');
	}
	else{
		$('#question-'+ques_num).removeClass('answered');
		$('#question-'+ques_num).addClass('skipped');
	}
	
	
})

//On click of Mark for review
$('#btnMarkForReview').on('click', function(){
	console.log("Clicked marke for reviw");
	var response = {};
	var exist = false;
	var ques_num = parseInt(localStorage.getItem('questionCount'));
	var ques_id = allQuestions[parseInt(localStorage.getItem('questionCount'))-1].id;
	
	
	console.log("Candidate Response: "+JSON.stringify(candidateResponse));
	
	//Change the color of the Question number accordingly
	var flag = false;
	for(var i = 0;i<(candidateResponse.result).length;i++){
		if(candidateResponse.result[i].question_id == ques_id && candidateResponse.result[i].marked_option != null){
			flag = true;
			break;
		}
	}
	if(flag){
		//means the question is answered and clicked on marked for review
		$('#question-'+ques_num).removeClass('unseen');
		$('#question-'+ques_num).addClass('answered');
		$('#question-'+ques_num).removeClass('marked');
		$('#question-'+ques_num).removeClass('skipped');
		$('#question-'+ques_num).addClass('marked');
	}
	else{
		//means the question is not yet answered but clicked for review
		$('#question-'+ques_num).removeClass('unseen');
		$('#question-'+ques_num).removeClass('answered');
		$('#question-'+ques_num).removeClass('skipped');
		$('#question-'+ques_num).addClass('marked');
	}
})

//On click of Unmark for review
$('#btnUnmarkForReview').on('click', function(){
	console.log("Clicked unmark for reviw");
	var response = {};
	var exist = false;
	var ques_num = parseInt(localStorage.getItem('questionCount'));
	var ques_id = allQuestions[parseInt(localStorage.getItem('questionCount'))-1].id;
	
	
	console.log("Candidate Response: "+JSON.stringify(candidateResponse));
	
	//Change the color of the Question number accordingly
	var flag = false;
	for(var i = 0;i<(candidateResponse.result).length;i++){
		if(candidateResponse.result[i].question_id == ques_id && candidateResponse.result[i].marked_option != null){
			flag = true;
			break;
		}
	}
	if(flag){
		//means the question is answered and clicked on marked for review
		$('#question-'+ques_num).removeClass('unseen');
		$('#question-'+ques_num).addClass('answered');
		$('#question-'+ques_num).removeClass('marked');
		$('#question-'+ques_num).removeClass('skipped');
		//$('#question-'+ques_num).addClass('marked');
	}
	else{
		//means the question is not yet answered but clicked for review
		$('#question-'+ques_num).removeClass('unseen');
		$('#question-'+ques_num).removeClass('answered');
		$('#question-'+ques_num).removeClass('marked');
		$('#question-'+ques_num).addClass('skipped');
		
	}
})

//Function to find the time spent on each question
function getTimeEachQuestion(){
	
}
$('#btnSubmitYes').on('click', function(){
	var reportdata={"test":"123"};
	var count = 0;
	for(var i = 0;i<(candidateResponse.result).length;i++){
		var marked = candidateResponse.result[i].marked_option;
		if(marked != null){
			count++;
		}
	}
	var ques_id = allQuestions[parseInt(localStorage.getItem('questionCount'))-1].id;
			console.log("Ques_id: "+ques_id);
			if(candidateResponse.result){
				for(var i = 0;i<(candidateResponse.result).length;i++){
					if(candidateResponse.result[i].question_id == ques_id){
						//question_id already exists
						exists = true;
						candidateResponse.result[i].end_time = convertTimeToSeconds($('#idHours').text(),$('#idMinutes').text(),$('#idSeconds').text())
						candidateResponse.result[i].time_spent = parseInt(candidateResponse.result[i].time_spent)+(parseInt(candidateResponse.result[i].start_time) - parseInt(candidateResponse.result[i].end_time));
						candidateResponse.result[i].end_time = 0;
						candidateResponse.result[i].start_time = 0;
						index = i;
						break;
					}
				}
			}
	var user={};
	user.username = localStorage.getItem('username');
	user.email = localStorage.getItem('email');
	user.mobile = localStorage.getItem('mobile');
	candidateResponse.userDetails = user;
	
	var time_hours = $('#idHours').text();
	var time_minutes = $('#idMinutes').text();
	var time_seconds = $('#idSeconds').text();
	
	console.log("Time_remaining: "+time_hours+time_minutes+time_seconds);
	//1.9666666666666668
	var minutes_rem = (parseInt(time_hours.substring(0,2))*60 + parseInt(time_minutes.substring(0,2)) + parseInt(time_seconds.substring(0,2))/60);
	console.log("Minutes remaining: "+minutes_rem);
	//00 hrs01 mins57 secs
	candidateResponse.time_rem = minutes_rem;
	localStorage.setItem('candidate-response', JSON.stringify(candidateResponse));
	window.location.href="test-report.html?total="+no_of_ques+"&attempted="+count;
					
})

$('#btnTimeOverOk').on('click', function(){
	var reportdata={"test":"123"};
	var count = 0;
	for(var i = 0;i<(candidateResponse.result).length;i++){
		var marked = candidateResponse.result[i].marked_option;
		if(marked != null){
			count++;
		}
	}
	var ques_id = allQuestions[parseInt(localStorage.getItem('questionCount'))-1].id;
			console.log("Ques_id: "+ques_id);
			if(candidateResponse.result){
				for(var i = 0;i<(candidateResponse.result).length;i++){
					if(candidateResponse.result[i].question_id == ques_id){
						//question_id already exists
						exists = true;
						candidateResponse.result[i].end_time = convertTimeToSeconds($('#idHours').text(),$('#idMinutes').text(),$('#idSeconds').text())
						candidateResponse.result[i].time_spent = parseInt(candidateResponse.result[i].time_spent)+(parseInt(candidateResponse.result[i].start_time) - parseInt(candidateResponse.result[i].end_time));
						candidateResponse.result[i].end_time = 0;
						candidateResponse.result[i].start_time = 0;
						index = i;
						break;
					}
				}
			}
	var user={};
	user.username = localStorage.getItem('username');
	user.email = localStorage.getItem('email');
	user.mobile = localStorage.getItem('mobile');
	candidateResponse.userDetails = user;
	var time_hours = $('#idHours').text();
	var time_minutes = $('#idMinutes').text();
	var time_seconds = $('#idSeconds').text();
	
	console.log("Time_remaining: "+time_hours+time_minutes+time_seconds);
	//1.9666666666666668
	var minutes_rem = (parseInt(time_hours.substring(0,2))*60 + parseInt(time_minutes.substring(0,2)) + parseInt(time_seconds.substring(0,2))/60);
	console.log("Minutes remaining: "+minutes_rem);
	//00 hrs01 mins57 secs
	candidateResponse.time_rem = minutes_rem;
	localStorage.setItem('candidate-response', JSON.stringify(candidateResponse));
	window.location.href="test-report.html?total="+no_of_ques+"&attempted="+count;				
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
function noBack() {
    window.history.forward();
}
$(document).ready(function () {
	//localStorage.clear();
	//to prevent the right click on test screen
	document.addEventListener('contextmenu', event => event.preventDefault());
	// To disable f5
    /* jQuery < 1.7 */
	$(document).bind("keydown", disableF5);
	/* OR jQuery >= 1.7 */
	$(document).on("keydown", disableF5);
	
	//To ask the user, when he/she attempts to refresh the page
	/*window.onbeforeunload = function(){
		return "Are you sure you want to leave this page?";
	}*/
	console.log("Document start-test is ready");
	var test_id = getQueryParameterByName('test_id');
	request_from = getQueryParameterByName('from');
	localStorage.setItem('test_id', test_id);
	localStorage.setItem('questionCount', 1);
	console.log("Test id: "+test_id);
	candidateResponse.testDetails.test_id = (test_id.split('-'))[1];
	var testDetails = localStorage.getItem('testDetails');
	testDetailsObject = JSON.parse(testDetails);
	console.log("Test Details: "+JSON.stringify(testDetailsObject));
	$('#titleHead').append(testDetailsObject.testDetails.testTitle);
	console.log("Request_from: "+request_from);
	if(request_from === "login" || request_from === "register"){
		$('#divUserDetails').removeClass('show');
		$('#divUserDetails').addClass('hide');
		$('#divInstructions').removeClass('hide');
		$('#divInstructions').addClass('show');
		$('#time-limit').append(" "+ testDetailsObject.testDetails.time_limit);
		$('#max-marks').append(" "+ testDetailsObject.testDetails.no_of_ques*testDetailsObject.testDetails.correct_ques_marks);
		$('#total-ques').append(" "+ testDetailsObject.testDetails.no_of_ques+" Questions");
		$('#correct-ques').append(" "+ testDetailsObject.testDetails.correct_ques_marks+" marks");
		$('#negative-marks').append(" "+ testDetailsObject.testDetails.negative_marks+" marks");
		$('#time-limit-test').append(" "+ testDetailsObject.testDetails.time_limit+" minutes");
	}
})

	
	
// slight update to account for browsers not supporting e.which
function disableF5(e) { if ((e.which || e.keyCode) == 116) e.preventDefault(); };