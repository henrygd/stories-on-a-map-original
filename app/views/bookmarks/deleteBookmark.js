var id = <%= @bookmark.story_id %>;
$('.bookmarks-container [data-sid=' + id + ']').parents('.story').hide();
if (userPage.deletedBookmarks)
  userPage.deletedBookmarks.push(id);
else
  userPage.deletedBookmarks = [id];
userPage.updateDeletedBookmarks();