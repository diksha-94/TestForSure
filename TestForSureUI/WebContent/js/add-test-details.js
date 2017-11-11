
//test
function getCategoriesOnLoad(){
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
}

// Setting Rules for testDetailsForm Validations
var rules = {
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
};
	
$('#testDetailsForm').validate({
    rules: rules,

    ignore: false,
    highlight: function () {
        // to remove the red alert on text 
    },
    submitHandler: function () {
		console.log("Inside submit");
		//var testId = uniqTestId();
        var testId = localStorage.getItem('test_id');
		var category = $('#ddCategory  option:selected').val();
        var subcategory = $('#ddSubcategory  option:selected').val();
        localStorage.setItem('categoryId', category);
        localStorage.setItem('subcategoryId', subcategory);
        var title = $("#txtTitle").val();
		var ques = $("#txtQues").val();
        var time = $("#txtTime").val();
		var marks = $("#txtMarks").val();
        var negativeMarks = $("#txtNegativeMarks").val();
		
        var testDetailsSave_url = serviceIp+"/test-for-sure/test/add-update-test";
        var type = 'POST';
        var requestData = {};
		requestData.id=testId;
		requestData.cat_id=category;
		requestData.subcat_id=subcategory;
		requestData.testTitle=title;
		requestData.no_of_ques=ques;
		requestData.time_limit=time;
		requestData.correct_ques_marks=marks;
		requestData.negative_marks=negativeMarks;
		console.log(JSON.stringify(requestData));
		
        $.ajax({
            url: testDetailsSave_url,
            type: type,
			data: JSON.stringify(requestData),
			contentType: 'application/json',
			//dataType: 'json',
            success: function (response) {
                if (response.status) {
					console.log("Test details added/updated successfully with test id: "+response.test_id);
                    //localStorage.setItem("testId",response.test_id);
					
					$('#addQuestions').removeClass('hide');
					$('#addQuestions').addClass('show');
					$('#testDetails').removeClass('show');
					$('#testDetails').addClass('hide');
					
					disableQUestionsAlreadyAdded(localStorage.getItem('categoryId'), localStorage.getItem('subcategoryId'));
	
	
                }
                else if (!response.status) {
                    console.log("Error in adding/updating test detailstest id: "+response.test_id+"    Message: "+response.message);
                }
                
            },
            error: function () {
                console.log("Service is unavailable");
            }
           
        });
    }

});

//To disable the questios which are already added to the test with same category and subcategory
function disableQUestionsAlreadyAdded(cat_id, subcat_id){
	$.ajax({
                url: serviceIp+"/test-for-sure/question-bank/get-ques-ids?categoryId="+cat_id+"&subcategoryId="+subcat_id,
                type: "GET",
                contentType: 'application/json',
                success: function (result) {
					console.log("Result: "+result);
					var resultIds = result;
					localStorage.setItem('resultIds', resultIds);
                },
                error: function () {
					console.log("Service is unavailable");
                }
            });
}

function uniqTestId() {
  return (Math.floor((Math.random() * 100000) + 1))
}


//Adding Questions code
$("#addNewQuestion").on("click", function(){
	$("#quesEditor").removeClass('hide');
	$('#txtPara').summernote('code', '');
	$('#txtQuesText').summernote('code', '');
	$('#txtoptionA').summernote('code', '');
	$('#txtoptionB').summernote('code', '');
	$('#txtoptionC').summernote('code', '');
	$('#txtoptionD').summernote('code', '');
	$("input[name='radioCorrectOption']").prop('checked', false);
	$('#txtExplanation').summernote('code', '');
	$('#ddquesType').prop('checked', false);
	$('#paraTextDiv').removeClass('show');
	$('#paraTextDiv').addClass('hide');
})

