var contactusController = function(){
};
contactusController.prototype.Init = function(callback)
{
	this.LoadPage();
	callback();
};
contactusController.prototype.LoadPage = function()
{
	var html = "<h3 class='head'>We'll be in touch soon</h3>"+
			   "<div id='errorContactUs' class='hide col-sm-7 col-sm-offset-3'>"+
					"<div class='alert alert-danger' id='errorMessageContactUs'></div>"+
			   "</div>"+
			   "<form id='contactUsForm' class='form-horizontal' role='form'>"+
					"<div class='form-group margin-bottom'>"+
						"<label class='control-label col-sm-3'>Name</label>"+
						"<div class='col-sm-7'>"+
							"<input type='text' class='form-control' id='txtName' name='txtNameName' required='required' placeholder='Name'/>"+
						"</div>"+
					"</div>"+
					"<div class='form-group margin-bottom'>"+
						"<label class='control-label col-sm-3'>E-mail</label>"+
						"<div class='col-sm-7'>"+
							"<input type='email' class='form-control' id='txtEmail' name='txtEmailName' required='required' placeholder='abc@example.com'/>"+
						"</div>"+
					"</div>"+
					"<div class='form-group margin-bottom'>"+
						"<label class='control-label col-sm-3'>Message/Query</label>"+
						"<div class='col-sm-7'>"+
							"<textarea class='form-control' rows='5' id='txtQuery' name='txtQueryName' required='required' placeholder='Write your Query...'></textarea>"+
						"</div>"+
					"</div>"+
					"<div class='form-group'>"+
						"<div class='col-sm-3 col-sm-offset-5'>"+
							"<button type='submit' id='btnSubmitQuery' class='btn btn-primary btn-block'>Submit Query</button>"+
						"</div>"+
					"</div>"+
		       "</form>";
	$('body .common-content').html(html);
	$('.common-content').addClass('outerContact');
};
contactusController.prototype.BindEvents = function()
{
	$('#btnSubmitQuery').unbind().bind('click', function(){
		var name = $('#txtName').val();
        var email = $('#txtEmail').val();
		var query = $('#txtQuery').val();
		if(name.length == 0 || email.length == 0 || query.length == 0){
			$('#errorContactUs').removeClass("hide");
			$('#errorContactUs').addClass("show");
			$('#errorMessageContactUs').html("Please enter all the fields");
			$('#errorMessageContactUs').removeClass("alert-success");
			$('#errorMessageContactUs').addClass("alert-danger");
			return;
		}
		if(!test2bsureController.getObj().ValidateEmail(email)){
			$('#errorContactUs').removeClass("hide");
			$('#errorContactUs').addClass("show");
			$('#errorMessageContactUs').html("Please enter a valid email");
			$('#errorMessageContactUs').removeClass("alert-success");
			$('#errorMessageContactUs').addClass("alert-danger");
			return;
		}
		var requestData = {};
		requestData.name = name;
		requestData.email = email;
		requestData.query = query;
		$.ajax({
            url: remoteServer+"/test2bsure/contactus",
            type: 'POST',
            contentType: 'application/json',
			data: JSON.stringify(requestData),
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
	});
};