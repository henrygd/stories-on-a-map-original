var ShowStory = {
  onLoad: function(story_id){
    currentStory = story_id;
    // initiate scrollbar
    $('#story-modal').perfectScrollbar({
      scrollYMarginOffset: 8
    });
    // Show options info on options panel hover
    StoryModal.optionsPanel.initialize();    

    // hide navbar for more reading space / add open handler to story images
    setTimeout(function() {
      Navbar.hide();
      // StoryModal.scrollbar.update();
      $('#modal-container, #story-modal')
        .addClass('show-modal');
      //   .find('img').on('load', function() {
      //     $('#story-modal').perfectScrollbar('update');
      // });
    }, 500);
  }
};