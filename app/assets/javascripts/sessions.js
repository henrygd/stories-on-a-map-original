var sessions = {
  login: function(popupHTML, navbarHTML, bookmarks){
    var bookmarkIcon = $('#bookmark_icon'),
        bookmarkClass = 'fa fa-bookmark';
    myBookmarks = bookmarks;
    localStorage.setItem('is_logged_in', 'true');
    MyAjax.popupForm(popupHTML[0], popupHTML[1], popupHTML[2])
          .newNavbar(navbarHTML);
    bookmarkClass = myBookmarks.indexOf(currentStory) > -1 ? bookmarkClass : bookmarkClass + '-o';
    bookmarkIcon.removeClass().addClass(bookmarkClass);
  },

  logout: function(popupHTML, navbarHTML){
    localStorage.setItem('is_logged_in', 'false');
    MyAjax.popupForm(popupHTML[0], popupHTML[1], popupHTML[2])
          .newNavbar(navbarHTML);
    delete window.myBookmarks;
  }
};