$('#ddquesType').on('change', function() {
	var quesType = $(this).prop('checked');
	
	if(quesType == true){
		$('#paraTextDiv').removeClass('hide');
		$('#paraTextDiv').addClass('show');
		$('#txtPara').summernote('code','');
	}
	else if(quesType == false){
		$('#paraTextDiv').removeClass('show');
		$('#paraTextDiv').addClass('hide');
		$('#txtPara').summernote('code','');
	}
})
$('#ddquesTypeUpdate').on('change', function() {
	var quesType = $(this).prop('checked');
	
	if(quesType == true){
		$('#paraTextDivUpdate').removeClass('hide');
		$('#paraTextDivUpdate').addClass('show');
		$('#txtParaUpdate').summernote('code','');
	}
	else if(quesType == false){
		$('#paraTextDivUpdate').removeClass('show');
		$('#paraTextDivUpdate').addClass('hide');
		$('#txtParaUpdate').summernote('code','');
	}
})
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
	}
};


$('#addQuesForm').validate({
    rules: quesRules,

    ignore: false,
    highlight: function () {
        // to remove the red alert on text 
    },
    submitHandler: function () {
		//questionCount++;
		console.log("Inside add question submit");
	
		
        var addQuestion_url = serviceIp+"/test-for-sure/test/add-question";
        var type = 'POST';
        var requestData = {};
		requestData.id=parseInt(localStorage.getItem('questionCount'))+1;
		localStorage.setItem('questionCount',parseInt(localStorage.getItem('questionCount'))+1);
		requestData.test_id=localStorage.getItem('test_id');
		var quesType = $('#ddquesType').prop('checked');
		if(quesType == true){
			requestData.ques_type="Paragraph";
		}
		else if(quesType == false){
			requestData.ques_type="Simple";
		}
		requestData.paragraph_text=$('#txtPara').val();
		requestData.ques_text=$('#txtQuesText').val();
		requestData.optionA=$('#txtoptionA').val();
		requestData.optionB=$('#txtoptionB').val();
		requestData.optionC=$('#txtoptionC').val();
		requestData.optionD=$('#txtoptionD').val();
		requestData.correct_option=$("input[name='radioCorrectOption']:checked").val();
		requestData.explanation=$('#txtExplanation').val();
		console.log(JSON.stringify(requestData));
		//$('#txtPara').summernote('insertImage', url, filename);
        $.ajax({
            url: addQuestion_url,
            type: type,
			data: JSON.stringify(requestData),
			contentType: 'application/json',
			//dataType: 'json',
            success: function (response) {
                if (response.status) {
					console.log("Question added/updated successfully with question id: "+response.question_id);
					$("#quesEditor").addClass('hide');
					$('#addedQuestions').empty();
								
					getQuestionsOnTestId(localStorage.getItem('test_id'));
                    //localStorage.setItem("testId",response.test_id);
                }
                else if (!response.status) {
                    console.log("Error in adding/updating question id: "+response.question_id+"    Message: "+response.message);
                }
                
            },
            error: function () {
                console.log("Service is unavailable");
            }
           
        });
    }

});

