function showQuestions(categoryId, subcategoryId){
	$('#questions').empty();
	console.log("Category id: "+categoryId);
	console.log("Subcategory id: "+subcategoryId);
	var url = "http://localhost:8083/test-for-sure/question-bank/get-questions?categoryId="+categoryId+"&subcategoryId="+subcategoryId;
	$.ajax({
                url: url,
                type: "GET",
                
                dataType: 'json',
                success: function (result) {
					if(result.status){
						if(result.questions != null) {
							console.log(JSON.stringify(result.questions));
							$.each(result.questions, function(i, question) {
								var btnId = 'btnQuestionEdit-'+question.id;
								//var query_string = 'test_id='+btnId;
								var newQuestion = questionStructure(i+1, question.question_text, btnId);
								$('#questions').append(newQuestion);
							});
							var questionsToStore = {};
							questionsToStore.questions = result.questions;
							localStorage.setItem('Question_Bank_Questions', JSON.stringify(questionsToStore));
							
						}
					}
					else if(!result.status){
						console.log("Error: "+result.message);
					}
                },
                error: function () {
					console.log("Error in getting questions from question bank");
                }
            });
}

function questionStructure(id, question_text, btnId){
	var onclick = 'add-questions-question-bank.html?action=Update-'+btnId;
	var newQuestion = "<div style='border:solid 1px red ; width:80% ; text-align:center ; clear:both;'>"+
							"<div style='float:left;width:10%;'><input type='checkbox' class='questionCheck' id='check-"+btnId+"'></div>"+
							"<div style='float:left;width:10%;'>"+id+"</div>"+
							"<div style='float:left;width:60%;'>"+(question_text).substring(0,200)+" ...</div>"+
					"</div>";
					  
	return newQuestion;
}

//On cliking add questions to test, get all the checkboxes which are checked
$('#btnAddToTest').on('click', function(){
	var requestData = {};
	var test_id = localStorage.getItem('test_id');
	console.log("Test_id: "+test_id);
	requestData.test_id = parseInt(test_id);
	requestData.question_id = [];
	var index = 0;
	$(':checkbox:checked').each(function(i){
          console.log(this.id);
		  requestData.question_id[index] = parseInt(((this.id).split("-"))[2]);
		  index++;
       });
	   console.log("Request data: "+JSON.stringify(requestData));
	   
	   $.ajax({
                url: "http://localhost:8083/test-for-sure/question-bank/add-questions-to-test",
                type: "POST",
                data: JSON.stringify(requestData),
				contentType: 'application/json',
                dataType: 'json',
                success: function (result) {
					if(result.status){
						console.log(result.message);
						window.location.href = "create-test.html?from=bank"
					}
					else if(!result.status){
						console.log("Error: "+result.message);
					}
                },
                error: function () {
					console.log("Error in adding questions");
                }
            });
})

$(document).ready(function () {
	console.log("Document add questions from question bank is ready");
	
	
	//to get the test categories on page load
	         $.ajax({
                url: "http://localhost:8083/test-for-sure/question-bank/get-subject-category",
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
					showQuestions(categorySelected, $('#ddSubcategory').val());
					
					$("#ddSubcategory").attr("disabled", true);
					
				}
				else{
					$("#ddSubcategory").attr("disabled", false);
				
				$.ajax({
                url: "http://localhost:8083/test-for-sure/question-bank/get-subject-subcategory?categoryId="+categorySelected,
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
					showQuestions(categorySelected, $('#ddSubcategory').val());
                },
                error: function () {
					console.log("Error in getting test subcategories");
					
                }
            });
			
			//on change of category, questions correspond to that category should only be shown
			//showQuestions(categorySelected, $('#ddSubcategory').val());
		}
	});
	
	$("#ddSubcategory").on('change',function() {
			showQuestions($('#ddCategory').val(), $(this).val());
		});
	
			
	//Initially, on page load show all the questions(Select in category and subcategory has value 0)
	showQuestions(0, 0);
	
	
	
})

