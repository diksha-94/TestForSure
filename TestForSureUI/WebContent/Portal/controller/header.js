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
	$('.btnLogin').unbind().bind('click', function(e){
		if($('#loginModal').length == 0){
			$('body').append(loginModal());
		}
		$('#loginModal').modal('show');
		$('#loginModal').find('#errorOuter').addClass('hide');
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
		$('#errorOuterForgot').removeClass('show').addClass('hide');
		$('#successOuter').removeClass('show').addClass('hide');
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
		$('#forgotPassModal').find('#successOuter').removeClass('show').addClass('hide');
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
	$('#userProfile').unbind().bind('click', function(e){
		if ($(window).width() < 767){
			//Mobile View
			window.location.href = "dashboard.html";
		}
		else{
			if($(e.currentTarget).hasClass('open')){
				//means already open, close it
				$(e.currentTarget).removeClass('open');
				$('.header .profile-menu').css('height', '0px');
				$('.header .profile-menu').css('visibility', 'hidden');
				$('.header .profile-menu ul li').css('border-bottom', 'none');
				$('.overlayD').css('height', '0px');
				$("body").removeClass("nobodyscroll");
			}
			else{
				$(e.currentTarget).addClass('open');
				$('.header .profile-menu').css('height', '130px');
				$('.header .profile-menu').css('visibility', 'visible');
				$('.header .profile-menu ul li').css('border-bottom', 'solid 1px #E4E4E4');
				$('.overlayD').css('height', '100%');
				$("body").addClass("nobodyscroll");
			}
		}
	});
	$('.overlayD').unbind().bind('click', function(){
		$('#userProfile').click();
	});
	$('.profile-menu').find('#myDashboard').unbind().bind('click', function(){
		window.location.href = "dashboard.html";
	});
	$('.profile-menu').find('#changePassword').unbind().bind('click', function(){
		$('#userProfile').click();
		if($('#changePasswordModal').length == 0){
			$('body').append(changePasswordModal());
		}
		$('#changePasswordModal').modal('show');
		$('#changePasswordModal').find('#errorMessage').html("");
		$('#changePasswordModal').find('#txtPass').val('');
		$('#changePasswordModal').find('#txtConfirmPass').val('');
		$('#changePasswordModal').find('#btnChangePass').unbind().bind('click', function(){
			var newPassword = $('#changePasswordModal').find('#txtPass').val();
			var newReenterPassword = $('#changePasswordModal').find('#txtConfirmPass').val();
			if(newPassword.length == 0 || newReenterPassword.length == 0){
				$('#changePasswordModal').find('#errorMessage').html("Please enter all the fields.");
				return;
			}
			if(newPassword.length < 6){
				$('#changePasswordModal').find('#errorMessage').html("Password should contain atleast 6 characters.");
				return;
			}
			if(newPassword != newReenterPassword){
				$('#changePasswordModal').find('#errorMessage').html("Please re-enter the same password.");
				return;
			}
			$('#changePasswordModal').find('#errorMessage').html("");
			var url = remoteServer+'/test2bsure/changepassword'
			var type = 'PUT';
			var userId = -1;
			if(typeof userController != 'undefined' && typeof userController.getObj() != 'undefined' && (typeof userController.getObj().userData != 'undefined' && userController.getObj().userData != null) && typeof userController.getObj().userData.id != 'undefined'){
				userId = userController.getObj().userData.id;
			}
			if(userId == -1){
				alert("You are not logged in");
			}
			var requestData = {
				"emailId": userId,
				"newPassword": newPassword,
			};
			$.ajax({
				url: url,
				type: type,
				contentType: "application/json",
				data: JSON.stringify(requestData),
				success: function(response){
					if(response.status == true){
						alert("Password updated successfully");
						$('#changePasswordModal').modal('hide');
					}
					else{
						$('#changePasswordModal').find('#errorMessage').html(response.message);
					}
					
				},
				error: function(e){
					console.log(e);
				}
			});
		});
	});
	$('.profile-menu').find('#btnLogout').unbind().bind('click', function(){
		userController.getObj().Logout(function(){
			window.location.href = "home.html";
		});
	});
	
};
headerController.prototype.LoadExams = function(){
	fetch(remoteServer+'/test2bsure/header')
		  .then(response => response.json())
		  .then(data => this.SetState({ category: data.category, exam: data.exam, quizSubject: data.quizSubject }));
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
	var mobileHtml = "";
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
				'<span><img src="../images/final/left_arrow.png" class="expand-exams"/></span>'+
				'</li>';
		mobileHtml += '<div class="outer"><div class="outer-1" data-toggle="collapse" href="#cat'+cat+'"><span>'+this.category[cat].title+'</span>'+
					  '<img src="../images/final/down_arrow.png" class="closed"/></div>'+
					  '<div id="cat'+cat+'" class="collapse"><ul>';
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
				
				mobileHtml += "<li class='exam-value-item' exam-id='"+this.exam[exam].id+"'>"+this.exam[exam].title+"";
				mobileHtml +=	"</li>";
			}
		}
	  	mobileHtml += '</ul></div></div>';
	  	htmlContent += "</ul></div>";
	}
	$('.exam-menu').html(html);
	$('.exam-content').html(htmlContent);
	$('.mobileView.exams').append(mobileHtml);
	$('.mobileView.exams').find('.outer-1').unbind().bind('click', function(e){
		if($(e.currentTarget).find('img').hasClass('closed')){
			$(e.currentTarget).find('img').css('transform', "rotate(180deg)");
			$(e.currentTarget).find('img').removeClass('closed');
		}
		else{
			$(e.currentTarget).find('img').css('transform', "rotate(0deg)");
			$(e.currentTarget).find('img').addClass('closed');
		}
	});
	$('.exam-value-item').unbind().bind('click', function(e){
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
	
	//Populate Quiz Subject
	html = "";
	for(var qs in this.quizSubject){
		var sub = this.quizSubject[qs];
		var subName = sub.name.replace(/[^a-zA-Z0-9]/g,'_');
		html += '<li class="quiz-value-item" subject-id="'+sub.id+'">';
		html += '<a href="#'+subName+'">'+sub.name+'</a>'+
				'</li>';
	}
	$('.quizzes.mobileView').find('.quiz-menu').html(html);
	$('.quiz-menu-div').find('.quiz-menu').html(html);
	$('.quiz-value-item').unbind().bind('click', function(e){
		var userId = -1;
		if(typeof userController != 'undefined' && typeof userController.getObj() != 'undefined' && (typeof userController.getObj().userData != 'undefined' && userController.getObj().userData != null) && typeof userController.getObj().userData.id != 'undefined'){
			userId = userController.getObj().userData.id;
		}
		var subjectId = $(e.currentTarget).attr('subject-id');
		window.location.href = 'quiz.html?id=' + subjectId;
	});
};
$(document).ready(function(){
	new headerController();
});