function getQuestionsOnTestId(test_id){
	console.log('Test_id: '+test_id);
	var url = serviceIp+"/test-for-sure/test/get-questions?test_id="+test_id;
	$.ajax({
                url: url,
                type: "GET",
                dataType: 'json',
                success: function (result) {
					if(result.status){
						if(result.question != null) {
							console.log(JSON.stringify(result.question));
							console.log("Number of questions: "+(result.question).length)
							$('#numberOfQuestions').text((result.question).length);
							$.each(result.question, function(i, question) {
								console.log('Option D: '+question.optionD);
								console.log('correct option: '+question.correct_option);
								console.log('Explanation: '+question.explanation);
								var updateBtnId = "Update-"+test_id+"-"+question.id;
								var deleteBtnId = "Delete-"+test_id+"-"+question.id;
								var forAllId = test_id+"-"+question.id;
								var newQuestion = "<div style='border:solid 1px red;'>"+
												"</br>Question Id: <span id = 'questionId-" + (forAllId) + "'>"+question.id+"</span>"+
												"</br>Question Type: <span id = 'questionType-" + (forAllId) + "'>"+question.ques_type+"</span>";
								if((question.ques_type).toLowerCase() == "paragraph"){
									newQuestion += "</br>Paragraph text: <span id = 'paraText-" + (forAllId) + "'>"+((question.paragraph_text).replace('<p>','')).replace('</p>','')+"</span>";
								}
												newQuestion += "</br>Question Text: <span id = 'quesText-" + (forAllId) + "'>"+((question.ques_text).replace('<p>','')).replace('</p>','')+"</span>"+
												"</br>a. <span id = 'optionA-" + (forAllId) + "'>"+((question.optionA).replace('<p>','')).replace('</p>','')+"</span>"+
												"</br>b. <span id = 'optionB-" + (forAllId) + "'>"+((question.optionB).replace('<p>','')).replace('</p>','')+"</span>"+
												"</br>c. <span id = 'optionC-" + (forAllId) + "'>"+((question.optionC).replace('<p>','')).replace('</p>','')+"</span>"+
												"</br>d. <span id = 'optionD-" + (forAllId) + "'>"+((question.optionD).replace('<p>','')).replace('</p>','')+"</span>"+
												"</br>Correct Option: <span id = 'correctOption-" + (forAllId) + "'>"+question.correct_option+"</span>"+
												"</br>Explanation: <span id = 'explanation-" + (forAllId) + "'>"+((question.explanation).replace('<p>','')).replace('</p>','')+"</span>"+
												"</br><button type='button' id="+updateBtnId+" data-toggle='modal' data-target='#UpdateQuestionModal' onclick='saveDetails(this.id);'>Update</button>"+
												"</br><button type='button' id="+deleteBtnId+" data-toggle='modal' data-target='#deletQuestionModal' onclick='saveDetails(this.id);'>Delete</button>"+
												"</div>";
								$('#addedQuestions').removeClass('hide');
								$('#addedQuestions').addClass('show');
								$('#addedQuestions').append(newQuestion);
							});
							
						}
					}
					else if(!result.status){
						console.log("Error: "+result.message);
					}
                },
                error: function () {
					console.log("Error in getting questions");
                }
            });
}


