var indexController = function(){
	this.pageType = ""; //controller
	this.pageId = -1;   //id
	this.Init();
};
indexController.prototype.Init = function()
{
	console.log("Initialized !!");
	var urlKey = window.location.pathname;
	fetch(remoteServer+'/test2bsure/getpagedetails?urlkey='+urlKey)
	  .then(response => response.json())
	  .then(data => this.SetState({ pageType: data.pageType, pageId: data.pageId }));
};
indexController.prototype.SetState = function(obj)
{
	for(var key in obj){
		this[key] = obj[key];
	}
	LoadJS('WebContent/Portal/ReusableFunctions/Constants', function(){
		this.DisplayPage();
	}.bind(this));
};
indexController.prototype.DisplayPage = function()
{
	this.pageType = "test";
	this.pageId = 99317;
	var self = this;
	LoadCSS('WebContent/Portal/ReusableFunctions/common');
	LoadJS('WebContent/Portal/ReusableFunctions/test2bsure', function(){
		if(headermenu.indexOf(self.pageType) > -1){
			//Load header
			test2bsureController.getObj().GetHeader(".common-header");
		}
		self.pageType = pageMapping[self.pageType] == "default" ? self.pageType : pageMapping[self.pageType];
		
		LoadCSS('WebContent/Portal/css/'+self.pageType);
		
		LoadJS('WebContent/Portal/controller/'+self.pageType, function(){
				eval("new " + self.pageType + "Controller("+self.pageId+")");
		});
		if(footercontent.indexOf(self.pageType) > -1){
			//Load footer
			test2bsureController.getObj().GetFooter(".common-footer");
		}
	});
};