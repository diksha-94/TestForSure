var indexController = function(){
	this.Init();
};
indexController.prototype.Init = function()
{
	$('.page-header').load('header.html');
	this.BindEvents();
};
indexController.prototype.BindEvents = function()
{
	$('#btnLogin').unbind().bind('click', function(){
		console.log('Inside Login');
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
};
indexController.prototype.Login = function(email, password)
{
	$.ajax({
		url: 'https://www.google.com',
		type: 'POST',
		email: email,
		password: password,
		success: function(response){
			alert(JSON.stringify(response));
			window.location.href='dashboard.html';
		},
		error: function(error){
			alert(JSON.stringify(error));
			window.location.href='dashboard.html';
		}
	});
};
indexController.prototype.Logout = function()
{
};