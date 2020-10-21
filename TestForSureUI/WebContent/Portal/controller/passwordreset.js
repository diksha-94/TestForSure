var passwordresetController = function(){
};
passwordresetController.prototype.Init = function(callback)
{
	this.LoadPage();
	this.CheckLinkValidity();
	this.BindEvents();
	userController.getObj().SelfAuth();
	callback();
};
passwordresetController.prototype.LoadPage = function()
{
	var html = "<div class='resetPasswordDiv show col-xs-12 col-sm-12 col-md-12 col-lg-12'>"+
					"<h3>Reset Password</h3>"+
					"<div class='col-xs-12 col-sm-12 col-md-12 col-lg-12'>"+
						"<label class='col-md-4'>New Password</label>"+
						"<div class='col-md-8'>"+
							"<input type='password' id='txtPasswordReg' name='txtPasswordNameReg' class='form-control' placeholder='Password'/>"+
						"</div>"+
					"</div>"+
					"<div class='col-xs-12 col-sm-12 col-md-12 col-lg-12'>"+
						"<label class='col-md-4'>Confirm Password</label>"+
						"<div class='col-md-8'>"+
							"<input type='password' id='txtConfirmPassword' name='txtConfirmNameReg' class='form-control' placeholder='Confirm Password'/>"+
						"</div>"+
					"</div>"+
					"<div class='col-xs-12 col-sm-12 col-md-12 col-lg-12'>"+
						"<div class='col-md-8 col-md-offset-4'>"+
							"<button id='btnUpdatePassword' class='button button-primary'>Change Password</button>"+
						"</div>"+
					"</div>"+
				"</div>"+
				"<div class='linkExpiredDiv hide col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xs-offset-0 col-sm-offset-0 col-md-offset-3 col-lg-offset-3'>"+
					"<div class='errorExpired'>"+
						"<div class='alert alert-danger'>This link is invalid/or has been expired.</div>"+
					"</div>"+
				"</div>";
	$('body .common-content').html(html);
	$('body .common-content').addClass('reset-content');
};
passwordresetController.prototype.BindEvents = function()
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
					window.location.href = "/";
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
passwordresetController.prototype.CheckLinkValidity = function()
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
passwordresetController.prototype.GetQueryParameterByName = function(name, url)
{
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
};