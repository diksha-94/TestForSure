var obj = null;
var test2bsureController = function(){
	this.userData = null;
};
test2bsureController.getObj = function()
{
	if(obj == null){
		obj = new test2bsureController();
	}
	return obj;
};
test2bsureController.prototype.GetHeader = function(dom){
	//should make it custom , as per the need on different pages
	$(dom).load('header.html', function(){
		
	}.bind(this));
	//$(dom).html("<div> TEST2BSURE Header </div>");
}
test2bsureController.prototype.GetFooter = function(dom){
	//should make it custom , as per the need on different pages
	$(dom).load('footer.html', function(){
		
	}.bind(this));
	//$(dom).html("<div> TEST2BSURE Footer </div>");
}
test2bsureController.prototype.QueryString = function(url, key){
	var queryString = url.split('?')[1];
	var queryParam = queryString.split('&');
	for(var query in queryParam){
		var key1 = queryParam[query].split('=')[0];
		if(key1 == key){
			return queryParam[query].split('=')[1];
		}
	}
};
test2bsureController.prototype.ValidateEmail = function(email){
	 var regEx = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
	 if(regEx.test(email)){
		 return true;
	 }
	 return false;
};