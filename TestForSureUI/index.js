var indexController = function(){
	this.pageType = ""; //controller
	this.pageId = -1;   //id
	this.response = {};
	this.Init();
};
indexController.prototype.Init = function()
{
	console.log("Initialized !!");
	var urlKey = window.location.pathname;
	urlKey = urlKey != '/' ? urlKey.substring(1, urlKey.length) : urlKey;
	fetch(remoteServer+'/test2bsure/getpagedetails?urlKey='+urlKey)
	  .then(response => response.json())
	  .then(data => this.SetState({ pageType: data.pageType, pageId: data.pageId, response: data.response }));
};
indexController.prototype.SetState = function(obj)
{
	for(var key in obj){
		this[key] = obj[key];
	}
	LoadJS('WebContent/Portal/ReusableFunctions/Constants', function(){
		if(!this.response.status){
			this.pageType = "notfound";
		}
		this.DisplayPage();
	}.bind(this));
};
indexController.prototype.DisplayPage = function()
{
	var self = this;
	LoadCSS('WebContent/Portal/ReusableFunctions/common');
	LoadJS('WebContent/Portal/ReusableFunctions/test2bsure', function(){
		if(self.pageType == "test"){
			var reportQuery = test2bsureController.getObj().QueryString(window.location.href, 'report');
			var solutionQuery = test2bsureController.getObj().QueryString(window.location.href, 'solution');
			var leaderboardQuery = test2bsureController.getObj().QueryString(window.location.href, 'leaderboard');
			if(typeof leaderboardQuery != 'undefined'){
				self.pageType = "leaderboard";
			}
			else if(typeof reportQuery != 'undefined' || typeof solutionQuery != 'undefined'){
				self.pageType = "testreport";
			}
		}
		self.originalPageType = self.pageType;
		if(headermenu.indexOf(self.originalPageType) > -1){
			//Load header
			test2bsureController.getObj().GetHeader(".common-header", function(){
				self.pageType = pageMapping[self.pageType] == "default" ? self.pageType : pageMapping[self.pageType];
				
				LoadCSS('WebContent/Portal/css/'+self.pageType);
				
				LoadJS('WebContent/Portal/controller/'+self.pageType, function(){
					eval("new " + self.pageType + "Controller("+self.pageId+")");
				});
			});
		}
		else{
			self.pageType = pageMapping[self.pageType] == "default" ? self.pageType : pageMapping[self.pageType];
			
			LoadCSS('WebContent/Portal/css/'+self.pageType);
			
			LoadJS('WebContent/Portal/controller/'+self.pageType, function(){
				eval("new " + self.pageType + "Controller("+self.pageId+")");
			});
		}
		if(footercontent.indexOf(self.originalPageType) > -1){
			//Load footer
			test2bsureController.getObj().GetFooter(".common-footer");
		}
	});
};