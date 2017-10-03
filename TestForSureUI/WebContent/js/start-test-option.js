var test_id;
$('#registerLink').on('click', function(){
	$('#loginUser').removeClass('show');
	$('#loginUser').addClass('hide');
	$('#registerUser').removeClass('hide');
	$('#registerUser').addClass('show');
})

$('#loginLink').on('click', function(){
	$('#loginUser').removeClass('hide');
	$('#loginUser').addClass('show');
	$('#registerUser').removeClass('show');
	$('#registerUser').addClass('hide');
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
					window.history.back();
                    window.open("start-test.html?from=login&test_id="+test_id, "myWindow", "status=1,toolbar=0,width=1000,height=1000");
	
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
					window.history.back();
                    window.open("start-test.html?from=register&test_id="+test_id, "myWindow", "status=1,toolbar=0,width=1000,height=1000");
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

$('#btnWithoutLogin').on('click', function(){
	window.history.back();
	window.open("start-test.html?from=withoutlogin&test_id="+test_id, "myWindow", "status=1,toolbar=0,width=1000,height=1000");
	//window.location.href = "start-test.html?from=withoutlogin&test_id="+test_id;
})

function getQueryParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}
$(document).ready(function () {
	console.log("Document start-test-option is ready");
	test_id = getQueryParameterByName('test_id');
	
	var testId = (test_id.split('-'))[1];
	//to get the test details to display in instructions
	var getTest_url = "http://localhost:8083/test-for-sure/test/get-testsbyId?testId="+testId;
	
	$.ajax({
                url: getTest_url,
                type: "GET",
                dataType: 'json',
                success: function (result) {
					if(result.status){
						console.log(JSON.stringify(result));
						localStorage.setItem('testDetails',JSON.stringify(result));
					}
					else if(!result.status){
						console.log("Error: "+result.message);
					}
                },
                error: function () {
					console.log("Error in getting questions");
                }
            });
	if(localStorage.getItem('loggedIn') == "true"){
		window.history.back();
		//means the user is logged in, then the test should start directly
		window.open("start-test.html?from=login&test_id="+test_id, "myWindow", "status=1,toolbar=0,width=1000,height=1000");
	}
})

