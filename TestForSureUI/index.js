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
}

function readSingleFile() {
	$('body').load("WebContent/Portal/view/home.html");R
    //Retrieve the first (and only!) File from the FileList object
    /*var f = "WebContent/Portal/view/home.html";

    if (f) {
        var r = new FileReader();
        r.onload = function (e) {
            var contents = e.target.result;
            console.log(contents);
        }
        r.readAsText(f);
    } else {
        alert("Failed to load file");
    }*/
}

function load_home() {
    document.getElementById("content").innerHTML='<object type="text/html" data="WebContent/Portal/view/home.html" ></object>';
}