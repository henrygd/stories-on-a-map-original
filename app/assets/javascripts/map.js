(function() {
  // use png for icon if IE, svg if not
  var iconURL = '/static/img/' + 
    (window.navigator.userAgent.indexOf("MSIE ") > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./) ?
    'favicon.png' : 'book_icon.svg');
  myMap = {
    initialize: function(){
        var mapOptions = {
        center: { lat: 39, lng: -95},
        zoom: 4,
        minZoom: 2,
        mapTypeId: google.maps.MapTypeId.TERRAIN,
        disableDefaultUI: true,
        zoomControl: true,
        zoomControlOptions: {
          position: google.maps.ControlPosition.LEFT_CENTER
        }
      };
      myMap.map = new google.maps.Map(document.getElementById('map-canvas'),
          mapOptions);
    },

    newMarker: function(coords, title, munged_title){
      splitCoords = coords.split(', ');
      // switch (icon){
      // case 'notepad':
      //   icon = {url: '/static/img/notepad_icon.svg',
      //           scaledSize: new google.maps.Size(45, 45)};
      //   break;
      // default:
      //   icon = {url: '/static/img/book_icon.svg',
      //           scaledSize: new google.maps.Size(45, 45),
      //           origin: new google.maps.Point(0, 0),
      //           anchor: new google.maps.Point(22.5, 22.5)};
      // }
      var marker = new google.maps.Marker({
        position: new google.maps.LatLng(splitCoords[0], splitCoords[1]),
        map: myMap.map,
        title: title,
        munged_title: munged_title,
        icon: {url: iconURL,
                scaledSize: new google.maps.Size(45, 45),
                origin: new google.maps.Point(0, 0),
                anchor: new google.maps.Point(22.5, 22.5)}
      });
      google.maps.event.addListener(marker, 'click', function() {
        myMap.markerClick(this.munged_title);
      }); 
      return marker;
    },

    markerClick: function(munged_title){
      var url;
      $('body').addClass('cursor-wait');
      if (!$('#modal-container').hasClass('show-story'))
        url = '/stories/';
      $.getJSON('/stories/' + munged_title + '.json',
      function(story){
        history.pushState({
          slug: 'modal',
          title: story.title,
          author: story.author,
          id: story.id,
          content: story.content,
          picture: story.picture,
          background: story.background
        }, null, url + munged_title);
        StoryModal.show(story);
      });
    },

    newStory: {
      initialize: function(){
        // var marker;
        // var map;
        var myLatlng = new google.maps.LatLng(39,-95);

        var myOptions = {
            center: myLatlng,
            zoom: 3,
            mapTypeId: google.maps.MapTypeId.TERRAIN,
            disableDefaultUI: true,
            zoomControl: true,
            zoomControlOptions: {
              position: google.maps.ControlPosition.LEFT_CENTER
            }
        };

        newStoryMap = new google.maps.Map(
          document.getElementById('new_story_map'), myOptions
        );

        newStoryMarker = new google.maps.Marker({
            position: myLatlng,
            draggable: true,
            map: newStoryMap,
            icon: {url: iconURL,
                    scaledSize: new google.maps.Size(45, 45),
                    origin: new google.maps.Point(0, 0),
                    anchor: new google.maps.Point(22.5, 22.5)}
        });

        google.maps.event.addListener(newStoryMarker, 'dragend', function(a) {
            $('input[id="story_coords"]').val(
              a.latLng.lat().toFixed(6) + ", " +
              a.latLng.lng().toFixed(6)
            );
            newStoryMap.panTo(a.latLng);
        });
      },

      setMarker: function(coords){
        var splitCoords = coords.split(', ');
        var newCoords = new google.maps.LatLng(splitCoords[0], splitCoords[1]);
        newStoryMarker.setPosition(newCoords);
        newStoryMap.panTo(newCoords);
      }
    }
  };
})();