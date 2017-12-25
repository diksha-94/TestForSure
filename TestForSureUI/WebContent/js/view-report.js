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

//To download the full list of test performers
function downloadFullList(){
	    var pdf = new jsPDF('p', 'pt', 'letter');
        // source can be HTML-formatted string, or a reference
        // to an actual DOM element from which the text will be scraped.
        source = $('#topPerformersFullList').html();

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
                pdf.save('top-performers.pdf');
            }, margins
        );
    }


function topPerformerStructure(rank, name, score, imageName){
	var structure = "<tr id='rank-"+rank+"'>"+
					"<td class='col-md-2.5'>"+rank;
					
	if(imageName != ''){
		structure += "<img src='../img/Medals/"+imageName+"'/>";
	}
					
					structure += "</td>"+
					"<td class='col-md-7'>"+name+"</td>"+
					"<td class='col-md-2.5'>"+score+"</td>";
					
	return structure;
}
function topPerformerFullStructure(rank, name, score, totalMarks){
	var structure = "<div id='rankFull-"+rank+"'><span>Rank "+rank+"(  "+name+")  Score:"+score+"/"+totalMarks+"</span></div></br>";
	return structure;
}
 
$('#btnSolution').on('click', function(){
	$('#testReportGeneral').removeClass('show');
	$('#testReportGeneral').addClass('hide');
	$('#testReportDetail').removeClass('show');
	$('#testReportDetail').addClass('hide');
	
	$('#questionsChart').removeClass('show');
	$('#questionsChart').addClass('hide');
	$('#timeChart').removeClass('show');
	$('#timeChart').addClass('hide');
	$('#testSolution').removeClass('hide');
	$('#testSolution').addClass('show');
	
	$('#btnAnalysis').attr('disabled', false);
	$('#btnSolution').attr('disabled', true);
})

$('#btnAnalysis').on('click', function(){
	$('#testReportGeneral').removeClass('hide');
	$('#testReportGeneral').addClass('show');
	$('#testReportDetail').removeClass('hide');
	$('#testReportDetail').addClass('show');
	$('#questionsChart').removeClass('hide');
	$('#questionsChart').addClass('show');
	$('#timeChart').removeClass('hide');
	$('#timeChart').addClass('show');
	$('#testSolution').removeClass('show');
	$('#testSolution').addClass('hide');
	
	$('#btnAnalysis').attr('disabled', true);
	$('#btnSolution').attr('disabled', false);
})

