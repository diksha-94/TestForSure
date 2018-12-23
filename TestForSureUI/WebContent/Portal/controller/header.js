var headerController = function(){
	this.Init();
};
headerController.prototype.Init = function()
{
	console.log("Init header");
	$('#btnLogin').unbind().bind('click', function(e){
		$('#loginModal').modal('show');
	});
	$('#btnRegister').unbind().bind('click', function(e){
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
	
	$('#registerModal').find('#btnDoRegister').unbind().bind('click', function(){
		//Register user
		$('#registerModal').find('input').css('border-color', '#CCC');
		$('#registerModal').find('#errorOuterReg').addClass('hide');
		var name = $('#registerModal').find('#txtNameReg').val();
		var email = $('#registerModal').find('#txtEmailReg').val();
		var contact = $('#registerModal').find('#txtContactReg').val();
		var password = $('#registerModal').find('#txtPasswordReg').val();
		var confirmPassword = $('#registerModal').find('#txtConfirmPassword').val();
		if(name.length <= 0){
			$('#registerModal').find('#errorOuterReg').removeClass('hide');
			$('#registerModal').find('#errorMessageReg').empty();
			$('#registerModal').find('#errorMessageReg').html("Please enter name !!");
			$('#registerModal').find('#txtNameReg').css('border-color', 'red');
			return;
		}
		else if(name.length > 40){
			$('#registerModal').find('#errorOuterReg').removeClass('hide');
			$('#registerModal').find('#errorMessageReg').empty();
			$('#registerModal').find('#errorMessageReg').html("Name cannot be of more than 40 characters !!");
			$('#registerModal').find('#txtNameReg').css('border-color', 'red');
			return;
		}
		if(email.length == 0){
			$('#registerModal').find('#errorOuterReg').removeClass('hide');
			$('#registerModal').find('#errorMessageReg').empty();
			$('#registerModal').find('#errorMessageReg').html("Please enter email !!");
			$('#registerModal').find('#txtEmailReg').css('border-color', 'red');
			return;
		}
		else if(!test2bsureController.getObj().ValidateEmail(email)){
			$('#registerModal').find('#errorOuterReg').removeClass('hide');
			$('#registerModal').find('#errorMessageReg').empty();
			$('#registerModal').find('#errorMessageReg').html("Please enter a valid email !!");
			$('#registerModal').find('#txtEmailReg').css('border-color', 'red');
			return;
		}
		if(contact.length == 0){
			$('#registerModal').find('#errorOuterReg').removeClass('hide');
			$('#registerModal').find('#errorMessageReg').empty();
			$('#registerModal').find('#errorMessageReg').html("Please enter mobile number !!");
			$('#registerModal').find('#txtContactReg').css('border-color', 'red');
			return;
		}
		else if(contact.length < 10 || contact.length > 10){
			$('#registerModal').find('#errorOuterReg').removeClass('hide');
			$('#registerModal').find('#errorMessageReg').empty();
			$('#registerModal').find('#errorMessageReg').html("Mobile number should be of 10 digits !!");
			$('#registerModal').find('#txtContactReg').css('border-color', 'red');
			return;
		}
		if(password.length == 0){
			$('#registerModal').find('#errorOuterReg').removeClass('hide');
			$('#registerModal').find('#errorMessageReg').empty();
			$('#registerModal').find('#errorMessageReg').html("Please enter password !!");
			$('#registerModal').find('#txtPasswordReg').css('border-color', 'red');
			return;
		}
		else if(password.length < 7){
			$('#registerModal').find('#errorOuterReg').removeClass('hide');
			$('#registerModal').find('#errorMessageReg').empty();
			$('#registerModal').find('#errorMessageReg').html("Password should be at least of 7 characters !!");
			$('#registerModal').find('#txtPasswordReg').css('border-color', 'red');
			return;
		}
		if(confirmPassword.length == 0){
			$('#registerModal').find('#errorOuterReg').removeClass('hide');
			$('#registerModal').find('#errorMessageReg').empty();
			$('#registerModal').find('#errorMessageReg').html("Please enter confirm password !!");
			$('#registerModal').find('#txtConfirmPassword').css('border-color', 'red');
			return;
		}
		else if(password != confirmPassword){
			$('#registerModal').find('#errorOuterReg').removeClass('hide');
			$('#registerModal').find('#errorMessageReg').empty();
			$('#registerModal').find('#errorMessageReg').html("Confirm password should match Password !!");
			$('#registerModal').find('#txtConfirmPassword').css('border-color', 'red');
			return;
		}
		var url = 'http://localhost:8083/test2bsure/register-user'
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
			success: function(response){
				console.log(response);
				if(response.result.status == true){
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
				
			},
			error: function(e){
				console.log(e);
			}
		});
	});
	
	$('#loginModal').find('#btnDoLogin').unbind().bind('click', function(){
		//Authenticate user
		$('#loginModal').find('input').css('border-color', '#CCC');
		$('#loginModal').find('#errorOuter').addClass('hide');
		var email = $('#loginModal').find('#txtEmail').val();
		var password = $('#loginModal').find('#txtPassword').val();
		if(email.length == 0){
			$('#loginModal').find('#errorOuter').removeClass('hide');
			$('#loginModal').find('#errorMessage').empty();
			$('#loginModal').find('#errorMessage').html("Please enter email !!");
			$('#loginModal').find('#txtEmail').css('border-color', 'red');
			return;
		}
		else if(!test2bsureController.getObj().ValidateEmail(email)){
			$('#loginModal').find('#errorOuter').removeClass('hide');
			$('#loginModal').find('#errorMessage').empty();
			$('#loginModal').find('#errorMessage').html("Please enter a valid email !!");
			$('#loginModal').find('#txtEmail').css('border-color', 'red');
			return;
		}
		if(password.length == 0){
			$('#loginModal').find('#errorOuter').removeClass('hide');
			$('#loginModal').find('#errorMessage').empty();
			$('#loginModal').find('#errorMessage').html("Please enter password !!");
			$('#loginModal').find('#txtPassword').css('border-color', 'red');
			return;
		}
		
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
					window.location.reload();
				}
				else{
					$('#loginModal').find('#errorOuter').removeClass('hide');
					$('#loginModal').find('#errorMessage').empty();
					$('#loginModal').find('#errorMessage').html(response.result.message);
				}
				
			},
			error: function(e){
				console.log(e);
			}
		});
	});
};
$(document).ready(function(){
	new headerController();
});