var contactusController = function(){
	this.Init();
};
contactusController.prototype.Init = function()
{
	//Load header
	test2bsureController.getObj().GetHeader(".contactus-header");
	this.BindEvents();
	//Load footer
	test2bsureController.getObj().GetFooter(".contactus-footer");
	$('.common-footer').css('top',$('.common-header').height() + $('.common-content').height()+ 80 + 'px');
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
			data: JSON.stringify(requestData),
			contentType: 'application/json',
			dataType: 'json',
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