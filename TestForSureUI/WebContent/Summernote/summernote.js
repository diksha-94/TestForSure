var obj = null;
var summernoteController = function(){
	
};
summernoteController.getObj = function()
{
	if(obj == null){
		obj = new summernoteController();
	}
	return obj;
};
summernoteController.prototype.addEditor = function(dom)
{
	$(dom).summernote({
        height: 400,
        toolbar: [
                  ['insert', ['picture', 'link', 'math']],
                  ['para', ['ul', 'ol', 'paragraph']],
                  ['style', ['style', 'bold', 'italic', 'underline', 'strikethrough', 'clear', 'superscript', 'subscript']],
                  ['fonts', ['fontsize']],
                  ['color', ['color']],
                  ['undo', ['undo', 'redo']],
                  ['misc', ['table', 'hr', 'codeview', 'fullscreen']],
                  ['height', ['lineheight']]
                ],
    });
	$('.note-editor').find('.close').hide();
};
summernoteController.prototype.getValue = function(dom)
{
	return $(dom).siblings('.note-editor').find('.note-editable').html();
};
summernoteController.prototype.setValue = function(dom, value)
{
	$(dom).siblings('.note-editor').find('.note-editable').html(value);
};