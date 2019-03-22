var leaderboardController = function(){
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
	fetch(remoteServer+'/test2bsure/leaderboard?type='+this.type+'&id='+this.id)
	  .then(response => response.json())
	  .then(data => this.SetState({ data: data }));
}
leaderboardController.prototype.SetState = function(obj)
{
	for(var key in obj){
		this[key] = obj[key];
	}
	this.PopulateLeaderboard();
};
leaderboardController.prototype.PopulateLeaderboard = function()
{
	$('.leaderboard-outer').find('.leaderboard-heading').find('h4').html("Leaderboard for "+this.data.title);
	$('.leaderboard-outer').find('.leaderboard-heading').append("<span>  ("+this.data.leaderboard.length+" ATTEMPTS)</span>");
	$('.leaderboard-outer').find('.marks').append(" (OUT OF "+this.data.totalScore+")");
	if(this.type == "quiz"){
		$('.leaderboard-outer').find('.time').remove();
	}
	var html = "";
	for(var leader in this.data.leaderboard){
		var data = this.data.leaderboard[leader];
		html += "<tr>"+
					"<td>"+data.rank+"</td>"+
					"<td class='name'>"+data.username+"</td>"+
					"<td>"+data.marksScored+"</td>";
		if(this.type != "quiz"){
			html += "<td>"+Math.round(data.timeTaken/60, 2)+"</td>"+
				"</tr>";
		}
	}
	$('.table1').find('tbody').html(html);
};
$(document).ready(function () {
	new leaderboardController();
});
