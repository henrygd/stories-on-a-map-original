HomePage = {
  onLoad: function(){
    // Initialize map and place markers
    myMap.initialize();
    // Generate array of bookmarks if logged in
    if (localStorage.getItem('is_logged_in') === 'true')
      Bookmarks.getIDs();
    // Initialize options panel
    StoryModal.optionsPanel.initialize();
    // Initialize scrollbar
    setTimeout(StoryModal.initializeScrollbar, 100);
    // Browser history manipulation 
    HomePage.pushState();
    // get stories
    setTimeout(function() {
      $.getJSON( "storylist.json", function(stories) {
        stories.forEach(function(story, index) {
          myMap.newMarker(
            story[0], // coordinates
            // 'book', // icon
            story[2] + '\n' + story[1],// title, author icon title
            story[3] // munged title
          );
        });
      });
    }, 1500);
  },

  pushState: function(){
    if (typeof(history.replaceState) !== "undefined") {
      history.replaceState({slug: ''}, null, null);
    }
    window.onpopstate = function (event) {
      if (event.state.slug !== '')
        StoryModal.show(event.state);
      else
        StoryModal.hide();
    };
  }
};