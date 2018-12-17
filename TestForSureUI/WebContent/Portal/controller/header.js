var headerController = function(){
	this.Init();
};
headerController.prototype.Init = function()
{
	console.log("Init header");
	$('#btnLogin').unbind().bind('click', function(e){
		console.log("Login");
		$('#loginModal').modal('show');
	});
	$('#btnRegister').unbind().bind('click', function(e){
		console.log("Register");
		$('#registerModal').modal('show');
	});
	$('#linkRegister').unbind().bind('click', function(e){
		$('#loginModal').modal('toggle');
		$('#registerModal').modal('show');
	});
	$('#linkToLogin').unbind().bind('click', function(e){
		$('#registerModal').modal('toggle');
		$('#loginModal').modal('show');
	});
	$('#linkForgot').unbind().bind('click', function(e){
		$('#loginModal').modal('toggle');
		$('#errorOuterForgot').hide();
		$('#successOuter').hide();
		$('#forgotPassForm').show();
		$('.footer-forgot').hide();
		$('#txtForgotEmail').val('');
		$('#forgotPassModal').modal('show');
	});
	$('#linkVerification').unbind().bind('click', function(e){
		$('#loginModal').modal('toggle');
		$('#errorOuterVerification').hide();
		$('#verForm').show();
		$('.footer-ver').hide();
		$('#txtVerEmail').val('');
		$('#verificationModal').modal('show');
	});
};
$(document).ready(function(){
	new headerController();
});