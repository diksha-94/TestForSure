var menuController = function(menuView){
	this.view = menuView;
	this.Init();
};
menuController.prototype.Init = function()
{
	this.BindMenuEvents();
};
menuController.prototype.BindMenuEvents = function()
{
	$(this.view).find('ul').find('li').unbind().bind('click', function(e){
		var action = $(e.currentTarget).data('action');
		var title = $(e.currentTarget).data('title');
		var controller = $(e.currentTarget).data('controller');
		$('.menu-tabs').find('li').removeClass('active');
		if($('.menu-tabs').find('li').find('a[href="#'+action+'"]').length == 0){
			var tab = '<li class="active"><a data-toggle="pill" href="#'+action+'" data-controller="' +controller + '">'+title+'</li>';
			$('.menu-tabs').append(tab);
		}
		
		//nav-tabs event binding
		$('.menu-tabs').find('li').find('a').unbind().bind('click', function(e){
			this.HandleEvents(e);
		}.bind(this));
		$('.menu-tabs').find('li').find('a[href="#'+action+'"]').click();
	}.bind(this));
	//Click Dashboard on page load
	$(this.view).find('ul').find('li#menuDashboard').click();
};
menuController.prototype.HandleEvents = function(e)
{
	var href = $(e.currentTarget).attr('href');
	var data_action = href.substring(1);
	var data_controller = $(e.currentTarget).attr('data-controller');
	$(this.view).find('ul').find('li').removeClass('active');
	$(this.view).find('ul').find('li[data-action="'+data_action+'"]').addClass('active');
	
	$('.menu-tabs').find('li').removeClass('active');
	$(e.currentTarget).parents('li').addClass('active');
	LoadCSS(data_controller);
	LoadJS(data_controller, function(){
		var controller = data_controller + "Controller";
		eval("new " + controller + "()");
	});
	/*switch(data_action){
		case 'menu_category':
			new categoryController();
			break;
		case 'menu_exam':
			$('.menu-page-content').html('Exam');
			new examController();
			break;
		case 'menu_question_bank':
			$('.menu-page-content').html('Question Bank');
			new questionbankController();
			break;
		case 'menu_test':
			$('.menu-page-content').html('Test');
			new testController();
			break;
		case 'menu_quiz':
			$('.menu-page-content').html('Quiz');
			new quizController();
			break;
		case 'menu_user':
			$('.menu-page-content').html('User Tracking');
			new usertrackingController();
			break;
		case 'menu_filter':
			$('.menu-page-content').html('Filter');
			new filterController();
			break;
	}*/
	console.log($(e.currentTarget).attr('href'));
};