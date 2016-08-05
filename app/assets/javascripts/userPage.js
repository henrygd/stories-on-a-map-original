userPage = {
  initiate: function() {
    var containers = $('.story-container');
    this.storyContainers = [
      new storyContainer({
        el: containers[0],
        stories: userPage.createdStories,
        type: 'createdStories'
      }),
      new storyContainer({
        el: containers[1],
        stories: userPage.bookmarks,
        type: 'bookmarks'
      })
    ];
  },

  updateDeletedStories: function() {
    var deletedStories = userPage.deletedStories;
    userPage.storyContainers.forEach(function(container) {
      var stories = container.storiesCopy;
      var length = stories.length;
      for (var i = 0; i < length; i++) {
        if (deletedStories.indexOf(stories[i].id) > -1) {
          container.storiesCopy.remove(i);
          break;
        }
      }
    });
  },

  updateDeletedBookmarks: function() {
    var deletedBookmarks = userPage.deletedBookmarks;
    var container = userPage.storyContainers[1];
    var stories = container.storiesCopy;
    var length = stories.length;
    for (var i = 0; i < length; i++) {
      if (deletedBookmarks.indexOf(stories[i].id) > -1) {
        container.storiesCopy.remove(i);
        break;
      }
    }
  },

  updateTextAnim: function() {
    var ps = document.querySelectorAll('.story-info p');
    var style = '<style id="userstyle">';
    [].forEach.call(ps, function(el, index) {
      var height = el.clientHeight / 2;
      var parentProject = el.parentElement.parentElement;
      function transformStyle(i) {
        var stylee = 'transform:translate3d(-50%, ' + i + height + 'px, 0);';
        return '-webkit-' + stylee + stylee;
      }
      style += '.story:nth-child(' + (index + 1) + '):hover h4{' + transformStyle('-') + 
        '}.story:nth-child(' + (index + 1) + '):hover .story-buttons{' + transformStyle('') + '}';
    });
    style += '</style>';
    var userStyle = $('#userstyle');
    if (userStyle.length > 0)
      userStyle[0].outerHTML = style;
    else
      document.head.insertAdjacentHTML('beforeend', style);
  },
};

function storyContainer(opts) {
  var that = this;
  this.el = opts.el;
  this.type = opts.type;
  this.stories = opts.stories;
  this.storiesCopy = opts.stories.slice(0);
  this.sortButtons = $(opts.el).find('.subheading > button');
  this.showMoreEl = $(opts.el).find('.view-more');
  this.sortButtons.bind('click', function(e) {
    that.changeSort(e);
  });
  this.showMoreEl.bind('click', function(){
    that.showMore();
  });
  this.showMore();
}

storyContainer.prototype.showMore = function() {
  var stories = this.stories;
  if (stories.length === 0) {
    return false;
  }
  var storyHTML = '';
  var loopLength = stories.length > 6 ? 6 : stories.length;
  for (var i = 0; i < loopLength; i++) {
    var story = stories.pop();
    storyHTML += 
      '<div class="story" style="background-image:url(' + story.img + ')">' +
        '<H4 class="fa fa-book">' + story.title + '</H4>' +
        '<div class="story-info"><p>' + story.info + '</p></div>' +
        '<div class="story-buttons">' +
          (story.url ? '<a id="' + story.id + '" href="/stories/' + story.url +  '" data-sid="' + story.id + '" class="button but-website fa fa-newspaper-o">Read</a> ' : '') +
          (userPage.ownPage && this.type === 'createdStories' ? '<a data-confirm="Are you sure?" data-remote="true" data-method="delete" href="/stories/' + story.url + '" class="button but-delete fa fa-trash-o">Delete</a>' : '') +
          (userPage.ownPage && this.type === 'bookmarks' ? '<a data-remote="true" data-method="delete" href="/bookmarks/' + story.id + '" class="button but-delete fa fa-trash-o">Remove</a>' : '') +
        '</div>' +
      '</div>';
  }
  this.showMoreEl[0].insertAdjacentHTML('beforebegin', storyHTML);
  this.updateStoryCount();
  // update p height
  userPage.updateTextAnim();
};

storyContainer.prototype.updateStoryCount = function() {
  var count = this.stories.length > 6 ? 6 : this.stories.length;
  var message = count > 0 ? 'Show next ' +  count : "That's all for now";
  if (count > 0)
    this.showMoreEl.text(message).show();
  else
    this.showMoreEl.hide();
};


storyContainer.prototype.changeSort = function(e) {
  if ($(e.target).hasClass('sortStyle'))
    return false;
  // remove stories
  $(this.el).find('.story').remove();
  // restore array to before stories had been popped
  this.stories = this.storiesCopy.slice(0);
  // reverse arry if old to new requested
  if (e.target === this.sortButtons[1]) {
    this.stories.reverse();
  }
  // put stories back on page
  this.showMore();
  // toggle check style
  this.sortButtons.each(function() {
    $(this).toggleClass('sortStyle');
  });
};


// Array Remove - By John Resig (MIT Licensed)
Array.prototype.remove = function(from, to) {
  var rest = this.slice((to || from) + 1 || this.length);
  this.length = from < 0 ? this.length + from : from;
  return this.push.apply(this, rest);
};