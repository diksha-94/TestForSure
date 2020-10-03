var footerController = function(){
	this.data = {};
	this.Init();
};
footerController.prototype.Init = function()
{
	this.LoadFooter();
};
footerController.prototype.LoadFooter = function(){
	fetch(remoteServer+'/test2bsure/footerlinks')
		  .then(response => response.json())
		  .then(data => this.SetState({ data: data }));
};
footerController.prototype.SetState = function(obj)
{
	for(var key in obj){
		this[key] = obj[key];
	}
	this.PopulateData();
};
footerController.prototype.PopulateData = function(){
	if((this.data.exams == null || this.data.exams.length == 0) && (this.data.quizzes == null || this.data.quizzes.length == 0)){
		//Load static data
		var html = "<p class='about-us-footer'>Test2BSure.com is an online portal for "+
					"all types of competitive exams (Technical and Non-Technical) to "+
					"check performance/capability of a candidate before the actual exam. "+
					"This portal is especially focussed on those competitive exams which "+
					"are not easily available online. Using this portal, a candidate can "+
					"take a test free of cost and analyze his/her weak and strong points "+
					"with the help of statistics in the form of graphs provided in the "+
					"report section after end of the test and able to improve his/her "+
					"weak points.</p>";
		$('.footer').find('.left').append(html);
	}
	else{
		var html = "<div class='footerlinks'>";
		if(this.data.exams.length > 0){
			html += "<div><h5>Exams</h5>";
			for(var exam in this.data.exams){
				html += "<a data-id = '"+this.data.exams[exam].id+"' data-type='exam'>"+this.data.exams[exam].title+"</a>"; 
			}
			html += "</div>";
		}
		if(this.data.quizzes.length > 0){
			html += "<div><h5>Quizzes</h5>";
			for(var quiz in this.data.quizzes){
				html += "<a data-id = '"+this.data.quizzes[quiz].id+"' data-type='quiz'>"+this.data.quizzes[quiz].title+"</a>"; 
			}
			html += "</div>";
		}
		html += "</div>"
		$('.footer').find('.left').append(html);
		$('.footer').find('.left').find('a[data-id]').unbind().bind('click', function(e){
			window.location.href = $(e.currentTarget).attr('data-type')+".html?id="+$(e.currentTarget).attr('data-id');
		});
	}
};