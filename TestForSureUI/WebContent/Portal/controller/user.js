var user_obj = null;
var userController = function(){
	this.userData = null;
};
userController.getObj = function()
{
	if(user_obj == null){
		user_obj = new userController();
	}
	return user_obj;
};
userController.prototype.Init = function()
{
};
userController.prototype.Register = function(name, email, contact, password)
{
	var url = remoteServer+'/test2bsure/register-user';
	var type = 'POST';
	var requestData = {
		"userId": name+"-"+(Math.floor((Math.random() * 100000) + 1)),
		"name": name,
		"email": email,
		"mobileNo": contact,
		"password": password
	};
	$.ajax({
		url: url,
		type: type,
		contentType: "application/json",
		data: JSON.stringify(requestData),
		context: this,
		success: function(response){
			if(response.result.status == true){
				this.Login(email, password);
				$('#registerModal').find('#errorOuterReg').removeClass("hide");
				$('#registerModal').find('#errorMessageReg').removeClass('alert-danger');
				$('#registerModal').find('#errorMessageReg').addClass('alert-success');
				$('#registerModal').find('#errorMessageReg').html("An email verification link has been sent to your email id. Verify your email address and then log in");
				
				//Empty password and confirm password
				$('#registerModal').find('#txtNameReg').val('');
				$('#registerModal').find('#txtEmailReg').val('');
				$('#registerModal').find('#txtContactReg').val('');
				$('#registerModal').find('#txtPasswordReg').val('');
				$('#registerModal').find('#txtConfirmPassword').val('');
			}
			else{
				$('#registerModal').find('#errorOuterReg').removeClass('hide');
				$('#registerModal').find('#errorMessageReg').empty();
				$('#registerModal').find('#errorMessageReg').html(response.result.message);
				$('#registerModal').find('#txtPasswordReg').val('');
				$('#registerModal').find('#txtConfirmPassword').val('');
			}
		}.bind(this),
		error: function(e){
			console.log(e);
		}
	});
};
userController.prototype.Login = function(email, password)
{
	var url = remoteServer+'/test2bsure/authenticate-user';
	var type = 'POST';
	var requestData = {
		"email": email,
		"password": password
	};
	$.ajax({
		url: url,
		type: type,
		contentType: "application/json",
		data: JSON.stringify(requestData),
		context: this,
		success: function(response){
			if(response.result.status == true){
				//window.location.reload();
				test2bsureController.getObj().SetCookie('test2bsure_userLoginId', response.cookieValue, 100);
				this.selfAuth();
			}
			else{
				$('#loginModal').find('#errorOuter').removeClass('hide');
				$('#loginModal').find('#errorMessage').empty();
				$('#loginModal').find('#errorMessage').html(response.result.message);
			}
		}.bind(this),
		error: function(e){
			console.log(e);
		}
	});
};
userController.prototype.SelfAuth = function()
{
	var value = test2bsureController.getObj().getCookie('test2bsure_userLoginId');
	if(value.length > 0){
		//Cookie is set for the user, send a request to server for self auth for the user 
		//for whom cookie is set
		var url = remoteServer+'/test2bsure/selfauth'
		var type = 'POST';
		var requestData = {
			"userLoginId": value,
		};
		$.ajax({
			url: url,
			type: type,
			contentType: "application/json",
			data: JSON.stringify(requestData),
			success: function(response){
				this.userData = response.userDetails;
				console.log(response);
				if(response.result.status == true){
					//window.location.reload();
				}
				else{
					//$('#loginModal').find('#errorOuter').removeClass('hide');
					//$('#loginModal').find('#errorMessage').empty();
					//$('#loginModal').find('#errorMessage').html(response.result.message);
				}
				
			},
			error: function(e){
				console.log(e);
			}
		});
	}
};
userController.prototype.ChangePassword = function()
{
};
userController.prototype.ForgetPassword = function()
{
};