sessions.login(["Login Successful", "fa-thumbs-up", "<%= escape_javascript(render('sessions/login_confirmation')) %>"], "<%= escape_javascript(render('shared/navbar')) %>", <%= @current_user.bookmarks.pluck(:story_id) %>);