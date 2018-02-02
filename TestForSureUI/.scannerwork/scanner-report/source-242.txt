function getCategories(){
	$.ajax({
                url: serviceIp+"/test-for-sure/question-bank/get-subject-category",
                type: "GET",
                
                dataType: 'json',
                success: function (result) {
					if(result.status){
						var categories=[];
						categories.push("<option value=''>Select</option>");
						$.each(result.categoryList, function(i,cat){
							var newOption = "<option value='"+cat.id+"'>"+cat.category+"</option>";
							categories.push(newOption);
						})
					}
					else if(!result.status){
						var categories=[];
						categories.push("<option value=''>Select</option>");
						console.log("Error: "+result.status);
					}
					$("#ddCategory").html(categories);
                },
                error: function () {
					console.log("Error in getting test categories");
                }
            });
}

//On checking/unchecking checkbox specifying question_type
$('#ddquesType').on('change', function() {
	var quesType = $(this).prop('checked');
	
	if(quesType == true){
		$('#paraTextDiv').removeClass('hide');
		$('#paraTextDiv').addClass('show');
	}
	else if(quesType == false){
		$('#paraTextDiv').removeClass('show');
		$('#paraTextDiv').addClass('hide');
	}
})

/*var quesRules = {
    'quesName': {
		number: true
    },
	'marksName': {
		number: true
    },
	'timeName': {
		number: true
    },
	'negativeMarksName': {
		number: true
    }
};*/
var quesRules = {
    
	'txtQuesTextName': {
		required: true
    },
	'txtoptionAName': {
		required: true
    },
	'txtoptionBName': {
		required: true
    },
	'txtoptionCName': {
		required: true
    },
	'txtoptionDName': {
		required: true
    },
	'radioCorrectOption': {
		required: true
	},
	'ddCategoryName':{
		required: true
	},
	'ddSubcategoryName':{
		required: true
	}
};



$('#addQuesForm').validate({
	
    rules: quesRules,

    ignore: false,
    highlight: function () {
        // to remove the red alert on text 
    },
    submitHandler: function () {
		//check action-add or update
	
		var action = getQueryParameterByName('action');
		var url="";
		var ques_id = -1;
		if(action.toLowerCase() == 'add'){
			//add
			url = serviceIp+"/test-for-sure/question-bank/add-question";
		}
		else{
			url = serviceIp+"/test-for-sure/question-bank/update-question";
			ques_id = (action.split("-"))[2];
		}
		//questionCount++;
		console.log("Inside add question submit");
	
		
        var type = 'POST';
        var requestData = {};
		requestData.id = generateRandomId();
		var category = $('#ddCategory  option:selected').val();
        var subcategory = $('#ddSubcategory  option:selected').val();
		if(ques_id != -1){
			requestData.id = ques_id;
		}
		requestData.category_id = category;
		requestData.subcategory_id = subcategory;
		
		//requestData.category_id = "1";
		//requestData.subcategory_id = "1";
		var quesType = $('#ddquesType').prop('checked');
		if(quesType == true){
			requestData.question_type="Paragraph";
			requestData.paragraph_text=$('#txtPara').val();
		}
		else if(quesType == false){
			requestData.question_type="Simple";
			requestData.paragraph_text="";
		}
		requestData.question_text=$('#txtQuesText').val();
		requestData.optionA=$('#txtoptionA').val();
		requestData.optionB=$('#txtoptionB').val();
		requestData.optionC=$('#txtoptionC').val();
		requestData.optionD=$('#txtoptionD').val();
		requestData.correct_option=$("input[name='radioCorrectOption']:checked").val();
		requestData.explanation=$('#txtExplanation').val();
		console.log(JSON.stringify(requestData));
		
        $.ajax({
            url: url,
            type: type,
			data: JSON.stringify(requestData),
			contentType: 'application/json',
			//dataType: 'json',
            success: function (response) {
                if (response.status) {
					console.log("Question added successfully with question id: "+response.question_id);
					
					window.location.href = "question-bank.html";
					//localStorage.setItem("testId",response.test_id);
                }
                else if (!response.status) {
                    console.log("Error in adding question id: "+response.question_id+"    Message: "+response.message);
                }
                
            },
            error: function () {
                console.log("Service is unavailable");
            }
           
        });
    }

});


