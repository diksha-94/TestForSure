var leaderboardController = function(){
	this.testInfo = {};
	this.data = null;
	this.type = "test";
	this.id = 0;
	this.Init();
};
leaderboardController.prototype.Init = function()
{
	//Load header
	test2bsureController.getObj().GetHeader(".leaderboard-header");
	//Read id from query string
	this.type = test2bsureController.getObj().QueryString(window.location.href, 'type');
	this.id = test2bsureController.getObj().QueryString(window.location.href, 'id');
	this.LoadData();
	//Load footer
	test2bsureController.getObj().GetFooter(".leaderboard-footer");
};
leaderboardController.prototype.LoadData = function()
{
	var self = this;
	fetch(remoteServer+'/test2bsure/test?id='+this.id)
	  .then(response => response.json())
	  .then(data => this.SetState({ testInfo: data }, false, function(){
		  fetch(remoteServer+'/test2bsure/leaderboard?type='+self.type+'&id='+self.id)
		  .then(response => response.json())
		  .then(data => self.SetState({ data: data }, true));
	  }));
}
leaderboardController.prototype.SetState = function(obj, populateData, callback)
{
	populateData = typeof populateData != 'undefined' ? populateData : false;
	for(var key in obj){
		this[key] = obj[key];
	}
	if(populateData){
		this.PopulateLeaderboard();
	}
	if(typeof callback == 'function'){
		callback();
	}
};
leaderboardController.prototype.PopulateLeaderboard = function()
{
	$('.leaderboard-outer').find('.leaderboard-heading').find('h4').html("Leaderboard for "+this.testInfo.data[0].title);
	$('.leaderboard-outer').find('.leaderboard-heading').append("<span>  ("+this.data.leaderboard.length+" ATTEMPTS)</span>");
	$('.leaderboard-outer').find('.marks').append(" (OUT OF "+this.testInfo.data[0].totalMarks+")");
	if(this.type == "quiz"){
		$('.leaderboard-outer').find('.time').remove();
	}
	var html = "";
	for(var leader in this.data.leaderboard){
		var data = this.data.leaderboard[leader];
		var timeTaken = data.timeTaken;
		if(timeTaken > this.testInfo.data[0].totalTime * 60){
			timeTaken = this.testInfo.data[0].totalTime * 60;
		}
		html += "<tr>"+
					"<td>"+data.rank+"</td>"+
					"<td class='name'>"+data.username+"</td>"+
					"<td>"+data.marksScored+"</td>";
		if(this.type != "quiz"){
			html += "<td>"+Math.round(timeTaken/60, 2)+"</td>"+
				"</tr>";
		}
	}
	$('.table1').find('tbody').html(html);
};