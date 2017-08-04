var report = {};
//On click of generate report button
$('#btnGenerateReport').on('click', function(){
	console.log("Generating Test Report");
	$('#testSummary').removeClass('show');
	$('#testSummary').addClass('hide');
	$('#testReportGeneral').removeClass('hide');
	$('#testReportGeneral').addClass('show');
	
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
					$('#idQuesAttempted').text(result.ques_attempted);
					$('#idTime').text(result.time_taken);
					$('#idAccuracy').text(findAccuracy(result.correct_ques, result.ques_attempted)+"%");
					$('#idPercentile').text(findPercentile(result.rank, result.total_candidate));
					
					$('#idCorrect').text(result.correct_ques);
					$('#idIncorrect').text(result.incorrect_ques);
					$('#idNotattempted').text(result.total_ques-result.ques_attempted);
					var questionsCanvas = document.getElementById("questionsPieChart");
					questionsCanvas.width = 300;
					questionsCanvas.height = 300;
 
					var questionsChart = {
						"Correct Questions": result.correct_ques,
						"Incorrect Questions": result.incorrect_ques,
						"Unattempted Questions": (result.total_ques-result.ques_attempted)
					};
					var quesPiechart = new Piechart({
						canvas:questionsCanvas,
						data:questionsChart,
						colors:["green","red", "yellow"]
					});
					quesPiechart.draw();
					
                },
                error: function () {
					console.log("Error in getting questions");
                }
            });
})

function findAccuracy(correct, attempted){
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

//Draws pie chart (general function)
var Piechart = function(options){
    this.options = options;
    this.canvas = options.canvas;
    this.ctx = this.canvas.getContext("2d");
    this.colors = options.colors;
 
    this.draw = function(){
        var total_value = 0;
        var color_index = 0;
        for (var categ in this.options.data){
            var val = this.options.data[categ];
            total_value += val;
        }
 
        var start_angle = 0;
        for (categ in this.options.data){
            val = this.options.data[categ];
            var slice_angle = 2 * Math.PI * val / total_value;
 
            drawPieSlice(
                this.ctx,
                this.canvas.width/2,
                this.canvas.height/2,
                Math.min(this.canvas.width/2,this.canvas.height/2),
                start_angle,
                start_angle+slice_angle,
                this.colors[color_index%this.colors.length]
            );
 
            start_angle += slice_angle;
            color_index++;
        }
 
    }
}
function drawQuestionsPieChart(){
	var questionsPieChart = document.getElementById("questionsPieChart");
	questionsPieChart.width = 300;
	questionsPieChart.height = 300;
 
	var ctx = questionsPieChart.getContext("2d");
	//Angle in radians
	var anglePerQues = (Math.PI/180)*(360/(report.total_ques));
	console.log("Angle per question: "+anglePerQues);
	var correctAngle = (report.correct_ques)*anglePerQues;
	var incorrectAngle = (report.incorrect_ques)*anglePerQues;
	var unattemptedAngle = (report.total_ques-report.ques_attempted)*anglePerQues;
	var startAngle = 0;
	console.log("COrrect Angle: "+correctAngle);
	console.log("Incorrect Angle: "+incorrectAngle);
	console.log("Unattempted Angle: "+unattemptedAngle);
	drawPieSlice(ctx, 150,150, 100, startAngle, startAngle+correctAngle, 'green');
	startAngle+=correctAngle;
	drawPieSlice(ctx, 150,150, 100, startAngle, startAngle+incorrectAngle, 'red');
	//drawPieSlice(ctx, 150,150, 100, incorrectAngle, unattemptedAngle, 'yellow');
}
function drawPieSlice(ctx,centerX, centerY, radius, startAngle, endAngle, color ){
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(centerX,centerY);
    ctx.arc(centerX, centerY, radius, startAngle, endAngle);
    ctx.closePath();
    ctx.fill();
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

