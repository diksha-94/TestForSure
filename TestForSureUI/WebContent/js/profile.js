var email;
var username;
var mobile;
$('#btnChangePassword').on('click', function(){
	$('#updatePasswordError').removeClass("show");
	$('#updatePasswordError').addClass("hide");		
	$('#txtPasswordReg').val('');
	$('#txtConfirmPassword').val('');
	$('#txtPasswordOld').val('');	
	$('#userProfileDiv').removeClass('show');
	$('#userProfileDiv').addClass('hide');
	$('#passwordReset').removeClass('hide');
	$('#passwordReset').addClass('show');
})

$('#btnBackToProfile').on('click', function(){
	$('#userProfileDiv').removeClass('hide');
	$('#userProfileDiv').addClass('show');
	$('#passwordReset').removeClass('show');
	$('#passwordReset').addClass('hide');
	$('#editProfile').removeClass('show');
	$('#editProfile').addClass('hide');
})
$('#btnBackToProfile1').on('click', function(){
	$('#userProfileDiv').removeClass('hide');
	$('#userProfileDiv').addClass('show');
	$('#passwordReset').removeClass('show');
	$('#passwordReset').addClass('hide');
	$('#editProfile').removeClass('show');
	$('#editProfile').addClass('hide');
})
$('#btnEditProfile').on('click', function(){
	$('#editProfileError').removeClass("show");
	$('#editProfileError').addClass("hide");
	$('#userProfileDiv').removeClass('show');
	$('#userProfileDiv').addClass('hide');
	$('#editProfile').removeClass('hide');
	$('#editProfile').addClass('show');
	populateValues();
})
function populateValues(){
	$('#txtName').val(username);
	$('#txtEmail').val(email);
	$('#txtContactNumber').val(mobile);
}
var resetPasswordRules = {
	'txtPasswordNameOld': {
		required: true,
		minlength: 6        
    },
    'txtPasswordNameReg': {
		required: true,
		minlength: 6        
    },
	'txtConfirmNameReg': {
		required: true,
		minlength: 6,
		equalTo: "#txtPasswordReg",
    }
};
	
$('#resetPassword').validate({
    rules: resetPasswordRules,

    ignore: false,
    highlight: function () {
        // to remove the red alert on text 
    },
    submitHandler: function () {
		console.log("Inside submit");
		var change_password_url = serviceIp+"/test-for-sure/user/change-password";
		var type = "PUT";
        var oldPassword = $('#txtPasswordOld').val();
        var newPassword = $('#txtPasswordReg').val();
		
		var requestData = {};
		requestData.emailId = email;
		requestData.oldPassword = oldPassword;
		requestData.newPassword = newPassword;
	   
		console.log(JSON.stringify(requestData));
		
        $.ajax({
            url: change_password_url,
            type: type,
			data: JSON.stringify(requestData),
			contentType: 'application/json',
			//dataType: 'json',
            success: function (result) {
                if (result.status) {
					console.log(result.message);
					//alert("Password changed successfully !!");
					$('#updatePasswordError').removeClass("hide");
					$('#updatePasswordError').addClass("show");
					
					$('#updatePassErrorMessage').removeClass("alert-danger");
					$('#updatePassErrorMessage').addClass("alert-success");
					$('#updatePassErrorMessage').html(result.message);
					
					$('#txtPasswordReg').val('');
					$('#txtConfirmPassword').val('');
			    }
                else if (!result.status) {
                    console.log(result.message)
					$('#updatePasswordError').removeClass("hide");
					$('#updatePasswordError').addClass("show");
					
					$('#updatePassErrorMessage').removeClass("alert-success");
					$('#updatePassErrorMessage').addClass("alert-danger");
					$('#updatePassErrorMessage').html(result.message);
					
					//Empty password and confirm password
					$('#txtPasswordReg').val('');
					$('#txtConfirmPassword').val('');
					$('#txtPasswordOld').val('');
                }
                
            },
            error: function () {
                console.log("Service is unavailable");
            }
           
        });
    }
});


var updateProfileRules = {
	'txtNameName': {
		required: true   
    },
	'txtContactName': {
		number:true,
		minlength:10,
		maxlength:10
	}
};
	
$('#formEditProfile').validate({
    rules: updateProfileRules,

    ignore: false,
    highlight: function () {
        // to remove the red alert on text 
    },
    submitHandler: function () {
		console.log("Inside submit");
		var update_profile_url = serviceIp+"/test-for-sure/user/update-user-profile";
		var type = "PUT";
        var name = $('#txtName').val();
        var email = $('#txtEmail').val();
        var contact = $('#txtContactNumber').val();
        
		var requestData = {};
		requestData.username = name;
		requestData.email = email;
		requestData.mobile = contact;
	   
		console.log(JSON.stringify(requestData));
		
        $.ajax({
            url: update_profile_url,
            type: type,
			data: JSON.stringify(requestData),
			contentType: 'application/json',
			//dataType: 'json',
            success: function (result) {
                if (result.status) {
					console.log(result.message);
					//alert("Password changed successfully !!");
					$('#editProfileError').removeClass("hide");
					$('#editProfileError').addClass("show");
					
					$('#editProfileErrorMessage').removeClass("alert-danger");
					$('#editProfileErrorMessage').addClass("alert-success");
					$('#editProfileErrorMessage').html(result.message);
					getUserProfile();
					populateValues();
					
			    }
                else if (!result.status) {
                    console.log(result.message)
					$('#editProfileError').removeClass("hide");
					$('#editProfileError').addClass("show");
					
					$('#editProfileErrorMessage').removeClass("alert-success");
					$('#editProfileErrorMessage').addClass("alert-danger");
					$('#editProfileErrorMessage').html(result.message);
					
					
                }
                
            },
            error: function () {
                console.log("Service is unavailable");
            }
           
        });
    }
});


