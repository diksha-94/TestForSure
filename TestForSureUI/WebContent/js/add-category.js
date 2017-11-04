var addCategoryRules = {
    'txtCategoryName': {
		number: false
    }
};
	
$('#addCtegoryForm').validate({
    rules: addCategoryRules,

    ignore: false,
    highlight: function () {
        // to remove the red alert on text 
    },
    submitHandler: function () {
		console.log("Inside add category submit");
		var addCategory_url = "http://13.126.161.84:8083/test-for-sure/test/add-category";
        var type = 'POST';
        var requestData = {};
		requestData.category = $('#txtCategory').val();
		
        $.ajax({
            url: addCategory_url,
            type: type,
			data: JSON.stringify(requestData),
			contentType: 'application/json',
			//dataType: 'json',
            success: function (response) {
                if (response.status) {
					console.log("Category added successfully");
					$('#txtCategory').val('');
					getAllCategories();
                }
                else if (!response.status) {
                    console.log("Error in addingcategory. Message: "+response.message);
                }
                
            },
            error: function () {
                console.log("Service is unavailable");
            }
           
        });
    }

});

function getAllCategories(){
	$("#existingCategories").empty();
	$.ajax({
                url: "http://13.126.161.84:8083/test-for-sure/test/get-category",
                type: "GET",
                
                dataType: 'json',
                success: function (result) {
					if(result.status){
						var categories=[];
						categories.push("<ol>");
						$.each(result.categoryList, function(i,cat){
							var newList = "<li>"+cat.category+"</li>";
							categories.push(newList);
							
						})
						categories.push("</ol>");
						$("#existingCategories").append(categories);
					}
					else if(!result.status){
						console.log("Error: "+result.status);
					}
                },
                error: function () {
					console.log("Error in getting test categories");
                }
            });
}

$(document).ready(function () {
	console.log("Document is ready");
	
	//to get the test categories on load
	getAllCategories();	
})

