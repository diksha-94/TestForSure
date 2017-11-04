// Setting Rules for addNewsForm Validations
	
$('#btnAddNews').on('click', function(){
	
	console.log("Inside add news");
		var headline = $("#txtHeadline").val();
		var detail = $("#txtDetail").val();
		if(headline == '' || detail == ''){
			 $('#errorOuter').removeClass("hide");
			 $('#errorOuter').addClass("show");
			 $('#errorMessage').removeClass("alert-success");
	 	     $('#errorMessage').addClass("alert-danger");
		     $('#errorMessage').html("Please enter all the mandatory fields");
		}
		else{
			 $('#errorOuter').removeClass("show");
			 $('#errorOuter').addClass("hide");
		
        var addNews_url = "http://13.126.161.84:8083/test-for-sure/news-notifications/insert-news";
        var type = 'POST';
        var requestData = {};
		requestData.headline=headline;
		requestData.detail=detail;
		
		console.log(JSON.stringify(requestData));
		
        $.ajax({
            url: addNews_url,
            type: type,
			data: JSON.stringify(requestData),
			contentType: 'application/json',
			success: function (response) {
                if (response.status) {
					$('#errorOuter').removeClass("hide");
					$('#errorOuter').addClass("show");
					$('#errorMessage').removeClass("alert-danger");
					$('#errorMessage').addClass("alert-success");
					$('#errorMessage').html(response.message);
					$('#txtHeadline').summernote('code', '');
					$('#txtDetail').summernote('code', '');
					getExistingNews();
					
					console.log("News added successfully");
				}
                else if (!response.status) {
                    $('#errorOuter').removeClass("hide");
					$('#errorOuter').addClass("show");
					$('#errorMessage').removeClass("alert-success");
					$('#errorMessage').addClass("alert-danger");
					$('#errorMessage').html(response.message);
					console.log("Error in adding News");
                }
                
            },
            error: function () {
                console.log("Service is unavailable");
            }
           
        });
		}

});
	
$('#btnUpdateSubmit').on('click', function(){
	
	console.log("Inside update news");
	var id = ((localStorage.getItem('updateButtonId')).split('-'))[1];
		var headline = $("#txtNewsHeadUpdate").val();
		var detail = $("#txtNewsDetailUpdate").val();
		console.log("Headline: "+headline);
		console.log("Detail: "+detail);
		if(headline == '' || detail == ''){
			 $('#errorOuterUpdate').removeClass("hide");
			 $('#errorOuterUpdate').addClass("show");
			 $('#errorMessageUpdate').removeClass("alert-success");
	 	     $('#errorMessageUpdate').addClass("alert-danger");
		     $('#errorMessageUpdate').html("Please enter all the mandatory fields");
		}
		else{
			 $('#errorOuterUpdate').removeClass("show");
			 $('#errorOuterUpdate').addClass("hide");
		
        var updateNews_url = "http://13.126.161.84:8083/test-for-sure/news-notifications/update-news";
        var type = 'PUT';
        var requestData = {};
		requestData.id = id;
		requestData.headline=headline;
		requestData.detail=detail;
		
		console.log(JSON.stringify(requestData));
		
        $.ajax({
            url: updateNews_url,
            type: type,
			data: JSON.stringify(requestData),
			contentType: 'application/json',
			success: function (response) {
                if (response.status) {
					console.log("News updated successfully");
					getExistingNews();
				}
                else if (!response.status) {
                    $('#errorOuterUpdate').removeClass("hide");
					$('#errorOuterUpdate').addClass("show");
					$('#errorMessageUpdate').removeClass("alert-success");
					$('#errorMessageUpdate').addClass("alert-danger");
					$('#errorMessageUpdate').html(response.message);
					console.log("Error in updating News");
                }
                
            },
            error: function () {
                console.log("Service is unavailable");
            }
           
        });
		}

});

function newsStructure(id, headline){
	console.log("id: "+id);
	console.log("headline: "+headline);
	var newNews = "<div style='border:solid 1px red ; width:80% ; text-align:center ; clear:both;'>"+
							"<div style='float:left;width:10%;'>"+id+"</div>"+
							"<div id='"+id+"' style='float:left;width:70%;cursor:pointer;'>"+(headline)+"</div>"+
							"<div style='float:left;width:10%;'><button type='button' id='edit-"+id+"' onclick='editNews(id)'  data-toggle='modal' data-target='#updateNewsModal' class='btn btn-default' >Edit</button></div>"+
							"<div style='float:left;width:10%;'><button type='button' id='delete-"+id+"' onclick='deleteNews(id)' data-toggle='modal' data-target='#deletNewsModal' class='btn btn-default' >Delete</button></div>"+
			   		  "</div>";
					  
	return newNews;
}
function editNews(id){
	console.log("Id: "+id);
	localStorage.setItem('updateButtonId',id);
	var type='GET';
	var newsId = (id.split('-'))[1];
	var getNews_url = "http://13.126.161.84:8083/test-for-sure/news-notifications/get-news?newsId="+newsId;
        $.ajax({
            url: getNews_url,
            type: type,
			contentType: 'application/json',
			success: function (result) {
                if (result.response.status) {
					console.log("Got News successfully: "+JSON.stringify(result));
					console.log("Headline: "+((result.news)[0]).headline);
					$('#txtNewsHeadUpdate').summernote('code', ((result.news)[0]).headline);
					$('#txtNewsDetailUpdate').summernote('code', ((result.news)[0]).detail);
				}
                else if (!response.status) {
					console.log("Error in getting News");
                }
                
            },
            error: function () {
                console.log("Service is unavailable");
            }
           
        });
}

function deleteNews(id){
	console.log("Id: "+id);
	localStorage.setItem('deleteButtonId',id);
}
function getExistingNews(){
	$('#existingNews').empty();
	var type='GET';
		var getAllNews_url = "http://13.126.161.84:8083/test-for-sure/news-notifications/get-all-news";
        $.ajax({
            url: getAllNews_url,
            type: type,
			contentType: 'application/json',
			success: function (result) {
                if (result.response.status) {
					console.log("Got News successfully");
					for(var i=0;i<(result.news).length;i++){
						var news = newsStructure((result.news)[i].id, (result.news)[i].headline);
						$('#existingNews').append(news);
					}
				}
                else if (!response.status) {
					console.log("Error in getting News");
                }
                
            },
            error: function () {
                console.log("Service is unavailable");
            }
           
        });
}
$('#btnYes').on('click', function(){
	var id = ((localStorage.getItem('deleteButtonId')).split('-'))[1];
	var type='PUT';
	var deleteNews_url = "http://13.126.161.84:8083/test-for-sure/news-notifications/delete-news?newsId="+id;
	$.ajax({
            url: deleteNews_url,
            type: type,
			contentType: 'application/json',
			success: function (response) {
                if (response.status) {
					console.log("News deleted successfully");
					alert("Deleted !!");
					getExistingNews();
				}
                else if (!response.status) {
					console.log("Error in getting News");
					alert(response.message);
                }
                
            },
            error: function () {
                console.log("Service is unavailable");
            }
           
        });
})
$(document).ready(function () {
	console.log("Document is ready");
	getExistingNews();
	
	$('.editor').summernote();
})

