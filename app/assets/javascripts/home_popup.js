$(function(){
  var mainContent = $('#main_content');
  window.HomePopup = {};
  // close popup on click x icon or outside
  $('#cross_close, #popup_overlay').click(function(){
    HomePopup.close();
  });
  HomePopup.show = function() {
    mainContent.addClass('show-popup-display');
    setTimeout(function(){
      mainContent.addClass('show-popup-fadein');
    }, 100);
    setTimeout(function(){
      $('#popup_inner').perfectScrollbar({
        scrollYMarginOffset: 8
      });
    }, 50);
  };
  HomePopup.close = function() {
    mainContent.removeClass('show-popup-fadein');
    setTimeout(function(){
      mainContent.removeClass('show-popup-display');
      $('#popup_inner').perfectScrollbar('destroy');
    }, 400);
  };
});

