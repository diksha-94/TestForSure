
$('#linkLogout').on('click', function(){
	localStorage.clear();
	window.location.href = 'home.html';
})
function getExistingNews(){
	var type='GET';
		var getAllNews_url = "http://localhost:8083/test-for-sure/news-notifications/get-all-news";
        $.ajax({
            url: getAllNews_url,
            type: type,
			contentType: 'application/json',
			success: function (result) {
                if (result.response.status) {
					console.log("Got News successfully: "+JSON.stringify(result));
					
					for(var i=0;i<(result.news).length;i++){
						var news = newsStructure((result.news)[i].id, (result.news)[i].headline, (result.news)[i].detail);
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

function newsStructure(id, headline, detail){
	var data = detail;
	console.log("HTML data: "+data);
	//console.log("Text data: "+data.text());
	var tag = document.createElement('div');
    tag.innerHTML = detail;
    
    data = tag.innerText;
	var len = data.length;
	console.log("")
	if(len<=200){
	
	}
	else if(len>200){
		len=200;
	}
	var structure = "<div class='ind-news-div'><span style='display:inline-block;' class='glyphicon glyphicon-menu-right'></span>"
					+"<a style='display:inline-block;' target='_blank' id='news-"+id+"' href='news-detail.html?id="+id+"' target='_blank'><span class='news-headline'>"+headline+"</span></a></br>"
					+"<span class='news-detail'>"+data.substring(0,len)+"...<a href='news-detail.html?id="+id+"' target='_blank'>Read More</a></span></div>";
	return structure;
}

$(document).ready(function () {
	console.log("Document is ready");
	getExistingNews();

	//localStorage.clear();
	
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
	
})

