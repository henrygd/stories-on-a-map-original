var UniversalScripts = {
  initiate: function(){
    var StoryModalElem = $('#story-modal');
  	// var winHeight = $(window).height();
  	// Check login status
  	MyAjax.checkLogin();
  	// Loading icon
  	// MyAjax.loadingIcon();
  	// Font selection binding
  	// StoryModal.font.bindFaceSelect();
  	// Set max popup size
  	// $('#popup_inner').css('max-height', winHeight * 0.97 - 58 + 'px');
  	$('#home_popup')//.css('max-height', winHeight * 0.97 + 'px')
      .on('focus', 'input', function() {
        $(this).removeClass('input-error');
      });
  	// story modal image parallax effect
    var changeHeader = (function() {
      var header = StoryModalElem.find('#svg_holder');
      var height = header.height();
      return function() {
        var pos = $(this).scrollTop();
        if (pos < height)
          header.css('transform', 'translate3d(0, ' + pos * 0.4 + 'px, 0)');
      };
    })();
    StoryModalElem.on('scroll', changeHeader);
    // enlarge story images w/ bigpicture.js
    StoryModal.handleImages();
    // audio load on click
    StoryModalElem.on('click', '.fa-volume-up', function(e) {
      var el = $(e.target);
      if (el.hasClass('rotate720')) {
        el.removeClass('rotate720');
        $('#story-content').find('audio').remove();
        return;
      }
      var audioFile = $(e.target).attr('file').split(/.\w+$/)[0];
      var audioEl = document.createElement('AUDIO');
      audioEl.autoplay = true;
      audioEl.controls = true;
      // audioEl.preload = true;
      el.addClass('rotate720');
      ['.ogg', '.mp3'].forEach(function(fileType) {
        var source = document.createElement('SOURCE');
        source.src = audioFile + fileType;
        audioEl.appendChild(source);
      });
      $('#story-content').prepend(audioEl);
    });
    // make popup draggable
    $('#pu_head h2').dragmove();
    // window resize timeout
    window.addEventListener('resize', function() {
      clearTimeout(window.resizeTimeout);
      window.resizeTimeout = setTimeout(function() {
        $('#story-modal, #popup_inner').perfectScrollbar('update');
        userPage.updateTextAnim();
      }, 200);
    }, false);
  }
};

// jquery extension to make popup draggable
(function($) {
  $.fn.dragmove = function() {
    return this.each(function() {
      var $document = $(document),
        $trigger = $(this),
        // click = $trigger.parents('#home_popup'),
        dragThis = $trigger.parents('#home_popup'),
        active,
        startX,
        startY;

      $trigger.on('mousedown touchstart', function(e) {
        active = true;
        startX = e.originalEvent.pageX - dragThis.offset().left;
        startY = e.originalEvent.pageY - dragThis.offset().top;
        if (window.mozInnerScreenX === null)
          return false;
      });

      $document.on('mousemove touchmove', function(e) {
        if (active)
          dragThis.offset({
            left: e.originalEvent.pageX - startX,
            top: e.originalEvent.pageY - startY
          });
      }).on('mouseup touchend', function() {
        active = false;
      });
    });
  };
})(jQuery);