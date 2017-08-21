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
		//var passwordVal = "test123";
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
            success: function (response) {
                if (response.status) {
					console.log(response.message);
                    window.location.href = "user-dashboard.html";
			    }
                else if (!response.status) {
                    console.log(response.message);
					$('#errorOuter').removeClass("hide");
					$('#errorOuter').addClass("show");
					$('#errorMessage').html(response.message);
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
            success: function (response) {
                if (response.status) {
					console.log(response.message);
                    window.location.href = "user-dashboard.html";
			    }
                else if (!response.status) {
                    console.log(response.message);
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
$(document).ready(function () {
	console.log("Document is ready");
	
})

