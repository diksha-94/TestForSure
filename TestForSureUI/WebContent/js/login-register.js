$('#linkLogin').on('click', function(){
	$('#loginModal').modal();
})

var loginRules = {
    'txtEmailName': {
		required: true,
		email: true
    },
	'txtPasswordName': {
		required: true
    }
};
	
$('#loginForm').validate({
    rules: loginRules,

    ignore: true,
    highlight: function () {
        // to remove the red alert on text 
    },
    submitHandler: function () {
		console.log("Inside submit");
		var login_url = "http://localhost:8083/test-for-sure/user/authenticate-user";
		var type = "POST"
        var email = $('#txtEmail').val();
		var passwordVal = $('#txtPassword').val();
		//console.log(email);
		//console.log(passwordVal);
		var requestData = {};
		requestData.email = email;
		requestData.password = passwordVal;
	   
		console.log(JSON.stringify(requestData));
		
        $.ajax({
            url: login_url,
            type: type,
			data: JSON.stringify(requestData),
			contentType: 'application/json',
			//dataType: 'json',
            success: function (result) {
                if (result.response.status) {
					//Status true means user is authenticated successfully.
					console.log(result.response.message);
					console.log(result.username);
					console.log(result.password);
					
					localStorage.setItem("loggedIn", "true");
					localStorage.setItem("username", result.username);
                    window.location.href = "user-dashboard.html";
			    }
                else if (!result.response.status) {
					console.log(result.response.message);
					console.log(result.username);
					console.log(result.password);
                    
					$('#errorOuter').removeClass("hide");
					$('#errorOuter').addClass("show");
					$('#errorMessage').html(result.response.message);
                }
                
            },
            error: function () {
                console.log("Service is unavailable");
            }
           
        });
    }
});

var registerRules = {
    'txtNameReg': {
		required: true
    },
	'txtEmailNameReg': {
		required: true,
		email: true
    },
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
	
$('#registerForm').validate({
    rules: registerRules,

    ignore: false,
    highlight: function () {
        // to remove the red alert on text 
    },
    submitHandler: function () {
		console.log("Inside submit");
		var login_url = "http://localhost:8083/test-for-sure/user/register-user";
		var type = "POST"
        var name = $('#txtNameReg').val();
        var email = $('#txtEmailReg').val();
        var mobile = $('#txtContactReg').val();
        var passwordVal = $('#txtPasswordReg').val();
		//var passwordVal = "test123";
		var requestData = {};
		requestData.userDetails = {};
		requestData.userDetails.id = name+"-"+(Math.floor((Math.random() * 100000) + 1));
		requestData.userDetails.name = name;
		requestData.userDetails.email = email;
		requestData.userDetails.mobileno = mobile;
		requestData.password = passwordVal;
		
	   console.log(JSON.stringify(requestData));
		
        $.ajax({
            url: login_url,
            type: type,
			data: JSON.stringify(requestData),
			contentType: 'application/json',
			//dataType: 'json',
            success: function (result) {
                if (result.response.status) {
					console.log(result.response.message);
					localStorage.setItem("loggedIn", "true");
					localStorage.setItem("username", result.username);
                    window.location.href = "user-dashboard.html";
			    }
                else if (!result.response.status) {
                    console.log(result.response.message)
					$('#errorOuterReg').removeClass("hide");
					$('#errorOuterReg').addClass("show");
					$('#errorMessageReg').html(result.response.message);
					
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
$('#linkRegister').on('click', function(){
	$('#loginModal').modal('toggle');
	$('#registerModal').modal('show');
})

$('#linkToLogin').on('click', function(){
	$('#registerModal').modal('toggle');
	$('#loginModal').modal('show');
})

//Forgot Password
$('#linkForgot').on('click', function(){
	$('#loginModal').modal('toggle');
	$('#forgotPassModal').modal('show');
})


var forgotPassRules = {
    'txtForgotEmailName': {
		required: true,
		email: true
    }
};
	
$('#forgotPassForm').validate({
    rules: forgotPassRules,

    ignore: true,
    highlight: function () {
        // to remove the red alert on text 
    },
    submitHandler: function () {
		
		var emailId = $('#txtForgotEmail').val();
		console.log("Inside submit: "+emailId);
		var sendPasswordResetURL = "http://localhost:8083/test-for-sure/user/forgot-password?emailId="+emailId;
		var type = "POST";
        
        $.ajax({
            url: sendPasswordResetURL,
            type: type,
			//dataType: 'json',
            success: function (result) {
				console.log("Result: "+JSON.stringify(result));
                if (result.status) {
					//Status true means user exists
					$('#errorOuterForgot').removeClass("show");
					$('#errorOuterForgot').addClass("hide");
					
					$('#successOuter').removeClass("hide");
					$('#successOuter').addClass("show");
					$('#successMessage').html("A password reset link has been sent to your registered e-mail id. Use that link to reset your password.");
					
					$('#forgotPassForm').addClass('hide');
					$('#forgotPassForm').removeClass('show');
					
					$('.footer-forgot').removeClass('hide');
					$('.footer-forgot').removeClass('show');
				}
                else if (!result.status) {
					
					$('#errorOuterForgot').removeClass("hide");
					$('#errorOuterForgot').addClass("show");
					$('#errorMessageForgot').html(result.message);
                }
                
            },
            error: function () {
                console.log("Service is unavailable");
            }
           
        });
    }
});