MyAjax.popupForm("Error", "fa-exclamation-triangle", "<%= escape_javascript(render('stories/form_errors')) %>");
$("#loading-icon").hide();
$('body').removeClass('cursor-wait');
NewStory.bindImageChange();