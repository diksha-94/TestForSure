var allQuestions = {};

function showQuestions(categoryId, subcategoryId){
	$('#questions').empty();
	console.log("Category id: "+categoryId);
	console.log("Subcategory id: "+subcategoryId);
	var url = "http://13.126.161.84:8083/test-for-sure/question-bank/get-questions?categoryId="+categoryId+"&subcategoryId="+subcategoryId;
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
							if(localStorage.getItem("added_questions") != null){
							var ids = (localStorage.getItem('added_questions')).split(",");
								
							$(':checkbox').each(function(i){
								
								console.log("ids: "+ids);
								for(var i = 0;i<ids.length;i++){
									if(this.id == ids[i]){
										console.log("Inside");
										$(this).attr('disabled', true);
										break;
									}
									else{
										$(this).attr('disabled', false);
									}
								}
							});
							}
							var questionsToStore = {};
							questionsToStore.questions = result.questions;
							localStorage.setItem('Question_Bank_Questions', JSON.stringify(questionsToStore));
							allQuestions = questionsToStore;
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
	var onclickDiv = "openViewQuestion('"+btnId+"')";
	
	var newQuestion = "<div style='border:solid 1px red ; width:80% ; text-align:center ; clear:both;'>"+
							"<div style='float:left;width:10%;'><input type='checkbox' class='questionCheck' id='check-"+btnId+"'></div>"+
							"<div style='float:left;width:10%;'>"+id+"</div>"+
							"<div id='"+btnId+"' style='float:left;width:70%;cursor:pointer;' onclick="+onclickDiv+">"+(question_text).substring(0,200)+" ...</div>"+
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
		  localStorage.setItem('added_questions', localStorage.getItem('added_questions')+','+this.id);
		  requestData.question_id[index] = (((this.id).split("-"))[2]);
		  index++;
       });
	   console.log("Request data: "+JSON.stringify(requestData));
	   
	   $.ajax({
                url: "http://13.126.161.84:8083/test-for-sure/question-bank/add-questions-to-test",
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

//On click of Back to Add Questions
$('#btnBackToAddQues').on('click', function(){
	window.location.href = "create-test.html?from=bank";
})

function openViewQuestion(id){
	console.log(id);
	$('#showQuestionModal').modal('show');
	var question_id = (id.split("-"))[1];
	console.log("All questions: "+(allQuestions.questions));
	$.each(allQuestions.questions, function(i, question){
			if(question.id == question_id){
				console.log("Question to show: "+JSON.stringify(question));
				
				$('#txtShowCategory').text(question.category_name);
				$('#txtShowSubcategory').text(question.subcategory_name);
				$('#txtShowType').text(question.question_type);
				$('#txtShowPara').text(question.paragraph_text);
				$('#txtShowQues').text(question.question_text);
				$('#txtShowOptionA').text(question.optionA);
				$('#txtShowOptionB').text(question.optionB);
				$('#txtShowOptionC').text(question.optionC);
				$('#txtShowOptionD').text(question.optionD);
				$('#txtShowCorrect').text(question.correct_option);
				$('#txtShowExplanation').text(question.explanation);
				
				return false;
			}
		})
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
$(document).ready(function () {
	console.log("Document add questions from question bank is ready");
	
	
	//to get the test categories on page load
	         $.ajax({
                url: "http://13.126.161.84:8083/test-for-sure/question-bank/get-subject-category",
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
                url: "http://13.126.161.84:8083/test-for-sure/question-bank/get-subject-subcategory?categoryId="+categorySelected,
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

