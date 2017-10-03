var report = {};
var allQuestions = [];

//To download the test report
$('#downloadReport').on('click', function(){
        var pdf = new jsPDF('p', 'pt', 'letter');
        // source can be HTML-formatted string, or a reference
        // to an actual DOM element from which the text will be scraped.
        source = $('#candidateReport').html();

        // we support special element handlers. Register them with jQuery-style 
        // ID selector for either ID or node name. ("#iAmID", "div", "span" etc.)
        // There is no support for any other type of selectors 
        // (class, of compound) at this time.
        /*specialElementHandlers = {
            // element with id of "bypass" - jQuery style selector
            '#bypassme': function (element, renderer) {
                // true = "handled elsewhere, bypass text extraction"
                return true
            }
        };*/
        margins = {
            top: 80,
            bottom: 60,
            left: 10,
            width: 10
        };
        // all coords and widths are in jsPDF instance's declared units
        // 'inches' in this case
        pdf.fromHTML(
            source, // HTML string or DOM elem ref.
            margins.left, // x coord
            margins.top, { // y coord
                //'width': margins.width // max width of content on PDF
                //'elementHandlers': specialElementHandlers
            },

            function (dispose) {
                // dispose: object with X, Y of the last line add to the PDF 
                //          this allow the insertion of new lines after html
                pdf.save('Test.pdf');
            }, margins
        );
    })


//On click of generate report button
$('#btnGenerateReport').on('click', function(){
	console.log("Generating Test Report");
	$('#testSummary').removeClass('show');
	$('#testSummary').addClass('hide');
	$('#testReportGeneral').removeClass('hide');
	$('#testReportGeneral').addClass('show');

	$('#buttons').removeClass('hide');
	$('#buttons').addClass('show');
	console.log("Candidate-response: "+localStorage.getItem('candidate-response'));
	var generateReport_url = "http://localhost:8083/test-for-sure/test/get-test-result";
	$.ajax({
                url: generateReport_url,
                type: "POST",
                dataType: 'json',
				data: localStorage.getItem('candidate-response'),
				contentType: "application/json",
                success: function (result) {
					report = result;
					console.log("Test Report: "+JSON.stringify(result));
					$('#idUsername').text(result.username);
					$('#idYourRank').text(result.rank);
					$('#idTotalCandidate').text(result.total_candidate);
					$('#idScore').text(result.marks_scored+" / "+result.total_marks);
					$('#idQuesAttempted').text(result.ques_attempted+" / "+result.total_ques);
					$('#idTime').text(result.time_taken);
					$('#idAccuracy').text(findAccuracy(result.correct_ques, result.ques_attempted)+"%");
					$('#idPercentile').text(findPercentile(result.rank, result.total_candidate));
					
					//Time taken
					//$('#')
					
					$('#idCorrect').text(result.correct_ques);
					$('#idIncorrect').text(result.incorrect_ques);
					$('#idNotattempted').text(result.total_ques-result.ques_attempted);
					
					$('#idTopperScore').text(result.topperScore);
					$('#idTopperTime').text(result.topperTime);
					$('#idAvgScore').text(result.avgScore);
					$('#idAvgTime').text(result.avgTime);
					$.each(result.topPerformers, function(key, value){
						$('#topPerformers').append(topPerformerStructure(value.rank, value.name, value.marks_scored));
					})
					questionSolutionStructure();
					draw3DPieChart();
					
                },
                error: function () {
					console.log("Error in getting questions");
                }
            });
})
function topPerformerStructure(rank, name, score){
	var structure = "<span>Rank "+rank+"  "+name+"  Score:"+score+"/"+report.total_marks+"</span></br>";
	return structure;
}
 
$('#btnSolution').on('click', function(){
	$('#testReportGeneral').removeClass('show');
	$('#testReportGeneral').addClass('hide');
	$('#testSolution').removeClass('hide');
	$('#testSolution').addClass('show');
	
	$('#btnAnalysis').attr('disabled', false);
	$('#btnSolution').attr('disabled', true);
})

$('#btnAnalysis').on('click', function(){
	$('#testReportGeneral').removeClass('hide');
	$('#testReportGeneral').addClass('show');
	$('#testSolution').removeClass('show');
	$('#testSolution').addClass('hide');
	
	$('#btnAnalysis').attr('disabled', true);
	$('#btnSolution').attr('disabled', false);
})

