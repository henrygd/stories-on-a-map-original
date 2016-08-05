var Bookmarks = {
  // Create or delete a bookmark for the logged-in user
  sendRequest: function(type, storyID){
    $('#bookmark_icon').removeClass().addClass('fa fa-spinner fa-spin');
    $.ajax({
      global: false,
      type: type,
      url: '/bookmarks/' + storyID,
      success: function(data) {
        myBookmarks = data.ids;
        if (myBookmarks.indexOf(storyID) > -1)
          $('#bookmark_icon').removeClass().addClass('fa fa-bookmark');
        else
          $('#bookmark_icon').removeClass().addClass('fa fa-bookmark-o');
      }
    });
  },

  // Grab array of bookmarks and assign to global variable
  getIDs: function(){
    $.getJSON('/bookmarks/ids.json', function(data){
      myBookmarks = data.ids;
    });
  },

  // Bookmark link map integration / scrollbar update
  bindClick: function(){
    setTimeout(function() {
      $('#bookmark_popup').on('click', '.but-website', function(e){
        if (typeof(myMap.map) !== "undefined"){
          HomePopup.close();
          myMap.markerClick($(this.href.split('/')).last()[0]);
          e.preventDefault();
        }
      });
      $('#bookmark_popup .view-more').bind('click', function() {
        setTimeout(function() {
          $('#popup_inner').perfectScrollbar('update');
        }, 100);
      });
    }, 500);
  }
};