//On click of Update or delete button, save the test and qestion id to local storage
function saveDetails(btnId){
	
	console.log(btnId);
	
	var values = btnId.split("-");
	localStorage.setItem('btnid',(values[2]));
	localStorage.setItem('btntest_id',parseInt(values[1]));
	console.log(parseInt(values[2])+"--"+parseInt(values[1]));
	if(values[0] == "Update"){
		//$('#updateContent').append($('#quesEditor').html());
		//$('#txtPara').val($('#paraText-'+values[1]+'-'+values[2]).text());
		console.log('Question type: '+($('#questionType-'+values[1]+'-'+values[2]).text()));
		if(($('#questionType-'+values[1]+'-'+values[2]).text()) == "Simple"){
			$('#ddquesTypeUpdate').prop('checked', false);
			$('#paraTextDivUpdate').removeClass('show');
			$('#paraTextDivUpdate').addClass('hide');
		}
		else if(($('#questionType-'+values[1]+'-'+values[2]).text()) == "Paragraph"){
			$('#ddquesTypeUpdate').prop('checked', true);
			$('#paraTextDivUpdate').removeClass('hide');
			$('#paraTextDivUpdate').addClass('show');
			$('#txtParaUpdate').summernote('code', $('#paraText-'+values[1]+'-'+values[2]).text());
		}
		console.log($('#quesText-'+values[1]+'-'+values[2]).text()+"----");
		$('#txtQuesTextUpdate').summernote('code', $('#quesText-'+values[1]+'-'+values[2]).text());
		$('#txtoptionAUpdate').summernote('code', $('#optionA-'+values[1]+'-'+values[2]).text());
		$('#txtoptionBUpdate').summernote('code', $('#optionB-'+values[1]+'-'+values[2]).text());
		$('#txtoptionCUpdate').summernote('code', $('#optionC-'+values[1]+'-'+values[2]).text());
		$('#txtoptionDUpdate').summernote('code', $('#optionD-'+values[1]+'-'+values[2]).text());
		$("input[name=radioCorrectOptionUpdate][value="+$('#correctOption-'+values[1]+'-'+values[2]).text()+"]").prop('checked', true);
		$('#txtExplanationUpdate').summernote('code', $('#explanation-'+values[1]+'-'+values[2]).text());
	}
}
//On click of Yes in the delete question modal box
$("#btnYes").on("click", function () {

    var deleteRequest={};
	//var id = $(this).attr('id');
	//console.log(id);
	//var values = id.split("-");
	console.log("id: "+localStorage.getItem('btnid'));
	var delete_question_id = localStorage.getItem('btnid');
	deleteRequest.id=localStorage.getItem('btnid');
	deleteRequest.test_id=localStorage.getItem('btntest_id');
	console.log("deleteRequest: "+JSON.stringify(deleteRequest));
    var deleteUrl = serviceIp+"/test-for-sure/test/delete-question";
    var type = 'PUT';

    $.ajax({
        url: deleteUrl,
        type: type,
		data: JSON.stringify(deleteRequest),
		contentType: 'application/json',
        success: function (delData) {

            if (delData.status == true) {
				console.log('Message: '+delData.message);
				$('#addedQuestions').empty();
				//localStorage.setItem('questionCount',parseInt(localStorage.getItem('questionCount'))-1);
				$('#numberOfQuestions').text($('#numberOfQuestions').text()-1);
							
				getQuestionsOnTestId(localStorage.getItem('btntest_id'));
				var ids = (localStorage.getItem('added_questions')).split(",");
				localStorage.setItem('added_questions','');
				for(var i = 0;i<ids.length;i++){
					if(((ids[i]).split("-"))[2] == delete_question_id){
						console.log("Inside match");
						ids[i] = null;
					}
					localStorage.setItem('added_questions', localStorage.getItem('added_questions')+','+ids[i]);
				}
				
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

//On adding all the questions, proceed to Publish Test section
$('#btnDoneQues').on('click', function(){
	$('#addQuestions').removeClass('show');
	$('#addQuestions').addClass('hide');
	$('#publishTest').removeClass('hide');
	$('#publishTest').addClass('show');
	
	var quesAdded;
	var quesToAdd;
					
	var getTest_url = serviceIp+"/test-for-sure/test/get-testsbyId?testId="+localStorage.getItem('test_id');
	var type= "GET";
	$.ajax({
            url: getTest_url,
            type: type,
			contentType: 'application/json',
			//dataType: 'json',
            success: function (response) {
                if (response.status) {
					console.log("Test details fetched");
					$('#publishTitle').text(response.testDetails.testTitle);
					$('#publishCategory').text(response.category);
					$('#publishSubcategory').text(response.subcategory);
					$('#publishQues').text(response.testDetails.no_of_ques);
					$('#publishTime').text(response.testDetails.time_limit);
					$('#publishMaxMarks').text(response.testDetails.no_of_ques*response.testDetails.correct_ques_marks);
					$('#publishCorrect').text(response.testDetails.correct_ques_marks);
					$('#publishNegative').text(response.testDetails.negative_marks);
					
					quesAdded = $('#numberOfQuestions').text();
					quesToAdd = $('#publishQues').text();
					console.log("Ques added: "+quesAdded);
					console.log("Ques to add: "+quesToAdd);
					if(quesAdded == quesToAdd){
						$('#btnPublishTest').attr('disabled', false);
						$('#btnPublishTest').attr('title', 'Publish test');
					}
					else{
						$('#btnPublishTest').attr('disabled', true);
						$('#btnPublishTest').attr('title', 'Test can\'t be published until you add all the questions.');
					}
                }
                else if (!response.status) {
                    console.log("Error in getting test details with test id: "+localStorage.getItem('test_id')+"    Message: "+response.message);
                }
            },
            error: function () {
                console.log("Service is unavailable");
            }
           
        });
		
		
    })

$('#btnUpdateSubmit').on('click', function(){
	var addQuestion_url = serviceIp+"/test-for-sure/test/add-question";
        var type = 'POST';
        var requestData = {};
		requestData.id=localStorage.getItem('btnid');
		//localStorage.setItem('questionCount',parseInt(localStorage.getItem('questionCount'))+1);
		requestData.test_id=localStorage.getItem('btntest_id');
		var quesType = $('#ddquesTypeUpdate').prop('checked');
		if(quesType == true){
			requestData.ques_type="Paragraph";
			requestData.paragraph_text=$('#txtParaUpdate').val();
		}
		else if(quesType == false){
			requestData.ques_type="Simple";
			requestData.paragraph_text = "";
		}
		requestData.ques_text=$('#txtQuesTextUpdate').val();
		requestData.optionA=$('#txtoptionAUpdate').val();
		requestData.optionB=$('#txtoptionBUpdate').val();
		requestData.optionC=$('#txtoptionCUpdate').val();
		requestData.optionD=$('#txtoptionDUpdate').val();
		requestData.correct_option=$("input[name='radioCorrectOptionUpdate']:checked").val();
		requestData.explanation=$('#txtExplanationUpdate').val();
		console.log(JSON.stringify(requestData));
		
        $.ajax({
            url: addQuestion_url,
            type: type,
			data: JSON.stringify(requestData),
			contentType: 'application/json',
			//dataType: 'json',
            success: function (response) {
                if (response.status) {
					console.log("Question updated successfully with question id: "+response.question_id);
					$("#quesEditor").addClass('hide');
					$('#addedQuestions').empty();
								
					getQuestionsOnTestId(localStorage.getItem('test_id'));
                    //localStorage.setItem("testId",response.test_id);
                }
                else if (!response.status) {
                    console.log("Error in /updating question id: "+response.question_id+"    Message: "+response.message);
                }
                
            },
            error: function () {
                console.log("Service is unavailable");
            }
           
        });
})

//On click of Back to Test Details
$('#btnBackTestDetails').on('click', function(){
	$('#addQuestions').removeClass('show');
	$('#addQuestions').addClass('hide');
	$('#testDetails').removeClass('hide');
	$('#testDetails').addClass('show');
	getCategoriesOnLoad();
	var getTest_url = serviceIp+"/test-for-sure/test/get-testsbyId?testId="+localStorage.getItem('test_id');
	var type= "GET";
	$.ajax({
            url: getTest_url,
            type: type,
			contentType: 'application/json',
			//dataType: 'json',
            success: function (response) {
				console.log("Get test response: "+JSON.stringify(response));
                if (response.status) {
					var categoryId = ""+response.category;
					console.log("Test details fetched: "+categoryId);
					$('#txtTitle').val(response.testDetails.testTitle);
					console.log("Category: "+(""+response.testDetails.cat_id));
					$('#ddCategory').val(""+response.testDetails.cat_id);
					$('#ddSubcategory').val(""+response.testDetails.subcat_id);
					$('#txtQues').val(response.testDetails.no_of_ques);
					$('#txtTime').val(response.testDetails.time_limit);
					$('#txtMarks').val(response.testDetails.correct_ques_marks);
					$('#txtNegativeMarks').val(response.testDetails.negative_marks);
                }
                else if (!response.status) {
                    console.log("Error in getting test details with test id: "+localStorage.getItem('test_id')+"    Message: "+response.message);
                }
            },
            error: function () {
                console.log("Service is unavailable");
            }
           
        });
	$('#btnSaveNext').text('Update & Next');
})

//On click of Back to Add Questions
$('#btnBackAddQues').on('click', function(){
	$('#publishTest').removeClass('show');
	$('#publishTest').addClass('hide');
	$('#addQuestions').removeClass('hide');
	$('#addQuestions').addClass('show');
})

//On click of Save for later
$('#btnSaveForLater').on('click', function(){
	console.log("Test has been saved");
})

//On click of publish button (when it is enabled)
$('#btnPublishTest').on('click', function(){
		$.ajax({
                url: serviceIp+"/test-for-sure/test/publish-test?test_id="+localStorage.getItem('test_id'),
                type: "PUT",
                
                dataType: 'json',
                success: function (result) {
					if(result.status){
						console.log(result.message);
						alert($('#publishTitle').text()+" published successfully");
					}
					else if(!result.status){
						console.log("Error: "+result.message);
						alert("Error: "+result.message);
						
					}
                },
                error: function () {
					console.log("Error in publishing test");
					alert("Error in publishing test");
                }
            });
})


//Adding questions from question bank
$('#addFromQuestionBank').on('click', function(){
	window.location.href = "add-questions-from-bank.html?test_id="+localStorage.getItem('test_id');
})

//Adding new category
$('#btnAddCategoryModal').on('click', function(){
	var category = $('#txtCategory').val();
	var imagePath = $('#txtImagePath').val();
	
	var type="POST";
	var requestData = {};
	requestData.category = category;
	requestData.imagePath = imagePath;
		console.log("Requestdata for add category: "+JSON.stringify(requestData));
	$.ajax({
            url: serviceIp+"/test-for-sure/test/add-category",
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
				alert("Subject category can't be added: "+result.message);
				$('#txtCategory').val('');
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
            url: serviceIp+"/test-for-sure/test/add-subcategory",
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
				alert("Subject category can't be added: "+result.message);
				$('#txtSubcategory').val('');
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
	console.log("Document is ready");
	var action = getQueryParameterByName('from');
	if(action == 'bank'){
		//means returning from question bank
		$('#addQuestions').removeClass('hide');
		$('#addQuestions').addClass('show');
		$('#testDetails').removeClass('show');
		$('#testDetails').addClass('hide');
		getQuestionsOnTestId(localStorage.getItem('test_id'));
	}
	else{
		//means when loaded for the first time
		localStorage.clear();
	var id = (Math.floor((Math.random() * 100000) + 1));
	localStorage.setItem('test_id', id);
	localStorage.setItem("questionCount",0);
	//to get the test categories on load and populate in category dropdown
	         getCategoriesOnLoad();
	}
	
			
			//to get the subcategories on change of category
			$("#ddCategory").on('change',function() {
				var categorySelected = $(this).val();
				console.log("Selected Category: "+categorySelected);
				if(categorySelected == '0'){
					$('#ddSubcategory').empty();
					$('#ddSubcategory').append($('<option>', {
						value: '0',
						text: 'Select'
					}));
					$("#ddSubcategory").attr("disabled", true);
					$("#btnAddSubcategory").attr("disabled", true);
				}
				else{
					$("#ddSubcategory").attr("disabled", false);
					$("#btnAddSubcategory").attr("disabled", false);
				
				$.ajax({
                url: serviceIp+"/test-for-sure/test/get-subcategory?categoryId="+categorySelected,
                type: "GET",
                
                dataType: 'json',
                success: function (result) {
					if(result.success){
						var subcategories=[];
						subcategories.push("<option value='0'>Select</option>");
						$.each(result.subcategoryList, function(i,subcat){
							console.log("subcat.id: "+subcat.id);
							var newOption = "<option value='"+subcat.id+"'> "+subcat.subcategory+"</option>";
							subcategories.push(newOption);
							
						})
						$("#ddSubcategory").html(subcategories);
					}
					else if(!result.status){
						//means 0 records found
						subcategories=[];
						subcategories.push("<option value='0'>Select</option>");
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
	
	
	
	//$('.editor').Editor();
	//$('#txtPara').Editor();
	//$('#txtExplanation').Editor();
	$('.editor').summernote();
})