function questionSolutionStructure(questions){
	var count = 1;
	$.each(questions, function(key, value){
		var question = "<div><span class='ques-count'> Question "+count+"</span>&nbsp;&nbsp;<span class='ques-status' id='questionStatus-"+value.quesId+"'></span></br>";//<span class='time-spent' id='timeSpent-"+value.id+"'></span>
		if(value.questionType == "Paragraph"){
			question += "<span class='para'>Paragraph: </span><span class='para-text'> "+(value.paragraphText.replace('<p>','')).replace('</p>','')+"</span></br>";
		}
		question += "<div class='ques'><span>"+(value.questionText.replace('<p>','')).replace('</p>','')+"</span></div>"+
					"<div class='options' id='div-a-"+value.quesId+"'><span id='option-a-"+value.quesId+"'>a. "+(value.optionA.replace('<p>','')).replace('</p>','')+"</span></div>"+
					"<div class='options' id='div-b-"+value.quesId+"'><span id='option-b-"+value.quesId+"'>b. "+(value.optionB.replace('<p>','')).replace('</p>','')+"</span></div>"+
					"<div class='options' id='div-c-"+value.quesId+"'><span id='option-c-"+value.quesId+"'>c. "+(value.optionC.replace('<p>','')).replace('</p>','')+"</span></div>"+
					"<div class='options' id='div-d-"+value.quesId+"'><span id='option-d-"+value.quesId+"'>d. "+(value.optionD.replace('<p>','')).replace('</p>','')+"</span></div>"+
					"<div class='exp-btn'><button type='button' id='btnExplanation-"+value.quesId+"' class='btn' onclick='openExplanation(this.id);'>Show Explanation</button></div>"+
					"<div id='explanation-"+value.quesId+"' class='hide explanation'>"+value.explanation+"</div></div>"+
					"<hr>";
		$('#testSolution').append(question);
		//option id of marked_option, if both marked and correct option is same-> then mark the correct/marked as green
		//and question as correct
		//else, mark the marked option as red and correct as green and ques as incorrect
		//if marked_option is null, mark the correct as green and question as unattempted
		var markedOptionId;
		if(value.markedOption != null){
			markedOptionId = 'div-'+value.markedOption+"-"+value.quesId;
		}
		var correctOptionId = 'div-'+value.correctOption+"-"+value.quesId;
				
		console.log("markedOptionId: "+markedOptionId);
		console.log("correctOptionId: "+correctOptionId);
		var idFormed = 'questionStatus-'+value.quesId;
		console.log("idFormed: "+idFormed);
		if(value.markedOption == null){
			console.log("Inside null");
			$('#'+idFormed).text("You didn't attempt this question.");
			$('#'+idFormed).css('color', 'orange');
			console.log("correctOptionId: "+correctOptionId);
				
			$('#'+correctOptionId).css('background-color', '#A4CC8C');
		}
		else if(value.markedOption == value.correctOption){
			$('#'+idFormed).text("Correct answer !!");
			$('#'+idFormed).css('color', 'green');
			$('#'+correctOptionId).css('background-color', '#A4CC8C');
		}
		else if(value.markedOption != value.correctOption){
			$('#'+idFormed).text("You got this Question wrong");
			$('#'+idFormed).css('color', 'red');
			$('#'+correctOptionId).css('background-color', '#A4CC8C');
			$('#'+markedOptionId).css('background-color', '#EA8080');
		}
		var idTimeSpent = 'timeSpent-'+value.quesId;
		$('#'+idTimeSpent).text(value.timeSpent+" secs");
			count++;
		});
		
		
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


function draw3DPieChart(correctQues, totalQues, incorrectQues, quesAttempted){
	console.log("Inside drawing pie chart for questions");
	var correctAngle = ((correctQues)*100)/totalQues;
	var incorrectAngle = ((incorrectQues)*100)/totalQues;
	var unattemptedAngle = ((totalQues-quesAttempted)*100)/totalQues;
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
		 
function draw3DPieChartTime(correctTime, incorrectTime, unattemptedTime, totalTimeTaken){
	
	var correctAngle = ((correctTime)*100)/totalTimeTaken;
	var incorrectAngle = ((incorrectTime)*100)/totalTimeTaken;
	var unattemptedAngle = ((unattemptedTime)*100)/totalTimeTaken;
	var chart = {      
               type: 'pie',     
               options3d: {
                  enabled: true,
                  alpha: 45,
                  beta: 0
               }
            };
            var title = {
               text: 'Time'   
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
            $('#timePieChart').highcharts(json);
         }
function getReport(report_id, test_id){
	var url = serviceIp+"/test-for-sure/view-report/get-report?report_id="+report_id+"&test_id="+test_id;
	$.ajax({
                url: url,
                type: "GET",
                dataType: 'json',
				contentType: "application/json",
                success: function (result) {
					if(result.status == true){
						$('#idUsername').text(result.details.username);
						$('#idYourRank').text(result.details.rank);
						$('#idTotalCandidate').text(result.details.totalCandidates);
						$('#idScore').text(result.details.marksScored+" / "+result.details.totalMarks);
						$('#idQuesAttempted').text(result.details.questionsAttempted+" / "+result.details.totalQuestions);
						var time = (result.details.timeTaken).toFixed(2);
						var hrs = 0;
						var mins = 0;
						var secs = 0;
						if(time>=60){
							hrs = time/60;
							time = time%60;
						}
						var mins = ((time.toString()).split("."))[0];
						var secs = parseFloat("0."+((time.toString()).split("."))[1])*60;
						secs = Math.round(secs);
						console.log("Time taken: "+hrs+" hours   "+mins+" mins   "+Math.round(secs)+" secs"); 
						if(hrs>0){
							$('#idHrs').text(hrs+"h "+mins+"m "+secs+"s");
						}
						else if(mins>0){
							$('#idHrs').text(mins+"m "+secs+"s");
						}
						else if(secs>0){
							$('#idHrs').text(secs+"s");
						}
						$('#idAccuracy').text(findAccuracy(result.details.correctQues, result.details.questionsAttempted)+"%");
						$('#idPercentile').text(findPercentile(result.details.rank, result.details.totalCandidates));
					
						$('#idCorrect').text(result.details.correctQues+"Qs");
						$('#idIncorrect').text(result.details.incorrectQues+"Qs");
						$('#idNotattempted').text((result.details.totalQuestions-result.details.questionsAttempted)+"Qs");
						
						$('#idTopperScore').text(result.details.toppersScore+"/"+result.details.totalMarks);
						var timeTop = (result.details.toppersTime).toFixed(2);
						var hrsTop = 0;
						var minsTop = 0;
						var secsTop = 0;
						if(timeTop>=60){
							hrsTop = timeTop/60;
							timeTop = timeTop%60;
						}
						var minsTop = ((timeTop.toString()).split("."))[0];
						var secsTop = parseFloat("0."+((timeTop.toString()).split("."))[1])*60;
						console.log("Time taken: "+hrsTop+" hours   "+minsTop+" mins   "+Math.round(secsTop)+" secs"); 
						secsTop = Math.round(secsTop);
						if(hrsTop>0){
							$('#idTopperTime').text(hrsTop+"h "+minsTop+"m "+secsTop+"s");
						}
						else if(minsTop>0){
							$('#idTopperTime').text(minsTop+"m "+secsTop+"s");
						}
						else if(secsTop>0){
							$('#idTopperTime').text(secsTop+"s");
						}
						$('#idAvgScore').text(result.details.avgScore+"/"+result.details.totalMarks);
						
						var timeAvg = (result.details.avgTime).toFixed(2);
						var hrsAvg = 0;
						var minsAvg = 0;
						var secsAvg = 0;
						if(timeAvg>=60){
							hrsAvg = timeAvg/60;
							timeAvg = timeAvg%60;
						}	
						var minsAvg = ((timeAvg.toString()).split("."))[0];
						var secsAvg = parseFloat("0."+((timeAvg.toString()).split("."))[1])*60;
						console.log("Time taken: "+hrsAvg+" hours   "+minsAvg+" mins   "+Math.round(secsAvg)+" secs"); 
						secsAvg = Math.round(secsAvg);
						if(hrsAvg>0){
							$('#idAvgTime').text(hrsAvg+"h "+minsAvg+"m "+secsAvg+"s");
						}
						else if(minsAvg>0){
							$('#idAvgTime').text(minsAvg+"m "+secsAvg+"s");
						}
						else if(secsAvg>0){
							$('#idAvgTime').text(secsAvg+"s");
						}
						
					$('#totalMarksInTable').append('['+result.details.totalMarks+']');
					var totalRecordsToDisplay;
					var lengthTopPerformers = result.topPerformers.length;
					if(lengthTopPerformers>=10){
						totalRecordsToDisplay = 10;
					}
					else if(lengthTopPerformers<10){
						totalRecordsToDisplay = lengthTopPerformers
					}
					for(var i=0;i<totalRecordsToDisplay;i++){
						var imageName='';
						if(i==0){
							//Rank-1
							imageName = 'gold_rank1_new.png';
						}
						else if(i==1){
							//Rank-2
							imageName = 'silver_rank2_new.png'
						}
						else if(i==2){
							//Rank-3
							imageName = 'bronze_rank3_new.png'
						}
						$('#topPerformersTableBody').append(topPerformerStructure(result.topPerformers[i].rank, result.topPerformers[i].name, result.topPerformers[i].marks_scored, imageName));
						if(i+1 == result.details.rank){
							$('#rank-'+result.topPerformers[i].rank).addClass('font-bold');
						}
					}
					if(result.details.rank>10){
						imageName='';
						var j = result.details.rank-1;
						$('#topPerformersTableBody').append(topPerformerStructure(result.topPerformers[j].rank, result.topPerformers[j].name, result.topPerformers[j].marks_scored, ''));
						$('#rank-'+result.topPerformers[j].rank).addClass('font-bold');
					}
					$('#topPerformers').append("<button type='button' id='downloadTopPerformers' class='btn btn-primary' onclick='downloadFullList();'>Download full list</button>");
						
					//div to be downloaded when clicked on Download topPerformers full list
					for(var i=0;i<result.topPerformers.length;i++){
						$('#topPerformersFullList').append(topPerformerFullStructure(result.topPerformers[i].rank, result.topPerformers[i].name, result.topPerformers[i].marks_scored, result.details.totalMarks));
						if(i+1 == result.details.rank){
							$('#rankFull-'+result.topPerformers[i].rank).addClass('font-bold');
						}
					}
					questionSolutionStructure(result.questions);
					draw3DPieChart(result.details.correctQues,result.details.totalQuestions, result.details.incorrectQues, result.details.questionsAttempted);
					
					//Code to draw the pie chart for time taken(for correct, incorrect and unattempted questions)
					var correctTime = 0;
					var incorrectTime = 0;
					var unattemptedTime = 0;
					for(var i=0;i<(result.questions).length;i++){
						if(result.questions[i].markedOption == null){
							unattemptedTime+=result.questions[i].timeSpent;
						}
						else if(result.questions[i].correctOption == result.questions[i].markedOption){
							correctTime+=result.questions[i].timeSpent;
						}
						else if(result.questions[i].correctOption != result.questions[i].markedOption){
							incorrectTime+=result.questions[i].timeSpent;
						}
					}
					var totalTimeTaken = correctTime+incorrectTime+unattemptedTime;
					$('#idCorrectTime').text(correctTime+"secs");
					$('#idIncorrectTime').text(incorrectTime+"secs");
					$('#idNotattemptedTime').text(unattemptedTime+"secs");
					draw3DPieChartTime(correctTime, incorrectTime, unattemptedTime, totalTimeTaken);
					
						
					}
					else{
						console.log("Error in viewing report");
					}
					
					
                },
                error: function () {
					console.log("Error in getting questions");
                }
            });
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
	var report_id = getQueryParameterByName('report_id');
	var test_id = getQueryParameterByName('test_id');
	console.log("Received report_id: "+report_id);
	console.log("Received test_id: "+test_id);
	getReport(report_id, test_id);
	
})

