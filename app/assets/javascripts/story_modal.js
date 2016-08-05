$(function() {
  var global = window,
      doc = document,
      $body = $('body'),
      modalEl = doc.getElementById('story-modal'),
      container = doc.getElementById('story-container'),
      modalElems,
      backimage,
      storyTitle = $('#story-title'),
      storyAuthor = $('#story-author'),
      storyContent = $('#story-content'),
      bookmarkIcon = $('#bookmark_icon'),
      svgHolder = $('#svg_holder'),
      perfectScrollbarMethod = 'perfectScrollbar',
      imageLoader = $('#image_loader');
  global.StoryModal = {
    show: function(story){
      // random fallback image in case of error
      backimage = 'https://source.unsplash.com/1600x900';
      currentStory = story.id;

      // set page title
      doc.title = story.title + ' | Stories on a Map';

      // Fill in text
      storyTitle.text(story.title);
      storyAuthor.text(story.author);
      storyContent.html(story.content);

      // Check if story in bookmarks & change icon accordingly
      if (typeof(myBookmarks) != 'undefined' && 
          myBookmarks.indexOf(story.id) > -1)
        bookmarkIcon.removeClass().addClass('fa fa-bookmark');
      else if (bookmarkIcon.hasClass('fa-bookmark'))
        bookmarkIcon.removeClass().addClass('fa fa-bookmark-o');

      // Change story modal image
      if (story.picture.picture.url)
        svgHolder.css('background-image', 'url(' + story.picture.picture.url + ')');
      else
        svgHolder.css('background-image', 'url(' + backimage + ')');

      // Show story on background image load
      if (story.background.background.url)
        backimage = story.background.background.url;

      imageLoader.attr("src", backimage);

      $(modalEl)[perfectScrollbarMethod]({
        scrollYMarginOffset: 8
      });
      modalEl.scrollTop = 0;
    },
    
    hide: function(){
      doc.title = 'Stories on a Map';
      modalElems.removeClass('show-modal');
      $body.removeClass('fade-back-gradient');
      $('#image_panel').html('<i class="fa fa-picture-o"></i>');
      Navbar.show();
      $(modalEl)[perfectScrollbarMethod]('destroy');
      // $('#modal-container').css('pointer-events', 'none');
    },

    // initializeScrollbar: function(){
    //   $(modalEl)[perfectScrollbarMethod]({
    //     scrollYMarginOffset: 8
    //   });
    // },

    handleImages: function() {
      $(modalEl).on('click', 'img', function() {
        BigPicture.create({
          el: this
        });
      });
    },

    optionsPanel: {
      initialize: function(){
        // Show options info on options panel hover
        $('.panel-section').hover(
          // Mouse enter
          function(){
            StoryModal.optionsPanel.hover(this.id);
          },
          // Mouse leave
          function(){
            StoryModal.optionsPanel.hidePopup();
          }
        );
        // Route options click event to appropriate action
        $('.panel-section').click(function(){
          StoryModal.optionsPanel.click(this.id);
        });
      },

      hover: function(panel){
        var message;
        switch(panel){
          // Default view panels
          case 'close_panel':
            message = 'Return to the map';
            break;
          case 'bookmark_panel':
            message = 'Bookmark this story';
            break;
          case 'image_panel':
            message = 'Toggle story / background image';
            break;
          case 'twitter_panel':
            message = 'Tweet this story';
            break;
          case 'night_mode_panel':
            message = 'Toggle night mode';
            break;
          case 'font_panel':
            message = 'Font options';
            break;
          case 'fontface_panel':
            message = 'Choose font';
            break;
          case 'font_larger_panel':
            message = 'Increase font size';
            break;
          case 'font_smaller_panel':
            message = 'Decrease font size';
            break;
          case 'font_close_panel':
            message = 'Close font options';
            break;
          // Panels for new story creation
          case 'save_panel':
            message = 'Save your progress';
            break;
          case 'load_panel':
            message = 'Load last save';
            break;
          case 'img_upload_panel':
            message = 'Add header and background images';
            break;
          case 'audio_panel':
            message = 'Add story audio (optional)';
            break;
          case 'submit_panel':
            message = 'Submit story to the map';
            break;
          default:
            message = 'Error: we are bad at coding';
            break;
        }
        $('#options-popup').text(message).addClass('show-options');
      },

      click: function(panel){
        StoryModal.optionsPanel.hidePopup();
        switch(panel){
          case 'close_panel':
            if (myMap.map === undefined)
              window.location.assign('/');
            else {
              history.pushState({slug: ''}, null, '/');
              StoryModal.hide();
            }
            break;

          case 'bookmark_panel':
            if (bookmarkIcon.hasClass('fa-bookmark-o'))
              Bookmarks.sendRequest('POST', currentStory);
            else if (bookmarkIcon.hasClass('fa-bookmark'))
              Bookmarks.sendRequest('DELETE', currentStory);
            break;

          case 'image_panel':
            $(modalEl).toggleClass('show-modal');
            $body.toggleClass('fade-back-gradient');
            break;

          case 'twitter_panel':
            var width  = 575,
            height = 400,
            left   = ($(window).width()  - width)  / 2,
            top    = ($(window).height() - height) / 2,
            url    = 'https://twitter.com/share?url=' + 
                      encodeURIComponent(window.location.href.replace('?status=new', '')) +
                      '&text=' + encodeURIComponent('"' + storyTitle.text() +
                      '" by ' + storyAuthor.text());
            opts   = 'status=1' +
                     ',width='  + width  +
                     ',height=' + height +
                     ',top='    + top    +
                     ',left='   + left;
            window.open(url, 'twitter', opts);
            return false;

          case 'night_mode_panel':
            if ($body.hasClass('night-mode'))
              $body.removeClass('night-mode');
            else
              $body.addClass('night-mode');
            break;

          case 'font_panel':
            StoryModal.fontPopup.open();
            break;

          case 'font_larger_panel':
            StoryModal.font.changeSize('larger');
            break;

          case 'font_smaller_panel':
            StoryModal.font.changeSize('smaller');
            break;

          case 'font_close_panel':
            StoryModal.fontPopup.close();
            break;

          case 'save_panel':
            var intentToSave = confirm('Are you sure you want to save? This will ' +
              'overwrite all previous saves.');
            if (intentToSave === true){
              NewStory.saveStory();
            }
            break;

          case 'load_panel':
            var intentToLoad = confirm('Are you sure you want to load your last save?');
            if (intentToLoad === true){
              NewStory.loadStory();
            }
            break;

          case 'img_upload_panel':
            if ($body.hasClass('show-image-upload-panel'))
              NewStory.imagePanel.hide();
            else
              NewStory.imagePanel.show();
            break;

          case 'audio_panel':
            if (!NewStory.audioFile)
              NewStory.audioFile = 'http://example.mp3';
            MyAjax.popupForm('Audio', 'fa-volume-up', '<div class="pu-info">Enter link to mp3 or ogg file below. Many public domain recordings are available at <a target="_blank" href="https://librivox.org">librivox.org</a>.</p><form><input type="text" id="audio_input" style="text-align:center" placeholder="http://example.mp3"></form><input id="add_audio" type="submit" value="Add file" class="btn-purp" style="width:49%;margin: .5% .25% .5% .5%;"></input><input id="remove_audio" type="submit" value="Remove" class="btn-purp" style="width:49%;margin:.5% .5% .5% .25%;"></input>');
            $('#add_audio').on('click', function() {
              storyContent.find('.fa-volume-up, audio').remove();
              storyContent.prepend('<p><i class="fa fa-volume-up" file="' + $('#audio_input').val() + '" contenteditable="false"></p>');
              HomePopup.close();
            });
            $('#remove_audio').on('click', function() {
              storyContent.find('.fa-volume-up, audio').remove();
              HomePopup.close();
            });
            break;

          case 'submit_panel':
            NewStory.validateForm();
            break;

          default:
            return 'Panel not found';
        }
      },

      hidePopup: function(){
        $('#options-popup').removeClass('show-options');
      }
    },

    fontPopup: {
      open: (function() {
        var fontDivs = '';
        (function() {
          var fontArr = [
            'Josefin Sans',
            'Sans-Serif',
            'Serif',
            'Lato',
            'Open Sans',
            'Roboto',
            'Roboto Slab',
            'Helvetica'
          ];
          $.each(fontArr, function(index, font) {
            fontDivs += '<button style="font-family:' + font + '">' + font + '</button>';
          });
        })();
        return function() {
          if ($('#font-styles').length === 0) {
            $(doc.head).append("<link id='font-styles' href='https://fonts.googleapis.com/css?family=Open+Sans|Lato|Roboto|Roboto+Slab|Lora' rel='stylesheet' type='text/css'>");
          }
          MyAjax.popupForm('Font Options', 'fa-cog', '<div id="font_options">' + fontDivs + '<button id="decrease_font"><i class="fa fa-minus"></i> Decrease Size</button><button id="increase_font"><i class="fa fa-plus"></i> Increase Size</button></div>');
          $('#font_options').on('click', 'button', StoryModal.fontPopup.bindClick);
        };
      })(),

      bindClick: function() {
        var id = this.id;
        if (id) {
          var size = Number(storyContent.css('font-size').slice(0,2));
          if (id === 'increase_font' && size <= 35) {
            size += 1;
          }
          else if (size >= 11) {
            size -= 1;
          }
          storyContent.css('font-size', size + 'px');
        }
        else {
          var selectedFont = $(this).css('font-family');
          storyContent.css('font-family', selectedFont + ', helvetica, sans-serif');
        }
      $(modalEl)[perfectScrollbarMethod]('update');
      }
    }
  };

  function openModal() {
    // set background image
    $('#modal-container').css('background-image', 'url(' + backimage + ')');
    // hide navbar
    Navbar.hide();
    // remove loading icon
    $('body').removeClass('cursor-wait');
    setTimeout(function(){
      if (!modalElems) 
        modalElems = $('#modal-container, #story-modal');
      modalElems.addClass('show-modal');
    }, 100);
  }
  // return true if selection is in icon html
  // $.fn.inIcon = function (selection) {
  //   return this.html().indexOf(selection) > -1 ? true : false;
  // };

  imageLoader.on('load', openModal);
});