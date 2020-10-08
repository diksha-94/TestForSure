var indexController = function(){
	this.Init();
};
indexController.prototype.Init = function()
{
	console.log("Initialized !!");
	var path = window.location.pathname;
	var controller = "home";
	if(path == "/"){
		controller = "home";
	}
	else if(path == "dsssb"){
		controller = "exam";
	}
	LoadCSS('WebContent/Portal/ReusableFunctions/common');
	LoadCSS('WebContent/Portal/css/'+controller);
	LoadJS('WebContent/Portal/ReusableFunctions/test2bsure', function(){
		LoadJS('WebContent/Portal/controller/'+controller, function(){
			controller = controller + "Controller";
			eval("new " + controller + "()");
		});
	});
};