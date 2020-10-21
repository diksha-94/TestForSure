var FooterLinks = {
		"Exam": 0,
		"Quiz": 1
}

var footerlinksController = function(){
	this.Init();
};
footerlinksController.prototype.Init = function()
{
	console.log("Inside Footer links Init");
	this.LoadPage();
}
footerlinksController.prototype.LoadPage = function()
{
	if($('#footerLinksModal').length == 0){
		var html = "<div class='modal' id='footerLinksModal'>"+
				    	"<div class='modal-dialog test2bsure-dialog'>"+
							"<div class='modal-content test2bsure-content'>"+

								"<div class='modal-header'>"+
									"<h4 class='modal-title'>Footer Links</h4>"+
									"<button type='button' class='close' data-dismiss='modal'>&times;</button>"+
								"</div>"+

								"<div class='modal-body test2bsure-body'>"+
									"<div>"+
										"<span class='col-xs-offset-3 col-sm-offset-3 col-md-offset-3 col-lg-offset-3 "+
											"col-xs-2 col-sm-2 col-md-2 col-lg-2'>Select Exams "+
										"</span>"+
										"<input type='text' id='ddExams' placeholder='Search Exams here' class='col-xs-4 col-sm-4 col-md-4 col-lg-4'/>"+
									"</div></br></br>"+
									"<div>"+
										"<span class='col-xs-offset-3 col-sm-offset-3 col-md-offset-3 col-lg-offset-3 "+
											"col-xs-2 col-sm-2 col-md-2 col-lg-2'>Select Quiz Subjects "+
										"</span>"+
										"<input type='text' id='ddQuizzes' placeholder='Search Quiz Subjects here' class='col-xs-4 col-sm-4 col-md-4 col-lg-4'/>"+
									"</div></br></br>"+
								"</div>"+
								"<div class='modal-footer test2bsure-footer'>"+
									"<div>"+
										"<button id='btnFooterSave' type='button' "+
											"class='col-xs-offset-5 col-sm-offset-5 col-md-offset-5 "+
						        	 "col-lg-offset-5 col-xs-1 col-sm-1 col-md-1 col-lg-1 btn btn-primary'>Save</button>"+
										"<button id='btnFooterCancel' type='button' "+
											"class='col-xs-offset-1 col-sm-offset-1 col-md-offset-1 "+
						        	 "col-lg-offset-1 col-xs-1 col-sm-1 col-md-1 col-lg-1 btn btn-default' "+
											"data-dismiss='modal'>Cancel</button>"+
									"</div>"+
								"</div>"+
							"</div>"+
						"</div>"+
					"</div>";
		$('body').append(html);
	}
	$('#footerLinksModal').modal('show');
	$('#footerLinksModal').find('.autocomplete-div').remove();
	$('#footerLinksModal').find('.autocomplete-selecteddiv').remove();
	
	$.ajax({
		url: remoteServer + "/test2bsure/footerlinks",
		type: 'GET',
		success: function(result){
			if(result.response.status == true){
				if(result.exams != null && result.exams.length > 0){
					new AutoComplete('ddExams', 'exams').SetSelectedValues('ddExams', result.exams);
				}
				else{
					new AutoComplete('ddExams', 'exams');
				}
				if(result.quizzes != null && result.quizzes.length > 0){
					new AutoComplete('ddQuizzes', 'quizsubject').SetSelectedValues('ddQuizzes', result.quizzes);
				}
				else{
					new AutoComplete('ddQuizzes', 'quizsubject');
				}
			}
		}.bind(this),
		error: function(e){
			console.log(e);
		}
	});
	
	this.BindEvents();
};

footerlinksController.prototype.BindEvents = function()
{
	$('#footerLinksModal').find('#btnFooterSave').unbind().bind('click', function(){
		var exams = GetSelectedValues('ddExams');
		if(exams.length > 5){
			alert("Please select maximum 5 exams");
			return false;
		}
		var quizzes = GetSelectedValues('ddQuizzes');
		if(quizzes.length > 5){
			alert("Please select maximum 5 quizzes");
			return false;
		}
		var url = remoteServer+'/test2bsure/footerlinks';
		var type = 'POST';
		var requestData = {
				"exams": [],
				"quizzes": []
		};
		for(var exam in exams){
			var obj = {
					"id": exams[exam],
					"type": FooterLinks.Exam
			}
			requestData.exams.push(obj);
		}
		for(var quiz in quizzes){
			var obj = {
					"id": quizzes[quiz],
					"type": FooterLinks.Quiz
			}
			requestData.quizzes.push(obj);
		}
		console.log(requestData);
		$.ajax({
			url: url,
			type: 'POST',
			contentType: "application/json",
			data: JSON.stringify(requestData),
			success: function(response){
				if(response.status == true){
					alert(response.message);
				}
			},
			error: function(e){
				console.log(e);
			}
		});
	});
};