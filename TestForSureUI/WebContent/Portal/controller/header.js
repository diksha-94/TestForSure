var headerController = function(){
	this.category = {};
	this.exam = {};
	this.Init();
	this.LoadExams();
};
headerController.prototype.Init = function()
{
	console.log("Init header");
	if($('#loginModal').length == 0){
		$('body').append(loginModal());
	}
	if($('#registerModal').length == 0){
		$('body').append(registerModal());
	}
	if($('#forgotPassModal').length == 0){
		$('body').append(forgotPassModal());
	}
	if($('#verificationModal').length == 0){
		$('body').append(verificationModal());
	}
	$('#btnLogin').unbind().bind('click', function(e){
		if($('#loginModal').length == 0){
			$('body').append(loginModal());
		}
		$('#loginModal').modal('show');
	});
	$('#linkRegister').unbind().bind('click', function(e){
		$('#loginModal').modal('toggle');
		if($('#registerModal').length == 0){
			$('body').append(registerModal());
		}
		$('#registerModal').modal('show');
	});
	
	$('#linkForgot').unbind().bind('click', function(e){
		$('#loginModal').modal('toggle');
		if($('#forgotPassModal').length == 0){
			$('body').append(forgotPassModal());
		}
		$('#forgotPassModal').modal('show');
		$('#errorOuterForgot').hide();
		$('#successOuter').hide();
		$('#forgotPassForm').show();
		$('.footer-forgot').hide();
		$('#txtForgotEmail').val('');
	});
	
	$('#linkVerification').unbind().bind('click', function(e){
		$('#loginModal').modal('toggle');
		if($('#verificationModal').length == 0){
			$('body').append(verificationModal());
		}
		$('#verificationModal').modal('show');
		$('#errorOuterVerification').hide();
		$('#verForm').show();
		$('.footer-ver').hide();
		$('#txtVerEmail').val('');
	});
	$('#linkToLogin').unbind().bind('click', function(e){
		$('#registerModal').modal('toggle');
		$('#loginModal').modal('show');
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
		
		$('#registerModal').find('#errorOuterReg').removeClass('hide').addClass('show');
		$('#registerModal').find('#errorMessageReg').empty();
		if(name.length <= 0){
			$('#registerModal').find('#errorMessageReg').html("Please enter name !!");
			$('#registerModal').find('#txtNameReg').css('border-color', 'red');
			return;
		}
		else if(name.length > 40){
			$('#registerModal').find('#errorMessageReg').html("Name cannot be of more than 40 characters !!");
			$('#registerModal').find('#txtNameReg').css('border-color', 'red');
			return;
		}
		if(email.length == 0){
			$('#registerModal').find('#errorMessageReg').html("Please enter email !!");
			$('#registerModal').find('#txtEmailReg').css('border-color', 'red');
			return;
		}
		else if(!test2bsureController.getObj().ValidateEmail(email)){
			$('#registerModal').find('#errorMessageReg').html("Please enter a valid email !!");
			$('#registerModal').find('#txtEmailReg').css('border-color', 'red');
			return;
		}
		if(contact.length == 0){
			$('#registerModal').find('#errorMessageReg').html("Please enter mobile number !!");
			$('#registerModal').find('#txtContactReg').css('border-color', 'red');
			return;
		}
		else if(contact.length < 10 || contact.length > 10){
			$('#registerModal').find('#errorMessageReg').html("Mobile number should be of 10 digits !!");
			$('#registerModal').find('#txtContactReg').css('border-color', 'red');
			return;
		}
		if(password.length == 0){
			$('#registerModal').find('#errorMessageReg').html("Please enter password !!");
			$('#registerModal').find('#txtPasswordReg').css('border-color', 'red');
			return;
		}
		else if(password.length < 7){
			$('#registerModal').find('#errorMessageReg').html("Password should be at least of 7 characters !!");
			$('#registerModal').find('#txtPasswordReg').css('border-color', 'red');
			return;
		}
		if(confirmPassword.length == 0){
			$('#registerModal').find('#errorMessageReg').html("Please enter confirm password !!");
			$('#registerModal').find('#txtConfirmPassword').css('border-color', 'red');
			return;
		}
		else if(password != confirmPassword){
			$('#registerModal').find('#errorMessageReg').html("Confirm password should match Password !!");
			$('#registerModal').find('#txtConfirmPassword').css('border-color', 'red');
			return;
		}
		$('#registerModal').find('#errorOuterReg').removeClass('show').addClass('hide');
		userController.getObj().Register(name, email, contact, password);
	});
	
	$('#loginModal').find('#btnDoLogin').unbind().bind('click', function(){
		//Authenticate user
		$('#loginModal').find('input').css('border-color', '#CCC');
		$('#loginModal').find('#errorOuter').addClass('hide');
		var email = $('#loginModal').find('#txtEmail').val();
		var password = $('#loginModal').find('#txtPassword').val();
		$('#loginModal').find('#errorOuter').removeClass('hide').addClass('show');
		$('#loginModal').find('#errorMessage').empty();
		if(email.length == 0){
			$('#loginModal').find('#errorMessage').html("Please enter email !!");
			$('#loginModal').find('#txtEmail').css('border-color', 'red');
			return;
		}
		else if(!test2bsureController.getObj().ValidateEmail(email)){
			$('#loginModal').find('#errorMessage').html("Please enter a valid email !!");
			$('#loginModal').find('#txtEmail').css('border-color', 'red');
			return;
		}
		if(password.length == 0){
			$('#loginModal').find('#errorMessage').html("Please enter password !!");
			$('#loginModal').find('#txtPassword').css('border-color', 'red');
			return;
		}
		$('#loginModal').find('#errorOuter').removeClass('show').addClass('hide');
		userController.getObj().Login(email, password);
	});
	
	$('#forgotPassModal').find('#btnForgotSend').unbind().bind('click', function(){
		//Send Forget Password Mail
		$('#forgotPassModal').find('input').css('border-color', '#CCC');
		$('#forgotPassModal').find('#errorOuterForgot').addClass('hide');
		var email = $('#forgotPassModal').find('#txtForgotEmail').val();
		$('#forgotPassModal').find('#errorOuterForgot').removeClass('hide').addClass('show');
		$('#forgotPassModal').find('#errorMessageForgot').empty();
		if(email.length == 0){
			$('#forgotPassModal').find('#errorMessageForgot').html("Please enter email !!");
			$('#forgotPassModal').find('#txtForgotEmail').css('border-color', 'red');
			return;
		}
		else if(!test2bsureController.getObj().ValidateEmail(email)){
			$('#forgotPassModal').find('#errorMessageForgot').html("Please enter a valid email !!");
			$('#forgotPassModal').find('#txtForgotEmail').css('border-color', 'red');
			return;
		}
		$('#forgotPassModal').find('#errorOuterForgot').removeClass('show').addClass('hide');
		userController.getObj().ForgetPassword(email);
	});
	$('#userProfile').find('#btnLogout').unbind().bind('click', function(){
		userController.getObj().Logout();
	});
};
headerController.prototype.LoadExams = function(){
	fetch(remoteServer+'/test2bsure/header')
		  .then(response => response.json())
		  .then(data => this.SetState({ category: data.category, exam: data.exam }));
};
headerController.prototype.SetState = function(obj)
{
	for(var key in obj){
		this[key] = obj[key];
	}
	this.PopulateData();
};
headerController.prototype.PopulateData = function(){
	var html = "";
	var htmlContent = "";
	var onceTab = false;
	var onceContent = false;
	for(var cat in this.category){
		var catName = this.category[cat].title.replace(/[^a-zA-Z0-9]/g,'_');
		if(onceTab == true){
			html += '<li class="exam-menu-item">';
		}
		else{
			html += '<li class="active exam-menu-item">';
			onceTab = true;
		}
		html += '<a href="#'+catName+'">'+this.category[cat].title+'</a>'+
				'<span>></span>'+
				'</li>';
		if(onceContent == true){
			htmlContent += '<div id="'+catName+'" class="tab-pane fade in"><ul class="exams-list">';
		}
		else{
			htmlContent += '<div id="'+catName+'" class="active tab-pane fade in"><ul class="exams-list">';
			onceContent = true;
		}
	  	for(var exam in this.exam){
			if(this.exam[exam].category == this.category[cat].id){
				htmlContent += "<li class='exam-value-item' exam-id='"+this.exam[exam].id+"'>"+this.exam[exam].title+"";
				htmlContent +=	"</li>";
			}
		}
	  	htmlContent += "</ul></div>";
	}
	$('.exam-menu').html(html);
	$('.exam-content').html(htmlContent);
	$('.exam-content').find('.exam-value-item').unbind().bind('click', function(e){
		var userId = -1;
		if(typeof userController != 'undefined' && typeof userController.getObj() != 'undefined' && (typeof userController.getObj().userData != 'undefined' && userController.getObj().userData != null) && typeof userController.getObj().userData.id != 'undefined'){
			userId = userController.getObj().userData.id;
		}
		var examId = $(e.currentTarget).attr('exam-id');
		window.location.href = 'exam.html?id=' + examId;
	});
	$('.exam-menu-item').unbind().bind('mouseover', function(e){
		var href = $(e.currentTarget).find('a').attr('href');
		$('.exam-menu-item').removeClass('active');
		$(e.currentTarget).addClass('active');
		$('.exam-content').find('.tab-pane').removeClass('active in');
		$('.exam-content').find(href).addClass('active in');
	});
};
$(document).ready(function(){
	new headerController();
});