//Adding new category
$('#btnAddCategoryModal').on('click', function(){
	var category = $('#txtCategory').val();
	var type="POST";
	var requestData = {};
	requestData.category = category;
		console.log("Requestdata for add category: "+JSON.stringify(requestData));
	$.ajax({
            url: serviceIp+"/test-for-sure/question-bank/add-subject-category",
            type: type,
            data: JSON.stringify(requestData),
            dataType: 'json',
			contentType: 'application/json',
            success: function (result) {
			if(result.status){
				console.log("Subject category added successfully: "+result.message);
				$('#ddCategory').append($('<option>', {
					value: ((result.message).split("-"))[1],
					text: category
				}));
				$('#ddCategory').val(((result.message).split("-"))[1]);
				$('#ddSubcategory').attr('disabled', false);
				$('#btnAddSubcategory').attr('disabled', false);
				$('#txtCategory').val('');
			}
			else if(!result.status){
				console.log("Subject category can't be added: "+result.message);
			}
           },
           error: function () {
				console.log("Error in adding subject category");
           }
      });
})

//Adding new subcategory
$('#btnAddSubcategoryModal').on('click', function(){
	var subcategory = $('#txtSubcategory').val();
	var type="POST";
	var requestData = {};
	requestData.cat_id = $('#ddCategory  option:selected').val();
	requestData.subcategory = subcategory;
	console.log("Requestdata for add subcategory: "+JSON.stringify(requestData));
	$.ajax({
            url: serviceIp+"/test-for-sure/question-bank/add-subject-subcategory",
            type: type,
            data: JSON.stringify(requestData),
            dataType: 'json',
			contentType: 'application/json',
            success: function (result) {
			if(result.status){
				console.log("Subject subcategory added successfully: "+result.message);
				$('#ddSubcategory').append($('<option>', {
					value: ((result.message).split("-"))[1],
					text: subcategory
				}));
				$('#ddSubcategory').val(((result.message).split("-"))[1]);
				$('#txtSubcategory').val('');
			}
			else if(!result.status){
				console.log("Subject category can't be added: "+result.message);
			}
           },
           error: function () {
				console.log("Error in adding subject category");
           }
      });
})

//On click of Cancel, empty addCategory and addSubcategory text box
$('#btnCancelAddSubcategory').on('click', function(){
	$('#txtSubcategory').val('');
})

//On click of Cancel, empty addCategory and addSubcategory text box
$('#btnCancelAddCategory').on('click', function(){
	$('#txtCategory').val('');
})

//On click of Yes in the delete question modal box
$("#btnYes").on("click", function () {

    var deleteRequest={};
	//var id = $(this).attr('id');
	//console.log(id);
	//var values = id.split("-");
	var action = getQueryParameterByName('action');

	deleteRequest.id=((action.split("-"))[2]);
	console.log("deleteRequest: "+JSON.stringify(deleteRequest));
    var deleteUrl = serviceIp+"/test-for-sure/question-bank/delete-question";
    var type = 'PUT';

    $.ajax({
        url: deleteUrl,
        type: type,
		data: JSON.stringify(deleteRequest),
		contentType: 'application/json',
        success: function (delData) {

            if (delData.status == true) {
				console.log('Message: '+delData.message);
				window.location.href = "question-bank.html";
            }
            else if (delData.status == false) {
                console.log('Message: '+delData.message);
            }
        },
        error: function () {
            console.log('Backend service is unavailable.');
        }
    });
});

$('#btnReturnToQuesList').on('click', function(){
	window.location.href = 'question-bank.html';
})

function getQueryParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

//Generate random string for question_id
function generateRandomId() {
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < 5; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
}

