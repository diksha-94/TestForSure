
function clickHere(){
	console.log("Clicked");
	$('#getEmail').removeClass('hide');
	$('#getEmail').addClass('show');
}

function btnSendClick(){
	var emailId = $('#emailId').val();
	var url = serviceIp+"/test-for-sure/user/send-verification-email?emailId="+emailId;
	$.ajax({
                url: url,
                type: "GET",
                
                dataType: 'json',
                success: function (result) {
					console.log("Result from send verification link again: "+JSON.stringify(result));
					if(result.status){
						
						$('#errorOuter').removeClass("hide");
						$('#errorOuter').addClass("show");
						$('#errorMessage').removeClass('alert-danger');
						$('#errorMessage').addClass('alert-success');
						$('#errorMessage').html(result.message);
						$('#emailId').val('');
					}
					else if(!result.status){
						$('#errorOuter').removeClass("hide");
						$('#errorOuter').addClass("show");
						$('#errorMessage').removeClass('alert-success');
						$('#errorMessage').addClass('alert-danger');
						$('#errorMessage').html(result.message);
					}
                },
                error: function () {
					$('#errorOuter').removeClass("hide");
					$('#errorOuter').addClass("show");
					$('#errorMessage').removeClass('alert-success');
					$('#errorMessage').addClass('alert-danger');
					$('#errorMessage').html("Service is currently unavailable");
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
	
	console.log("Document Email Verification is ready");
	
	console.log("Logged in: "+localStorage.getItem('loggedIn'));
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
	emailId = getQueryParameterByName('emailId');
	uniqueId = getQueryParameterByName('id');
	
	//to check if the link is valid or not by comparing emailid and the uniqueid as in the database
	var url = serviceIp+"/test-for-sure/user/verify-email-link?emailId="+emailId+"&uniqueId="+uniqueId;
	$.ajax({
                url: url,
                type: "GET",
                
                dataType: 'json',
                success: function (result) {
					if(result.status){
						var structure = "<span>Your e-mail id <b>"+emailId+"</b> has been verified successfully.</span></br>"+
									"<span>You can now log in !!</span>";
						$('#emailVerificationMessage').append(structure);
					}
					else if(!result.status){
						if(result.message == "Link is not valid"){
							var structure = "<span style='color:red;'>This link is invalid or has been expired.</span></br>"+
									"<span>Didn't confirm your e-mail yet?</span> <span id='getVerificationEmail' onclick='clickHere()' style='color:blue;cursor:pointer;'>Click here </span> <span>to get the verification link again</span></br>"+
									"</br><div id='getEmail' class='hide'><label>Enter your e-mail id</label>&nbsp;&nbsp;<span class='red'></span><input type='text' id='emailId'/></br>"+
									"</br><button type='button' class='btn btn-default btn-primary' id='btnSendLink' onclick='btnSendClick()'>Send</button></div>";
							$('#emailVerificationMessage').append(structure);
						}
						else{
							var structure = "<span>"+result.message+"</span></br>"+
									"<span>Please try again after some time with the same verification link</span></br>"+
							$('#emailVerificationMessage').append(structure);
						}
					}
                },
                error: function () {
					console.log("Error in getting current password");
                }
            });
})

