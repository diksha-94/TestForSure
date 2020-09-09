var passwordResetController = function(){
	this.Init();
};
passwordResetController.prototype.Init = function()
{
	//Load header
	test2bsureController.getObj().GetHeader(".password-header");
	this.CheckLinkValidity();
	this.BindEvents();
	//Load footer
	test2bsureController.getObj().GetFooter(".password-footer");
	$('.common-footer').css('top',$('.common-header').height() + $('.common-content').height()+'px');
	userController.getObj().SelfAuth();
};
passwordResetController.prototype.BindEvents = function()
{
	var userId = "";
	var password = "";
	
	$('#btnUpdatePassword').unbind().bind('click', function(){
		var url = remoteServer+"/test2bsure/update-password";
		var type = "POST";
        var passwordVal = $('#txtPasswordReg').val();
		var confirmPasswordVal = $('#txtConfirmPassword').val();
		if(passwordVal.length < 6){
			alert('Password should be of atleast 6 characters.');
			return false;
		}
		if(passwordVal != confirmPasswordVal){
			alert('Password does not match in Confirm Password.');
			return false;
		}
		var requestData = {};
		requestData.email = this.GetQueryParameterByName('userId');
		requestData.password = passwordVal;
		requestData.isAdmin = 0;
		$.ajax({
			url: url,
			type: type,
			contentType: "application/json",
			data: JSON.stringify(requestData),
			context: this,
			success: function(result){
				if (result.status) {
					alert("Password changed successfully !!");
					window.location.href = "home.html";
				}
                else if (!result.status) {
                    alert(result.message);
				}
                //Empty password and confirm password
				$('#txtPasswordReg').val('');
				$('#txtConfirmPassword').val('');
            },
            error: function () {
                console.log("Service is unavailable");
            }
        });
	}.bind(this));
};
passwordResetController.prototype.CheckLinkValidity = function()
{
	var userId = this.GetQueryParameterByName('userId');
	var password = this.GetQueryParameterByName('pass');
		
	//to check if the link is valid or not by comparing the password in query string with the current password stored in database
	var url = remoteServer+"/test2bsure/get-current-password?emailId="+userId;
	$.ajax({
        url: url,
        type: "POST",
        dataType: 'json',
        success: function (result) {
			if(result.status){
				if(result.message == password){
					//do nothing, by default reset password div is displayed
				}
				else{
					$('.resetPasswordDiv').removeClass('show').addClass('hide');
					$('.linkExpiredDiv').removeClass('hide').addClass('show');
				}
			}
			else if(!result.status){
				console.log("Error: "+result.message);
				$('.resetPasswordDiv').removeClass('show').addClass('hide');
				$('.linkExpiredDiv').removeClass('hide').addClass('show');
			}
        },
        error: function () {
			console.log("Error in getting current password");
        }
    });
};
passwordResetController.prototype.GetQueryParameterByName = function(name, url)
{
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
};