var dashboardController = function(){
	this.userId = "";
	this.Init();
};
dashboardController.prototype.Init = function()
{
	//$('.page-header').load('header.html', function(){
		//$('.admin-menu').load('menu.html', function(){
			this.BindEvents();
			new menuController($('.admin-menu'));
			this.userId = getCookie('test2bsure_admin');
			if(this.userId){
				//Already login
				$('.login-box').css('display', 'none');
				$('.page-header').find('.admin-profile').css('display', 'block');
				$('.after-login').css('display', 'block');
			}
			else{
				$('.login-box').css('display', 'block');
				$('.page-header').find('.admin-profile').css('display', 'none');
				$('.after-login').css('display', 'none');
			}
		//}.bind(this));
	//}.bind(this));
};
dashboardController.prototype.BindEvents = function()
{
	$('.adminChangePassword').unbind().bind('click', function(){
		$('#changePasswordModal').modal('show');
		$('#changePasswordModal').find('#btnChangePassword').unbind().bind('click', function(){
			this.ChangePassword();
		}.bind(this));
	}.bind(this));
	$('#btnLogin').unbind().bind('click', function(){
		$('.error-message').empty();
		var email = $('#txtEmail').val();
		var password = $('#passPassword').val();
		if(email == '' || password == ''){
			$('.error-message').html('Email or password cannot be empty');
			return;
		}
		if(!validateEmail(email)){
			$('.error-message').html('Email is not valid');
			return;
		}
		if(password.length < 6){
			$('.error-message').html('Password cannot be smaller than 6 characters');
			return;
		}
		this.Login(email, password);
	}.bind(this));
	$('#btnLogout').unbind().bind('click', function(){
		this.Logout();
	}.bind(this));
};
dashboardController.prototype.Login = function(email, password)
{
	var url = remoteServer+'/test2bsure/authenticate-user'
	var type = 'POST';
	var requestData = {
		"email": email,
		"password": password,
		"isAdmin": 1
	};
	$.ajax({
		url: url,
		type: type,
		contentType: "application/json",
		data: JSON.stringify(requestData),
		success: function(response){
			console.log(response);
			if(response.result.status == true){
				setCookie("test2bsure_admin", response.userId, 1);
				window.location.reload();
			}
			else{
				$('.error-message').html(response.result.message);
			}
			
		},
		error: function(e){
			console.log(e);
		}
	});
}
dashboardController.prototype.Logout = function()
{
	this.userId = "";
	//remove the cookie
	setCookie("test2bsure_admin", "", -1);
	window.location.reload();
}

dashboardController.prototype.ChangePassword = function()
{
	var newPassword = $('#passNew').val();
	var newReenterPassword = $('#passNewReenter').val();
	if(newPassword.length == 0 || newReenterPassword.length == 0){
		$('.password-error').html("Please enter all the fields.");
		return;
	}
	if(newPassword.length < 6){
		$('.password-error').html("Password should contain atleast 6 characters.");
		return;
	}
	if(newPassword != newReenterPassword){
		$('.password-error').html("Please re-enter the same password.");
		return;
	}
	var url = remoteServer+'/test2bsure/changepassword'
	var type = 'PUT';
	var requestData = {
		"emailId": this.userId,
		"newPassword": newPassword,
	};
	$.ajax({
		url: url,
		type: type,
		contentType: "application/json",
		data: JSON.stringify(requestData),
		success: function(response){
			if(response.status == true){
				alert("Password updated successfully");
				$('#changePasswordModal').modal('hide');
			}
			else{
				$('.password-error').html(response.message);
			}
			
		},
		error: function(e){
			console.log(e);
		}
	});
}