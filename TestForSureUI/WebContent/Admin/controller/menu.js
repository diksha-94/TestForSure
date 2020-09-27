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
		var listing = true;
		if(typeof $(e.currentTarget).attr('listing') != 'undefined'){
			listing = $(e.currentTarget).attr('listing');
		}
		if(listing == true){
			var action = $(e.currentTarget).attr('data-action');
			var title = $(e.currentTarget).attr('data-title');
			var controller = $(e.currentTarget).attr('data-controller');
			var content = $(e.currentTarget).attr('data-content');
			$('.menu-tabs').find('li').removeClass('active');
			if($('.menu-tabs').find('li').find('a[href="#'+action+'"]').length == 0){
				var tab = '<li class="active"><a data-toggle="pill" href="#'+action+'" data-controller="' +controller + '" data-content="' +content+ '">'+title+'</li>';
				$('.menu-tabs').append(tab);
			}
		
			//nav-tabs event binding
			$('.menu-tabs').find('li').find('a').unbind().bind('click', function(e){
				this.HandleEvents(e);
			}.bind(this));
			$('.menu-tabs').find('li').find('a[href="#'+action+'"]').click();
			window.location.hash = $(e.currentTarget).attr('id');
		}
		else{
			//No listing required, directly open modal for edit
			var controller = $(e.currentTarget).attr('data-controller');
			LoadCSS(controller);
			LoadJS(controller, function(){
				controller = controller + "Controller";
				eval("new " + controller + "()");
			});
		}
	}.bind(this));
	//Click Dashboard on page load
	var hash = window.location.hash;
	if(hash == ""){
		$(this.view).find('ul').find('li#menuDashboard').click();
	}
	else{
		//$('.modal').modal('hide');
		$(this.view).find('ul').find('li'+hash).click();
	}
	$('.brand-logo').find('img').unbind().bind('click', function(){
		$(this.view).find('ul').find('li#menuDashboard').click();
	}.bind(this));
};
menuController.prototype.HandleEvents = function(e)
{
	var href = $(e.currentTarget).attr('href');
	var data_action = href.substring(1);
	var data_controller = $(e.currentTarget).attr('data-controller');
	var data_content = $(e.currentTarget).attr('data-content');
	$(this.view).find('ul').find('li').removeClass('active');
	$(this.view).find('ul').find('li[data-action="'+data_action+'"]').addClass('active');
	
	$('.menu-tabs').find('li').removeClass('active');
	$(e.currentTarget).parents('li').addClass('active');
	LoadCSS(data_controller);
	LoadJS(data_controller, function(){
		var controller = data_controller + "Controller";
		eval("new " + controller + "('"+data_content+"')");
	});
	console.log($(e.currentTarget).attr('href'));
};