MyAjax.popupForm('Please Log In', 'fa-exclamation-triangle', "<div class='pu-info'><p>You must <%= escape_javascript(link_to 'Log in', login_path, remote: true) %> or <%= escape_javascript(link_to 'Sign up', signup_path, remote: true) %> to complete this action.</p></div>");
$('#bookmark_icon').removeClass().addClass('fa fa-bookmark-o');
$('body').removeClass('cursor-wait');