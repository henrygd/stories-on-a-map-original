MyAjax.popupForm("Bookmarks", "fa-bookmark", "<%= escape_javascript(render('bookmarks')) %>");
Bookmarks.bindClick();
userPage.bookmarks = [
  <% @bookmarks.each do |story| %>
    {
      id: <%= story.id %>,
      title: '<%= story.title %>',
      img: '<%= story.picture %>',
      info: '<%= story.author %>',
      url: '<%= story.munged_title %>',
    },
  <% end %>
];
new storyContainer({
  el: $('#bookmark_popup'),
  stories: userPage.bookmarks,
  type: 'bookmarks'
})