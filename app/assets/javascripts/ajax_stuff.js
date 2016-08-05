$(function() {
  var MA = window.MyAjax = {},
      loadingIcon = $("#loading-icon"),
      puHead = $('#pu_head').find('h2'),
      puInner = $('#popup_inner');

  $(document).bind("ajaxSend", function(){
    loadingIcon.show();
  }).bind("ajaxComplete", function(){
    loadingIcon.hide();
  });

  // Displays ajax response in popup modal
  MA.popupForm = function(heading, icon, body){
    puHead.html('<i class="fa ' + icon + '"></i> ' + heading);
    puInner.html(body);
    HomePopup.show();
    return this;
  };
  // Replace current navbar with newly rendered navbar
  MA.newNavbar = function(newBar){
    $('#navbar')[0].outerHTML = newBar;
    Navbar.initialize();
  };
  // Request new navbar if cached navbar doesn't match login status
  MA.checkLogin = function(){
  try {
    var is_logged_in = localStorage.getItem('is_logged_in');
    if (is_logged_in === 'true' && $('#login_link').length > 0)
      $.getScript('/scripts/newnavbar.js');
    else if (is_logged_in === 'false' && $('#account_link').length > 0)
      $.getScript('/scripts/newnavbar.js');
  } catch (e) {
    alert('To function properly, this site requires a browser which supports local storage');
  }

  };
});