var asknanswerController = function(){
	this.connect = "http://localhost:8086/asknanswer/post/";
	this.posts = {};
	this.state = 0;
	this.Init();
};
asknanswerController.prototype.Init = function()
{
	console.log('Initiate Ask n Answer');
	//showLoader();
	this.LoadView();
	this.LoadData();
	this.BindEvents();
};
asknanswerController.prototype.BindEvents = function()
{
	
};
asknanswerController.prototype.LoadView = function()
{
	var html = "<div class='menu-bar col-xs-12 col-sm-12 col-md-12 col-lg-12'>"+
					"<div class='col-xs-7 col-sm-7 col-md-7 col-lg-7 searchbar'>"+
						"<span>Search: </span> <input type='text' placeholder='by Name/Title' id='txtSearchCategory'/>"+
						"<button id='btnSearchAsk' class='btn btn-primary'>Search</button>"+
					"</div>"+
				"</div>"+
				"<div class='counter col-xs-12 col-sm-12 col-md-12 col-lg-12'>"+
					"<div class='col-xs-4 col-sm-4 col-md-4 col-lg-4 itemCount'>"+
						"Total Posts - <span></span>"+
					"</div>"+
					"<div class='col-xs-5 col-sm-5 col-md-5 col-lg-5'>"+
					"</div>"+
					"<div class='col-xs-3 col-sm-3 col-md-3 col-lg-3 paginationDiv'>"+
					"</div>"+
				"</div>"+
				"<div class='asknanswer'>"+
					"<table>"+
						"<thead>"+
							"<tr class='table-header'>"+
								"<th class='col-md-1'>id</th>"+
								"<th class='col-md-2'>Post Content</th>"+
								"<th class='col-md-2'>Exam</th>"+
								"<th class='col-md-4'>User</th>"+
								"<th class='col-md-3'>Action</th>"+
							"</tr>"+
						"</thead>"+
						"<tbody>"+
							
						"</tbody>"+
					"</table>"+
				"</div>";
	$('.menu-page-content').html(html);
};
asknanswerController.prototype.LoadData = function()
{
	var url = this.connect + 'get?foradmin=1';
	fetch(url)
	  .then(response => response.json())
	  .then(data => this.SetState({ posts: data.result, state: data.state }));
}
asknanswerController.prototype.SetState = function(obj)
{
	for(var key in obj){
		this[key] = obj[key];
	}
	this.PopulatePosts();
};
asknanswerController.prototype.PopulatePosts = function()
{
	console.log(this.posts);
};