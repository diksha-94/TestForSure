var dashboardController = function(){
	this.Init();
};
dashboardController.prototype.Init = function()
{
	$('.page-header').load('header.html', function(){
		$('.admin-menu').load('menu.html', function(){
			$('.page-header').find('.admin-profile').html('<p>Logged in as Admin</p>'+
			'<img src="../../Images/admin_user.jpg" alt="Admin"/>');
			this.BindEvents();
			new menuController($('.admin-menu'));
		}.bind(this));
	}.bind(this));
};
dashboardController.prototype.BindEvents = function()
{
	/*$('body').bind('click', function(e){
		if($('.admin-profile-box').attr('showProfile') == 'true' && e.currentTarget.id != 'adminProfileBox'){
			$('.admin-profile-box').attr('showProfile', 'false');
			$('.admin-profile-box').fadeOut();
		}
	});*/
	$('.page-header').find('.admin-profile').unbind().bind('click', function(){
		$('.admin-profile-box').show();
		$('.admin-profile-box').attr('showProfile', 'true');
		$('.admin-profile-box').find('#btnChangePass').unbind().bind('click', function(){
			
		});
		$('.admin-profile-box').find('#btnLogout').unbind().bind('click', function(){
			//destroy the session
			window.location.href = 'index.html';
		});
	});
};