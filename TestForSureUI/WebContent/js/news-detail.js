var newsId;

function getNewsById(id){
	var type='GET';
		var getNews_url = serviceIp+"/test-for-sure/news-notifications/get-news?newsId="+id;
        $.ajax({
            url: getNews_url,
            type: type,
			contentType: 'application/json',
			success: function (result) {
                if (result.response.status) {
					console.log("Got News successfully: "+JSON.stringify(result));
					
						$('#news-head').append((result.news)[0].headline);
						$('#detail').append((result.news)[0].detail);
						
					
				}
                else if (!result.response.status) {
					console.log("Error in getting News");
                }
                
            },
            error: function () {
                console.log("Service is unavailable");
            }
           
        });
}
function getQueryParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}
function getExistingNews(){
	var type='GET';
		var getAllNews_url = serviceIp+"/test-for-sure/news-notifications/get-all-news";
        $.ajax({
            url: getAllNews_url,
            type: type,
			contentType: 'application/json',
			success: function (result) {
                if (result.response.status) {
					console.log("Got News successfully: "+JSON.stringify(result));
					
					for(var i=0;i<(result.news).length;i++){
						var news = newsStructure((result.news)[i].id, (result.news)[i].headline);
						$('#news').append(news);
					}
				}
                else if (!result.response.status) {
					console.log("Error in getting News");
                }
                
            },
            error: function () {
                console.log("Service is unavailable");
            }
           
        });
}

function newsStructure(id, headline){
	var structure = "<div style='margin-top:20px;margin-left:20px;'><span style='display:inline-block;' class='glyphicon glyphicon-menu-right'></span>"
					+"<a style='display:inline-block;' class='news-link' target='_blank' id='news-"+id+"' href='news-detail.html?id="+id+"' onmouseout='linkWhiteColor();'>"+headline+"</a></div>";
	return structure;
}
function linkWhiteColor(){
	$('.news-link').css('color','white');
}
$(document).ready(function () {
	console.log("Document is ready");
	
	console.log("Logged in: "+localStorage.getItem('loggedIn'));
	if(localStorage.getItem('loggedIn') == "true"){
		//means the user is logged in
		$('#loggedInUSer').text(" "+localStorage.getItem('username'));
		$('#menuLogin').addClass('hide');
		$('#menuLogin').removeClass('show');
		$('#menuLogout').removeClass('hide');
		$('#menuLogout').addClass('show');
		$('#userProfile').removeClass('hide');
		$('#userProfile').addClass('show');
	}
	else{
		$('#menuLogin').removeClass('hide');
		$('#menuLogin').addClass('show');
		$('#menuLogout').addClass('hide');
		$('#menuLogout').removeClass('show');
		$('#userProfile').addClass('hide');
		$('#userProfile').removeClass('show');
	}
	newsId = getQueryParameterByName('id');
	console.log("News Id: "+newsId);
	getExistingNews();
	getNewsById(newsId);
})
