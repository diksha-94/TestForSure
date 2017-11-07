var userId = "";
var password = "";

var resetPasswordRules = {
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
		var update_password_url = serviceIp+"/test-for-sure/user/update-password";
		var type = "POST"
        
        var passwordVal = $('#txtPasswordReg').val();
		
		var requestData = {};
		console.log("User id: "+userId);
		requestData.email = userId;
		requestData.password = passwordVal;
	   
		console.log(JSON.stringify(requestData));
		
        $.ajax({
            url: update_password_url,
            type: type,
			data: JSON.stringify(requestData),
			contentType: 'application/json',
			//dataType: 'json',
            success: function (result) {
                if (result.status) {
					console.log(result.message);
					$('#updatePasswordError').removeClass("hide");
					$('#updatePasswordError').addClass("show");
					
					$('#updatePasswordError').addClass("alert-success");
					$('#updatePasswordError').removeClass("alert-danger");
					$('#updatePassErrorMessage').html(result.message);
					
					$('#txtPasswordReg').val('');
					$('#txtConfirmPassword').val('');
			    }
                else if (!result.status) {
                    console.log(result.message)
					$('#updatePasswordError').removeClass("hide");
					$('#updatePasswordError').addClass("show");
					
					$('#updatePasswordError').removeClass("alert-success");
					$('#updatePasswordError').addClass("alert-danger");
					$('#updatePassErrorMessage').html(result.message);
					
					//Empty password and confirm password
					$('#txtPasswordReg').val('');
					$('#txtConfirmPassword').val('');
                }
                
            },
            error: function () {
                console.log("Service is unavailable");
            }
           
        });
    }
});
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
	console.log("Document Password reset is ready");
	userId = getQueryParameterByName('userId');
	password = getQueryParameterByName('pass');
	
	//to check if the link is valid or not by comparing the password in query string with the current password stored in database
	var url = serviceIp+"/test-for-sure/user/get-current-password?emailId="+userId;
	$.ajax({
                url: url,
                type: "POST",
                
                dataType: 'json',
                success: function (result) {
					if(result.status){
						if(result.message == password){
							//do nothing, by efault reset password div is displayed
						}
						else{
							$('#passwordReset').addClass('hide');
							$('#passwordReset').removeClass('show');
							$('#linkExpired').removeClass('hide');
							$('#linkExpired').addClass('show');
						}
					}
					else if(!result.status){
						console.log("Error: "+result.message);
						$('#passwordReset').addClass('hide');
						$('#passwordReset').removeClass('show');
						$('#linkExpired').removeClass('hide');
						$('#linkExpired').addClass('show');
					}
                },
                error: function () {
					console.log("Error in getting current password");
                }
            });
})