$(document).ready(function () {
	console.log("Document question bank - add questions is ready");
	
	//On load of add-questions page, check whether it is add action or update
	var action = getQueryParameterByName('action');
	if(action.toLowerCase() == 'add'){
		//add
		//to get the test categories on page load
	    getCategories();
	}
	else{
		//update
		getCategories();
		
		$('#ddSubcategory').attr('disabled', false);
		$('#btnAddSubcategory').attr('disabled', false);
		$('#ddSubcategory').val("");
		var allQuestions = {};
		allQuestions = JSON.parse(localStorage.getItem('Question_Bank_Questions'));
		console.log("All questions: "+(allQuestions.questions));
		var question_id = (action.split("-"))[2];
		$('#submitQuestion').text('Update Question');
		var deleteButton = "<button type='button' class='form-control' id='deleteQuestion' data-toggle='modal' data-target='#deleteQuestionModal'>Delete Question</button>"
		$('#buttonDiv').append(deleteButton);
		$.each(allQuestions.questions, function(i, question){
			if(question.id == question_id){
				console.log("Question to update: "+JSON.stringify(question));
			
				if(question.question_type == "Simple"){
					$('#ddquesType').prop('checked', false);
					$('#paraTextDiv').removeClass('show');
					$('#paraTextDiv').addClass('hide');
					
				}
				else{
					$('#ddquesType').prop('checked', true);
					$('#paraTextDiv').removeClass('hide');
					$('#paraTextDiv').addClass('show');
					$('#txtPara').val(question.paragraph_text);
				}
				$('#txtQuesText').val(question.question_text);
				$('#txtoptionA').val(question.optionA);
				$('#txtoptionB').val(question.optionB);
				$('#txtoptionC').val(question.optionC);
				$('#txtoptionD').val(question.optionD);
				$("input[name='radioCorrectOption'][value='"+question.correct_option+"']").prop('checked', true);
				$('#txtExplanation').val(question.explanation);
				console.log(question.category_id);
				//TODO: handle category id and subcategory in case of update question
				//$("#ddCategory").val("2");
				document.getElementById('ddCategory').value = "2";
				//$("#ddSubcategory").val(""+question.subcategory_id);
				//$('#ddSubCategory').val("1");
				//$('#ddSubcategory').val(question.subcategory_id);
				
				return false;
			}
		})
	}
					
			//to get the subcategories on change of category
			$("#ddCategory").on('change',function() {
				var categorySelected = $(this).val();
				$('#ddSubcategory').empty();
				console.log("Selected Category: "+categorySelected);
				//Category is Select(means not yet selected)
				if(categorySelected == ''){
					var subcategories=[];
					subcategories.push("<option value='' selected='selected'>Select</option>");
					$("#ddSubcategory").html(subcategories);
					
					$("#ddSubcategory").attr("disabled", true);
					$("#btnAddSubcategory").attr("disabled", true);
					
					
				}
				else{
					$("#ddSubcategory").attr("disabled", false);
					$("#btnAddSubcategory").attr("disabled", false);
				
				$.ajax({
                url: serviceIp+"/test-for-sure/question-bank/get-subject-subcategory?categoryId="+categorySelected,
                type: "GET",
                
                dataType: 'json',
                success: function (result) {
					if(result.success){
						subcategories=[];
						subcategories.push("<option value='' selected='selected'>Select</option>");
						$.each(result.subcategoryList, function(i,subcat){
							var newOption = "<option value='"+subcat.id+"'> "+subcat.subcategory+"</option>";
							subcategories.push(newOption);
							
						})
						$("#ddSubcategory").html(subcategories);
					}
					else if(!result.status){
						//means 0 records found
						subcategories=[];
						subcategories.push("<option value='' selected='selected'>Select</option>");
						console.log("Error: "+result.status);
						$("#ddSubcategory").html(subcategories);
					}
	            },
                error: function () {
					console.log("Error in getting test subcategories");
					
                }
            });
			
		}
	});
			
	$('.editor').summernote();
	
})

