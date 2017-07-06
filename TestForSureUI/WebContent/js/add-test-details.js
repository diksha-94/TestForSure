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
		var testId = uniqTestId();
        var category = $('#ddCategory  option:selected').val();
        var subcategory = $('#ddSubcategory  option:selected').val();
        
        var title = $("#txtTitle").val();
		var ques = $("#txtQues").val();
        var time = $("#txtTime").val();
		var marks = $("#txtMarks").val();
        var negativeMarks = $("#txtNegativeMarks").val();
		
        var testDetailsSave_url = "http://localhost:8083/test-for-sure/test/add-update-test";
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
                    localStorage.setItem("testId",response.test_id);
					localStorage.setItem("questionCount",0)
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
function uniqTestId() {
  return (Math.floor((Math.random() * 100000) + 1))
}


//Adding Questions code
$("#addNewQuestion").on("click", function(){
	$("#quesEditor").removeClass('hide');
	//Add Question
	
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
	
$('#addQuesForm').validate({
    //rules: quesRules,

    ignore: false,
    highlight: function () {
        // to remove the red alert on text 
    },
    submitHandler: function () {
		//questionCount++;
		console.log("Inside add question submit");
	
		
        var addQuestion_url = "http://localhost:8083/test-for-sure/test/add-question";
        var type = 'POST';
        var requestData = {};
		requestData.id=parseInt(localStorage.getItem('questionCount'))+1;
		localStorage.setItem('questionCount',parseInt(localStorage.getItem('questionCount'))+1);
		requestData.test_id=localStorage.getItem('testId');
		requestData.ques_type="Simple";
		requestData.paragraph_text="Sample Paragraph Text";
		requestData.ques_text="Simple Question Text";
		requestData.optionA="A";
		requestData.optionB="B";
		requestData.optionC="C";
		requestData.optionD="D";
		requestData.correct_option="A";
		requestData.explanation="Sample explanation";
		console.log(JSON.stringify(requestData));
		
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

$(document).ready(function () {
	console.log("Document is ready");
	//to get the test categories on load and populate in category dropdown
	         $.ajax({
                url: "http://localhost:8083/test-for-sure/test/get-category",
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
				console.log("Selected Category: "+categorySelected);
				if(categorySelected == '0'){
					$("#ddSubcategory").attr("disabled", true);
				}
				else{
					$("#ddSubcategory").attr("disabled", false);
				
				$.ajax({
                url: "http://localhost:8083/test-for-sure/test/get-subcategory?categoryId="+categorySelected,
                type: "GET",
                
                dataType: 'json',
                success: function (result) {
					if(result.success){
						var subcategories=[];
						subcategories.push("<option value='0'>Select</option>");
						$.each(result.subcategoryList, function(i,subcat){
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
	
	
	
	$('#editor').ckeditor();
})

