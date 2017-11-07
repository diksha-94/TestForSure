var addSubcategoryRules = {
    'txtSubcategoryName': {
		number: false
    }
};
	
$('#addSubcategoryForm').validate({
    rules: addSubcategoryRules,

    ignore: false,
    highlight: function () {
        // to remove the red alert on text 
    },
    submitHandler: function () {
		console.log("Inside add sub category submit");
		var addSubcategory_url = serviceIp+"/test-for-sure/test/add-subcategory";
        var type = 'POST';
        var requestData = {};
		requestData.cat_id = $('#ddCategoryAdd').val();
		requestData.subcategory = $('#txtSubcategory').val();
		
        $.ajax({
            url: addSubcategory_url,
            type: type,
			data: JSON.stringify(requestData),
			contentType: 'application/json',
			//dataType: 'json',
            success: function (response) {
                if (response.status) {
					console.log("Sub Category added successfully");
					$('#txtSubcategory').val('');
					getSubcategories($('#ddCategory').val());
                }
                else if (!response.status) {
                    console.log("Error in adding sub category. Message: "+response.message);
                }
                
            },
            error: function () {
                console.log("Service is unavailable");
            }
           
        });
    }

});

function getAllCategories(){
	$.ajax({
                url: serviceIp+"/test-for-sure/test/get-category",
                type: "GET",
                
                dataType: 'json',
                success: function (result) {
					if(result.status){
						var categories=[];
						$.each(result.categoryList, function(i,cat){
							var newOption = "<option value='"+cat.id+"'> "+cat.category+"</option>";
							categories.push(newOption);
							
						})
						$("#ddCategory").html(categories);
						$("#ddCategoryAdd").html(categories);
						getSubcategories($('#ddCategory').val());
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

function getSubcategories(categoryId){
				console.log("Selected Category: "+categoryId);
				
				$.ajax({
                url: serviceIp+"/test-for-sure/test/get-subcategory?categoryId="+categoryId,
                type: "GET",
                
                dataType: 'json',
                success: function (result) {
					if(result.success){
						var subcategories=[];
						$.each(result.subcategoryList, function(i,subcat){
							var newOption = "<option value='"+subcat.id+"'> "+subcat.subcategory+"</option>";
							subcategories.push(newOption);
							
						})
						$("#ddSubcategory").html(subcategories);
					}
					else if(!result.status){
						//means 0 records found
						console.log("Error: "+result.status);
						$("#ddSubcategory").html('');
					}
                },
                error: function () {
					console.log("Error in getting test subcategories");
                }
            });
}
$(document).ready(function () {
	console.log("Document is ready");
	
	//to get the test categories on load and populate in category dropdown
	         getAllCategories();
			 
			//to get the subcategories on change of category
			$("#ddCategory").on('change',function() {
				getSubcategories($(this).val());
			});
	
})

