var dashboardController = function(){
	this.userProfile = {};
	this.userRewards = {};
	this.userAttempts = {};
	this.userId = -1;
	this.Init();
};
dashboardController.prototype.Init = function()
{
	//Load header
	test2bsureController.getObj().GetHeader(".dashboard-header", function(){
		if(typeof userController != 'undefined' && typeof userController.getObj() != 'undefined' && (typeof userController.getObj().userData != 'undefined' && userController.getObj().userData != null) && typeof userController.getObj().userData.id != 'undefined'){
			this.userId = userController.getObj().userData.id;
		}
		if(this.userId == -1){
			//Show not logged in msg
			$('.dashboard-content').html($('<h4>You are not logged in !!</h4>'));
			$('.common-footer').css('top',$('.common-header').height() + $('.common-content').height()+'px');
		}
		else{
			this.LoadUserProfile();
			this.LoadUserRewards();
			this.LoadUserAttempts();
		}
	}.bind(this));
	
	//Load footer
	test2bsureController.getObj().GetFooter(".dashboard-footer");
};
dashboardController.prototype.LoadUserProfile = function()
{
	fetch(remoteServer+'/test2bsure/user-profile?userId='+this.userId)
	  .then(response => response.json())
	  .then(data => this.SetState({ userProfile: data.userDetails }, 'profile'));
}
dashboardController.prototype.LoadUserRewards = function()
{
	fetch(remoteServer+'/test2bsure/user-rewards?userId='+this.userId)
	  .then(response => response.json())
	  .then(data => this.SetState({ userRewards: data.rewards }, 'rewards'));
}
dashboardController.prototype.LoadUserAttempts = function()
{
	fetch(remoteServer+'/test2bsure/user-profile?userId='+this.userId)
	  .then(response => response.json())
	  .then(data => this.SetState({ userAttempts: data.userAttempts }, 'attempts'));
}
dashboardController.prototype.SetState = function(obj, callFunc)
{
	for(var key in obj){
		this[key] = obj[key];
	}
	switch(callFunc){
		case "profile":
			this.PopulateUserProfile();
			break;
		case "rewards":
			this.PopulateUserRewards();
			break;
		case "attempts":
			this.PopulateUserAttempts();
			break;
	}
	$('.common-footer').css('top',$('.common-header').height() + $('.common-content').height()+'px');
};
dashboardController.prototype.PopulateUserProfile = function()
{
	console.log("Populating User Profile");
};
dashboardController.prototype.PopulateUserRewards = function()
{
	console.log("Populating User Rewards");
};
dashboardController.prototype.PopulateUserAttempts = function()
{
	console.log("Populating User Attempts");
};