function questionSolutionStructure(){
	var count = 1;
	$.each(allQuestions, function(key, value){
		var question = "<div><span class='ques-count'> Question "+count+"</span>&nbsp;&nbsp;<span class='ques-status' id='questionStatus-"+value.id+"'></span></br>";//<span class='time-spent' id='timeSpent-"+value.id+"'></span>
		if(value.ques_type == "Paragraph"){
			question += "<span class='para'>Paragraph: </span><span class='para-text'> "+value.paragraph_text+"</span></br>";
		}
		question += "<div class='ques'><span>"+value.ques_text+"</span></div>"+
					"<div class='options' id='div-a-"+value.id+"'><span id='option-a-"+value.id+"'>a. "+value.optionA+"</span></div>"+
					"<div class='options' id='div-b-"+value.id+"'><span id='option-b-"+value.id+"'>b. "+value.optionB+"</span></div>"+
					"<div class='options' id='div-c-"+value.id+"'><span id='option-c-"+value.id+"'>c. "+value.optionC+"</span></div>"+
					"<div class='options' id='div-d-"+value.id+"'><span id='option-d-"+value.id+"'>d. "+value.optionD+"</span></div>"+
					"<div class='exp-btn'><button type='button' id='btnExplanation-"+value.id+"' class='btn' onclick='openExplanation(this.id);'>Show Explanation</button></div>"+
					"<div id='explanation-"+value.id+"' class='hide explanation'>"+value.explanation+"</div></div>"+
					"<hr>";
		$('#testSolution').append(question);
		$.each(report.question_details, function(key1, value1){
			if(value1.ques_id == value.id){
				//option id of marked_option, if both marked and correct option is same-> then mark the correct/marked as green
				//and question as correct
				//else, mark the marked option as red and correct as green and ques as incorrect
				//if marked_option is null, mark the correct as green and question as unattempted
				var markedOptionId;
				if(value1.marked_option != null){
					markedOptionId = 'div-'+value1.marked_option+"-"+value.id;
				}
				var correctOptionId = 'div-'+value1.correct_option+"-"+value.id;
				
				console.log("markedOptionId: "+markedOptionId);
				console.log("correctOptionId: "+correctOptionId);
				var idFormed = 'questionStatus-'+value.id;
				console.log("idFormed: "+idFormed);
				if(value1.marked_option == null){
					console.log("Inside null");
					$('#'+idFormed).text("You didn't attempt this question.");
					$('#'+idFormed).css('color', 'orange');
					console.log("correctOptionId: "+correctOptionId);
				
					$('#'+correctOptionId).css('background-color', '#DFF0D8');
				}
				else if(value1.marked_option == value1.correct_option){
					$('#'+idFormed).text("Correct answer !!");
					$('#'+idFormed).css('color', 'green');
					$('#'+correctOptionId).css('background-color', '#DFF0D8');
				}
				else if(value1.marked_option != value1.correct_option){
					$('#'+idFormed).text("You got this Question wrong");
					$('#'+idFormed).css('color', 'red');
					$('#'+correctOptionId).css('background-color', '#DFF0D8');
					$('#'+markedOptionId).css('background-color', '#F2DEDE');
				}
				var idTimeSpent = 'timeSpent-'+value.id;
				$('#'+idTimeSpent).text(value1.time_spent+" secs");
				return false;
			}
		})
		count++;
	})
}

function openExplanation(id){
	console.log("Explanation button id: "+id);
	var buttonText = $("#"+id).text();
	var ques_id = (id.split("-"))[1];
	if(buttonText == "Show Explanation"){
		$('#explanation-'+ques_id).removeClass('hide');
		$('#explanation-'+ques_id).addClass('show');
		$("#"+id).text("Hide Explanation");
	}
	else if(buttonText == "Hide Explanation"){
		$('#explanation-'+ques_id).removeClass('show');
		$('#explanation-'+ques_id).addClass('hide');
		$("#"+id).text("Show Explanation");
	}
}
function findAccuracy(correct, attempted){
	if(attempted == 0){
		return 0;
	}
	var accuracy = ((correct*100)/attempted);
	accuracy = accuracy.toFixed(2);
	return accuracy;
}

function findPercentile(rank, total_candidate){
	if(rank == 1){
		return 100;
	}
	var temp = ((rank*100)/total_candidate);
	temp = 100-temp;
	temp = temp.toFixed(2);
	return temp;
}


function draw3DPieChart(){
	
	var correctAngle = ((report.correct_ques)*100)/report.total_ques;
	var incorrectAngle = ((report.incorrect_ques)*100)/report.total_ques;
	var unattemptedAngle = ((report.total_ques-report.ques_attempted)*100)/report.total_ques;
	var chart = {      
               type: 'pie',     
               options3d: {
                  enabled: true,
                  alpha: 45,
                  beta: 0
               }
            };
            var title = {
               text: 'Questions'   
            };   
            var tooltip = {
               pointFormat: '<b>{point.percentage:.1f}%</b>'
            };
            var plotOptions = {
               pie: {
                  cursor: 'pointer',
                  depth: 35,
                  
                  dataLabels: {
                     enabled: true,
                     format: '{point.name}'
                  }
               }
            };   
            var series = [{
               type: 'pie',
               data: [
                  ['Correct',   correctAngle],
                  ['Incorrect',  incorrectAngle],
                  ['Unattempted',   unattemptedAngle]
               ]
            }];     
            var json = {};   
            json.chart = chart; 
            json.title = title;       
            json.tooltip = tooltip; 
            json.plotOptions = plotOptions; 
            json.series = series;   
            $('#questionsPieChart').highcharts(json);
         }

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
	var questions = localStorage.getItem('allQuestions');
	allQuestions = JSON.parse(questions);
	console.log("Document test-report is ready: "+questions);
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

