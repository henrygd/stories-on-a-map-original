// $('body').html("<%= escape_javascript(render('show_story')) %>");
window.onbeforeunload = '';
location.assign(location.origin + '/stories/<%= @story.munged_title %>');