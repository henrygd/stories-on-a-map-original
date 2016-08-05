<% title = @story.munged_title %>
if (typeof(myMap.map) !== "undefined"){
  var coords = new google.maps.LatLng(<%= @story.coords %>);
  if ($('#modal-container').hasClass('show-modal'))
    StoryModal.hide();
  setTimeout(function(){
    myMap.map.panTo(coords);
    setTimeout(function() {
      myMap.markerClick('<%= title %>');
    }, 1000);
  }, 500);
}
else {
  location.assign(location.origin + '/stories/<%= title %>');
}