function getUserProfile(){
	var getProfile_url = serviceIp+"/test-for-sure/user/get-user-profile?emailId="+email;
	$.ajax({
            url: getProfile_url,
            type: "GET",
			contentType: 'application/json',
			success: function (result) {
				console.log("Response: "+JSON.stringify(result));
                if (result.response.status) {
					//Status true means get user profile successfully.
					$('#name').text(result.userDetails.username);
					$('#email').text(result.userDetails.email);
					username = result.userDetails.username;
					email = result.userDetails.email;
					mobile = result.userDetails.mobile;
					$('#txtName').val(username);
					$('#txtEmail').val(email);
					$('#txtContactNumber').val(mobile);
			    }
                else if (!result.response.status) {
					console.log(result.response.message);
                }
                
            },
            error: function () {
                console.log("Service is unavailable");
            }
           
        });
}

function getAttemptedTests(){
	var testIds = [];
	var getTests_url = serviceIp+"/test-for-sure/view-report/get-attempted-tests?emailId="+email;
	$.ajax({
            url: getTests_url,
            type: "GET",
			contentType: 'application/json',
			success: function (result) {
				console.log("Response: "+JSON.stringify(result));
                if (result.response.status) {
					console.log("Length: "+result.attemptedTests.length);
					$('#msgAttemptedTest').removeClass('show');
					$('#msgAttemptedTest').addClass('hide');
					for(var i = 0;i<result.attemptedTests.length;i++){
						var id = (result.attemptedTests[i]).test_id;
						console.log("id: "+id);
						if(testIds.includes(id)){
							//means test is already displayed, just increase the count
							var value = $('#count-'+id).text();
							$('#count-'+id).text(parseInt(value)+1);
						}
						else{
							$('#divAttemptedTests').append(attemptedTestsStructure(result.attemptedTests[i]));
							testIds.push(id);
						}
					}
				}
                else if (!result.response.status) {
					console.log(result.response.message);
					$('#msgAttemptedTest').removeClass('hide');
					$('#msgAttemptedTest').addClass('show');
                }
                
            },
            error: function () {
                console.log("Service is unavailable");
            }
           
        });
}
function attemptedTestsStructure(test){
	//console.log("Test_id: "+test_id);
	var structure = "<div class='outer-test-div'>"+
						"<div class='col-md-3 float-left'>"+
							"<img class='test-image' src="+test.imagePath+"></img>"+
							"</br><h3 class='test-title'>"+test.title+"</h3>"+
						"</div>"+	
							"<div class='col-md-1.5 float-left max-marks'>"+
								"<span>Maximum Marks"+
								"</span></br>"+
								"<span class='max_marks_value'>"+test.no_of_ques*test.correct_ques_marks+
								"</span>"+
							"</div></br>"+
							"<div class='col-md-2.75 float-left margin-top-30 margin-left-10 div-width'>"+
								"<span class='glyphicon glyphicon-th-list'></span><label class='clear-both test-size'>&nbsp;No. of Questions: </label><span class='test-size'>"+test.no_of_ques+"</span>"+
								"</br><span class='glyphicon glyphicon-time'></span><label  class='clear-both test-size'>&nbsp;Time Limit(in mins): </label><span class='test-size'>"+test.time_limit+"</span>"+
							"</div>"+
							"<div class='col-md-2.75 float-left margin-top-30 div-width'>"+
								"<span class='glyphicon glyphicon-ok-sign'></span><label  class='clear-both test-size'>&nbsp;Correct Ques Marks: </label><span class='test-size'>"+test.correct_ques_marks+"</span>"+
								"</br><span class='glyphicon glyphicon-minus-sign'></span><label  class='clear-both test-size'>&nbsp;Negative marks: </label><span class='test-size'>"+test.negative_marks+"</span>"+
							"</div>"+
							"<div class='col-md-2 col-xs-10 col-xs-offset-1 col-md-offset-0 float-left margin-top-30 take-test-button'><a id='btnView-"+test.test_id+"' href='start-test-already-attempted.html?test_id=btnView-"+test.test_id+"' class='btn btn-default btn-block btn-primary'>View Report</a></div>"+
							"<div class='col-md-2 col-xs-10 col-xs-offset-1 col-md-offset-0 attempted-count'>Attempted&nbsp;<span id='count-"+test.test_id+"'>1</span>&nbsp;time(s)</div>"+
												//href='start-test-option.html?"+query_string+"'
												"</div>";
	return structure;
}
$(document).ready(function () {
	console.log("Document is ready");
	
	
	console.log("Logged in: "+localStorage.getItem('loggedIn'));
	console.log("Username: "+localStorage.getItem('username'));
	console.log("Email: "+localStorage.getItem('email'));
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
	
	email = localStorage.getItem('email');
	
	getUserProfile();
	getAttemptedTests();
})

