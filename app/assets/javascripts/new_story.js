var NewStory = {
  onLoadAction: function(){
    // set story images to random from unsplash
    function randImg(el) {
      return 'url(https://source.unsplash.com/category/nature/' + el.width() + 'x' + el.height() + ')';
    }
    $('#svg_holder, #image_one').css('background-image', randImg($('#svg_holder')));
    $('#modal-container, #image_two').css('background-image', randImg($('#modal-container')));
    // for modifying scrollbar
    this.article = $('article');
    this.articleHeight = 0;
    // Navbar.hide();
    // Load new map
    myMap.newStory.initialize();
    // Initialize options panel
    StoryModal.optionsPanel.initialize();
    // Display modal w/ animation
    setTimeout(function(){
      $('#modal-container, #story-modal').addClass('show-modal');
    }, 200);
    // Initialize scrollbar
    $('#story-modal').perfectScrollbar({
      scrollYMarginOffset: 8
    });
    // Update scrollbar on input
    this.article.bind('DOMSubtreeModified', function(e) {
      var el = e.target;
      if (el.tagName === 'IMG') {
        $(el).on('load', function() {
          $('#story-modal').perfectScrollbar('update');
        });
      }
      else {
        var curHeight = NewStory.article.height();
        if (curHeight !== NewStory.articleHeight) {
          NewStory.articleHeight = curHeight;
          $('#story-modal').perfectScrollbar('update');
        }
      }
    });
    // Image preview and validation bindings
    NewStory.bindImageChange();
    // Text editor
    var editor = new MediumEditor('.editable', {
      buttons: ['bold', 'italic', 'underline', 'quote', 'image'],
      buttonLabels: 'fontawesome',
      targetBlank: true
    });
    $('#close_image_panel').on('click', function(){
        NewStory.imagePanel.hide();
    });
    // Disable backspace history function
    // $(document).on('keydown', function(e){
    //   var $target = $(e.target||e.srcElement),
    //       input = $('h2, h3');
    //   if (e.keyCode == 8 && !$target.is(input)) {
    //     console.log('hello');
    //     e.preventDefault();
    //   }
    // });
    // show placeholder for title / author input
    $("[contenteditable]").focusout(function(){
        var element = $(this);        
        if (!element.text().trim().length) {
            element.empty();
        }
    });

    // hide instructions
    setTimeout(function(){
      $('#new_story_map').addClass('hide-instructions');
    }, 1700);

    // disable tabbing for image upload panel
    $('#image_upload_panel').find('button, input').attr('tabindex', '-1');

    // leave page confirmation
    window.onbeforeunload = function() {
      return "Are you sure you want to leave? Unsaved changes will be lost.";
    };

  },

  saveStory: function(){
    if (typeof(Storage) != 'undefined') {
      localStorage.setItem('story-title', $('#story-title').text());
      localStorage.setItem('story-author', $('#story-author').text());
      localStorage.setItem('story-content', $('#story-content').html());
      localStorage.setItem('story_coords', $('#story_coords').val() || '39, -95');
      localStorage.setItem('story-picture', $('#image_one').css('background-image'));
      localStorage.setItem('story-background', $('#image_two').css('background-image'));
    } 
    else {
      alert('Sorry, your browser does not support in-browser web storage');
    }
  },

  loadStory: function(){
    if (typeof(Storage) !== 'undefined') {
      var coords = localStorage.getItem('story_coords');
      var modal = document.getElementById('story-modal');
      // fill story text
      $('#story-title').text(localStorage.getItem('story-title'));
      $('#story-author').text(localStorage.getItem('story-author'));
      $('#story-content').html(localStorage.getItem('story-content'));
      $('#modal-container, #image_two').css('background-image', localStorage.getItem('story-background'));
      $('#svg_holder, #image_one').css('background-image', localStorage.getItem('story-picture'));
      // update map
      $('#story_coords').val(coords);
      myMap.newStory.setMarker(coords);
      // update scrollbar
      setTimeout(function() {
        StoryModal.scrollbar.update();
      }, 200);
    }
    else {
      alert('Sorry, your browser does not support in-browser web storage');
    }
  },

  bindImageChange: function(){
    $("#story_picture, #story_background").on('change', function(){
      if (this.value === ''){
        if (this.id === 'story_background'){
          $('#modal-container, #image_two').css('background-image', 'none');
        }
        else{
          $('#svg_holder, #image_one').css('background-image', 'none');
        }
      }
      else {
        if (NewStory.validateImage(this) === true)
          NewStory.imagePreview(this);
        else
          this.value = '';
      }
    });
  },

  imagePreview: function(input){
    if (input.files && input.files[0]) {
      var reader = new FileReader();
      reader.onload = function (e) {
        var image = e.target.result;
        if (input.id === 'story_background'){
          $('#modal-container, #image_two').css('background-image',
            'url(' + image + ')');
        }
        else {
          $('#svg_holder, #image_one').css('background-image', 'url(' + image + ')');
        }
      };
      reader.readAsDataURL(input.files[0]);
    }
  },

  validateImage: function(input){
    var size_in_megabytes = input.files[0].size/1024/1024,
        desired_size = 1;
    if (input.id === 'story_background')
      desired_size = 2;
    if (size_in_megabytes > desired_size){
      alert('Maximum file size is ' + desired_size +
        'MB. Please choose a smaller file.');
    }
    else
      return true;
  },

  validateForm: function(){
    if (localStorage.is_logged_in === 'false') {
      MyAjax.popupForm('Please Log In', 'fa-exclamation-triangle', "<div class='pu-info'><p>You must <a data-remote='true' href='/login'>log in</a> or <a data-remote='true' href='/signup'>sign up</a> to complete this action.</p></div>");
      $('body').removeClass('cursor-wait');
      return;
    }
    var errors = [];
    var author         = $('#story-author').text(),
        title          = $('#story-title').text(),
        content        = $('#story-content').html().trim(),
        coords         = $('#story_coords').val(),
        story_pic      = $('#svg_holder').css('background-image'),
        background_pic = $('#modal-container').css('background-image');
    // Check for errors
    if (author === '')
      errors.push('Author name is blank');
    if (title === '')
      errors.push('Story title is blank');
    if (content === '')
      errors.push('Story content is blank');
    if (coords === '')
      errors.push('Cannot read map position');
    if (story_pic.indexOf('data:image') === -1)
      errors.push('Please choose or rechoose your own story image');
    if (background_pic.indexOf('data:image') === -1)
      errors.push('Please choose or rechoose your own background image');
    if (errors.length > 0) {
      // Present user with errors
      MyAjax.popupForm("Error", "fa-exclamation-triangle", 
                       '<div class="pu-info pu-error"><ul><li>' + 
                       errors.join('</li><li>') + '</li></ul></div>');
    }
    // Submit story
    else {
      if ($('body').hasClass('cursor-wait')) {
        return;
      }
      else {
        $('body').addClass('cursor-wait');
      }
      var dataURItoBlob = function(dataURI) {
          var byteString = atob(dataURI.split(',')[1]);
          var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
          var fileExtension = mimeString.replace(/^\w*\//, '');
          var ab = new ArrayBuffer(byteString.length);
          var ia = new Uint8Array(ab);
          for (var i = 0; i < byteString.length; i++) {
              ia[i] = byteString.charCodeAt(i);
          }
          console.log(fileExtension);
          return [new Blob([ab], { type: mimeString }), fileExtension];
      };
      var getBlob = function(img) {
        return dataURItoBlob(img.replace(/^url|[\(|\)|'|"]/g, ''));
      };
      var form = new FormData();
      var img1 = getBlob(story_pic);
      var img2 = getBlob(background_pic);
      var add = 'append';
      form[add]('story[author]', author);
      form[add]('story[coords]', coords);
      form[add]('story[title]', title);
      form[add]('story[content]', content.replace(' rotate720', ''));
      form[add]('story[picture]', img1[0], 'pic.' + img1[1]);
      form[add]('story[background]', img2[0], 'back.' + img2[1]);
      form[add]('X-Http-Accept', 'text/javascript, application/javascript');
      $.ajax({
        method: 'POST',
        url: '/stories',
        data: form,
        processData: false,
        contentType: false,
        dataType: 'script'
      });
    }
  },

  imagePanel: {
    show: function(){
      $('body').addClass('show-image-upload-panel');
    },
    hide: function(){
      $('body').removeClass('show-image-upload-panel');
    }
  }

};