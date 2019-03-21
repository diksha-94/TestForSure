var dashboardController = function(){
	this.userId = "";
	this.Init();
};
dashboardController.prototype.Init = function()
{
	$('.page-header').load('header.html', function(){
		$('.admin-menu').load('menu.html', function(){
			$('.page-header').find('.admin-profile').html('<p>Logged in as Admin</p>'+
			'<img src="../../Images/admin_user.jpg" alt="Admin"/>');
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
		}.bind(this));
	}.bind(this));
};
dashboardController.prototype.BindEvents = function()
{
	/*$('body').bind('click', function(e){
		if($('.admin-profile-box').attr('showProfile') == 'true' && e.currentTarget.id != 'adminProfileBox'){
			$('.admin-profile-box').attr('showProfile', 'false');
			$('.admin-profile-box').fadeOut();
		}
	});*/
	$('.page-header').find('.admin-profile').unbind().bind('click', function(){
		$('.admin-profile-box').show();
		$('.admin-profile-box').attr('showProfile', 'true');
		$('.admin-profile-box').find('#btnChangePass').unbind().bind('click', function(){
			
		});
	});
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
	var url = 'http://localhost:8083/test2bsure/authenticate-user'
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
