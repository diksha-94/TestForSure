function showTests(categoryId, subCatId){
	$('#tests').empty();
	console.log("Category id: "+categoryId);
	console.log("Subcategory id: "+subCatId);
	var url = serviceIp+"/test-for-sure/test/get-tests-bystatus?categoryId="+categoryId+"&subCatId="+subCatId;
	$.ajax({
                url: url,
                type: "GET",
                
                dataType: 'json',
                success: function (result) {
					if(result.status){
						if(result.testDetails != null) {
							console.log(JSON.stringify(result.testDetails));
							$.each(result.testDetails, function(i, test) {
								var btnId = 'btnTest-'+test.id;
								var query_string = 'test_id='+btnId;
								var image_path = "'"+test.imagePath+"'";
								
												
								var newTest = "<div class='outer-test-div'>"+
												"<div class='col-md-3 float-left'>"+
												"<img class='test-image' src="+image_path+"/>"+
												"</br><h3 class='test-title'>"+test.testTitle+"</h3>"+
												"</div>"+
												"<div class='col-md-1.5 float-left max-marks'>"+
												"<span>Maximum Marks"+
												"</span></br>"+
												"<span>"+test.no_of_ques*test.correct_ques_marks+
												"</span>"+
												"</div>"+
												"<div class='col-md-2.75 float-left margin-top-30 margin-left-10 div-width'>"+
												"<span class='glyphicon glyphicon-th-list'></span><label class='clear-both test-size'>&nbsp;Number of Questions: </label><span class='test-size'>"+test.no_of_ques+"</span>"+
												"</br><span class='glyphicon glyphicon-time'></span><label class='clear-both test-size'>&nbsp;Time Limit(in mins): </label><span class='test-size'>"+test.time_limit+"</span>"+
												"</div>"+
												"<div class='col-md-2.75 float-left margin-top-30 div-width'>"+
												"<span class='glyphicon glyphicon-ok-sign'></span><label class='clear-both test-size'>&nbsp;Correct Question Marks: </label><span class='test-size'>"+test.correct_ques_marks+"</span>"+
												"</br><span class='glyphicon glyphicon-minus-sign'></span><label class='clear-both test-size'>&nbsp;Negative marks: </label><span class='test-size'>"+test.negative_marks+"</span>"+
												"</div>"+
												"<div class='col-md-2 float-left margin-top-40'><a id="+btnId+" onclick='checkAlreadyAttempted(id)' href='javascript:void(0);' class='btn btn-default btn-block btn-primary'>TAKE TEST</a></div>"
												"</div>";
												"</div>";
								$('#tests').append(newTest);
								if(i == 6){
									var ad = "<div class='outer-test-ad'>"+
											"<ins class='adsbygoogle' style='display:block;width:100%;' data-ad-format='fluid' data-ad-layout-key='-fm+5r+6l-ft+4e' data-ad-client='ca-pub-1988549768988881' data-ad-slot='9540632733'></ins>"+
											"<script>"+
											"(adsbygoogle = window.adsbygoogle || []).push({});"+
											"</script>"+
											"</div>";
											$('#tests').append(ad);
								}
							});
							
						}
					}
					else if(!result.status){
						console.log("Error: "+result.message);
					}
                },
                error: function () {
					console.log("Error in getting test details");
                }
            });
}

//Check if the test is already attempted or not
function checkAlreadyAttempted(id){
	console.log("Take test id: "+id);
	var query_string = 'test_id='+id;
	var test_id = ((id).split('-'))[1];
	
	var loggedIn = localStorage.getItem("loggedIn");
	if(loggedIn){
		var emailid = localStorage.getItem('email');
		console.log("Email id: "+emailid);
		var type='GET';
		var url =serviceIp+'/test-for-sure/test/test-already-attempted?test_id='+test_id+'&email_id='+emailid;
		$.ajax({
            url: url,
            type: type,
			contentType: 'application/json',
			//dataType: 'json',
            success: function (result) {
                if (result.status) {
					//Status true means user is authenticated successfully.
					console.log("Result: "+JSON.stringify(result));
					window.location.href = "start-test-already-attempted.html?test_id="+id;
			    }
                else if (!result.status) {
					console.log("Result: "+JSON.stringify(result));
					window.location.href="start-test-option.html?"+query_string;
                }
                
            },
            error: function () {
                console.log("Service is unavailable");
            }
           
		});
	}
	else{
		//User not logged in
		window.location.href="start-test-option.html?"+query_string;
	}
}
$('#linkLogout').on('click', function(){
	localStorage.clear();
	window.location.href = 'home.html';
})
//On click of a Start Test button
/*$('input').on('click', function(){
	document.href('start-test.html');
})*/
$(document).ready(function () {
	console.log("Document show-tests is ready");
	
	
	//to get the test details
	         $.ajax({
                url: serviceIp+"/test-for-sure/test/get-category",
                type: "GET",
                
                dataType: 'json',
                success: function (result) {
					if(result.status){
						var categories=[];
						categories.push("<option value='0'>Select</option>");
						$.each(result.categoryList, function(i,cat){
							var newOption = "<option value='"+cat.id+"'> "+cat.category+"</option>";
							categories.push(newOption);
							
						})
						$("#ddCategory").html(categories);
					}
					else if(!result.status){
						console.log("Error: "+result.status);
					}
                },
                error: function () {
					console.log("Error in getting test categories");
                }
            });
			
			//to get the subcategories on change of category
			$("#ddCategory").on('change',function() {
				var categorySelected = $(this).val();
				$('#ddSubcategory').empty();
				console.log("Selected Category: "+categorySelected);
				if(categorySelected == '0'){
					var subcategories=[];
					subcategories.push("<option value='0' selected='selected'>Select</option>");
					$("#ddSubcategory").html(subcategories);
					showTests(categorySelected, $('#ddSubcategory').val());
					
					$("#ddSubcategory").attr("disabled", true);
					
				}
				else{
					$("#ddSubcategory").attr("disabled", false);
				
				$.ajax({
                url: serviceIp+"/test-for-sure/test/get-subcategory?categoryId="+categorySelected,
                type: "GET",
                
                dataType: 'json',
                success: function (result) {
					if(result.success){
						subcategories=[];
						subcategories.push("<option value='0' selected='selected'>Select</option>");
						$.each(result.subcategoryList, function(i,subcat){
							var newOption = "<option value='"+subcat.id+"'> "+subcat.subcategory+"</option>";
							subcategories.push(newOption);
							
						})
						$("#ddSubcategory").html(subcategories);
					}
					else if(!result.status){
						//means 0 records found
						subcategories=[];
						subcategories.push("<option value='0' selected='selected'>Select</option>");
						console.log("Error: "+result.status);
						$("#ddSubcategory").html(subcategories);
					}
					showTests(categorySelected, $('#ddSubcategory').val());
                },
                error: function () {
					console.log("Error in getting test subcategories");
					
                }
            });
			
			//on change of category, tests correspond to that category should only be shown
			//showTests(categorySelected, $('#ddSubcategory').val());
		}
	});
	
	$("#ddSubcategory").on('change',function() {
			showTests($('#ddCategory').val(), $(this).val());
		});
	
			
	//Initially, on page load show all the tests(Select in category and subcategory has value 0)
	showTests(0, 0);
	
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

