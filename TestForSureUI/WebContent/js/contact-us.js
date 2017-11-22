var contactUsRules = {
	'txtNameName': {
		required: true
    },
    'txtEmailName': {
		required: true,
		email: true
    },
	'txtQueryName': {
		required: true
    }
};
	
$('#contactUsForm').validate({
    rules: contactUsRules,

    ignore: true,
    highlight: function () {
        // to remove the red alert on text 
    },
    submitHandler: function () {
		console.log("Inside submit");
		var contact_us_query = serviceIp+"/test-for-sure/contact-us/insert-query";
		var type = "POST"
        var name = $('#txtName').val();
        var email = $('#txtEmail').val();
		var query = $('#txtQuery').val();
		
		var requestData = {};
		requestData.name = name;
		requestData.email = email;
		requestData.query = query;
	   
		console.log(JSON.stringify(requestData));
		
        $.ajax({
            url: contact_us_query,
            type: type,
			data: JSON.stringify(requestData),
			contentType: 'application/json',
			//dataType: 'json',
            success: function (result) {
                if (result.status) {
					//Status true means query is submitted successfully.
					console.log(result.message);
					
					$('#errorContactUs').removeClass("hide");
					$('#errorContactUs').addClass("show");
					$('#errorMessageContactUs').html("Thanks for posting !! We will contact you soon.");
					$('#errorMessageContactUs').removeClass("alert-danger");
					$('#errorMessageContactUs').addClass("alert-success");
					
					$('#txtName').val("");
					$('#txtEmail').val("");
					$('#txtQuery').val("")
			    }
                else if (!result.status) {
					console.log(result.message);
                    
					$('#errorContactUs').removeClass("hide");
					$('#errorContactUs').addClass("show");
					$('#errorMessageContactUs').html(response.message);
					$('#errorMessageContactUs').removeClass("alert-success");
					$('#errorMessageContactUs').addClass("alert-danger");
                }
                
            },
            error: function () {
                console.log("Service is unavailable");
            }
           
        });
    }
});


$(document).ready(function () {
	console.log("Document is ready");
	
	
	console.log("Logged in: "+localStorage.getItem('loggedIn'));
	if(localStorage.getItem('loggedIn') == "true"){
		//means the user is logged in
		$('#loggedInUSer').text(" "+localStorage.getItem('username'));
		$('#menuLogin').addClass('hide');
		$('#menuLogin').removeClass('show');
		$('#menuLogout').removeClass('hide');
		$('#menuLogout').addClass('show');
		$('#userProfile').removeClass('hide');
		$('#userProfile').addClass('show');
	}
	else{
		$('#menuLogin').removeClass('hide');
		$('#menuLogin').addClass('show');
		$('#menuLogout').addClass('hide');
		$('#menuLogout').removeClass('show');
		$('#userProfile').addClass('hide');
		$('#userProfile').removeClass('show');
	}
});

