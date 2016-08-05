var id = <%= @story.id %>;
$('[data-sid=' + id + ']').parents('.story').hide();
if (userPage.deletedStories)
  userPage.deletedStories.push(id);
else
  userPage.deletedStories = [id];
userPage.updateDeletedStories();