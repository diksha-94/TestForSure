var test_id;
var emailId;
var testReports;
$(document).ready(function () {
	test_id = getQueryParameterByName('test_id');
	emailId = localStorage.getItem('email');
	console.log("Test_id: "+test_id);
	console.log("emailId: "+emailId);
	
	var id = (test_id.split('-'))[1];
	var getReport_url = serviceIp+"/test-for-sure/test/get-all-reports?test_id="+id+"&email_id="+emailId;
	
	$.ajax({
                url: getReport_url,
                type: "GET",
                dataType: 'json',
                success: function (result) {
					if(result.status){
						console.log(JSON.stringify(result));
						for(var i = 0;i<(result.testReports).length;i++){
							buttonStructure((result.testReports)[i].id, i+1, (result.testReports)[i].last_updated_on);
						}
						testReports = result.testReports;
					}
					else if(!result.status){
						console.log("Error: "+result.message);
					}
                },
                error: function () {
					console.log("Error in getting test reports");
                }
            });
	setInterval(function(){
		$('#hand-down').css('margin-top','10px');
	},200);
	setInterval(function(){
		$('#hand-down').css('margin-top','0px');
	},380);
	
	if(localStorage.getItem('loggedIn') == "true"){
		//means the user is logged in
		$('#loggedInUSer').text(" "+localStorage.getItem('username'));
		$('#menuLogin').addClass('hide');
		$('#menuLogin').removeClass('show');
		$('#menuLogout').removeClass('hide');
		$('#menuLogout').addClass('show');
		$('#userProfile').removeClass('hide');
		$('#userProfile').addClass('show');
	}
	else{
		$('#menuLogin').removeClass('hide');
		$('#menuLogin').addClass('show');
		$('#menuLogout').addClass('hide');
		$('#menuLogout').removeClass('show');
		$('#userProfile').addClass('hide');
		$('#userProfile').removeClass('show');
	}
	
})

function buttonStructure(id, index, last_updated_on)
{
	var testId = (test_id.split("-"))[1];
	var buttonStructure = "<button style='margin-top:10px;' type='submit' id='btnViewReport-"+id+"-"+testId+"' class='btn btn-primary' onclick='generateReport(id);'>View Report (Attempted on "+last_updated_on+")</button></br>";
	$('#btnsViewReport').append(buttonStructure);
}

function generateReport(id){
	
	/* for(var i=0;i<testReports.length;i++){
		console.log("Inside for");
		if(testReports[i].id == (id.split('-'))[1]){
			localStorage.setItem('testReport', JSON.stringify(testReports[i]));
		}
	} */
	var report_id = (id.split("-"))[1];
	var currentTestId = (id.split("-"))[2];
	window.location.href = 'view-report.html?report_id='+report_id+'&test_id='+currentTestId;
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
$('#btnTakeTestAgain').on('click', function(e){
	
	
	var id = (test_id.split('-'))[1];
	console.log("Id: "+id);
	var getTest_url = serviceIp+"/test-for-sure/test/get-testsbyId?testId="+id;
	console.log("getTest_url: "+getTest_url);
	$.ajax({
                url: getTest_url,
                type: "GET",
                dataType: 'json',
                success: function (result) {
					if(result.status){
						console.log(JSON.stringify(result));
						localStorage.setItem('testDetails',JSON.stringify(result));
						//window.open("start-test.html?from=login&test_id="+test_id, "myWindow", "status=1,toolbar=0,width=1000,height=1000");
						e.preventDefault();
						
						//window.open("start-test.html?from=login&test_id="+test_id, "myWindow", "status=1,toolbar=0,width=1000,height=1000");
						//window.open("start-test.html?from=login&test_id="+test_id, 'myWindow', "status=1,toolbar=0,width=1000,height=1000");
						window.location.href = "start-test.html?from=login&test_id="+test_id;
					}
					else if(!result.status){
						console.log("Error: "+result.message);
					}
                },
                error: function () {
					console.log("Error in getting questions");
                }
            });
	//window.history.back();
   
})


