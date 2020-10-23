var jsVersion = 100;
var cssVersion = 100;
//var remoteServer = "http://3.6.58.203:8083";
var remoteServer = "http://localhost:8083";

function LoadCSS(filename) {
	var id = "CSS_" + filename.replace(/[^a-zA-Z0-9_]+/, "_").replace(".", "_");
	if (!document.getElementById(id)) {
		link = document.createElement('link');
		link.id = id;
		link.type = 'text/css';
		link.rel = 'stylesheet';
		link.href = filename + ".css?v="+cssVersion;
		document.head.appendChild(link);
	}
};

function LoadJS(src, callback) {
	var id = "JS_" + src.replace(/[^a-zA-Z0-9_]+/, "_").replace(".", "_");
	if (!document.getElementById(id)) {
		var s = document.createElement('script');
		s.id = id;
		s.src =  src + ".js?v="+jsVersion;
		s.async = true;
		s.onreadystatechange = s.onload = function() {
			if ( typeof this.callback != 'undefined') {
				this.callback();
			}
		}.bind({
			obj : s,
			callback : callback
		});
		document.getElementsByTagName('head')[0].appendChild(s);
	} else {
		if ( typeof callback !== "undefined") {
			callback.done = true;
			callback();
		}
	}
};