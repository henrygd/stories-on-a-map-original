$(function() {
  var global = window,
      GlobalNavbar = global.Navbar = {},
      navbarEl,
      submenu,
      navbarClose,
      submenuContainer,
      menuIcon;

  // expose show / hide / initialize for use elsewhere
  GlobalNavbar.initialize = initialize;
  GlobalNavbar.show = show;
  GlobalNavbar.hide = hide;
  
  function initialize(){
    navbarEl = $('#navbar');
    submenu = $('#submenu');
    navbarClose = $('#navbar_close');
    submenuContainer = $('#submenu_container');
    menuIcon = $('#menu_icon');
    // Click / hover bindings for submenu functionality
    var submenuLink = $('#navbar_more');

    submenuLink.on('click', function(e){
      if (submenu.hasClass('show-submenu'))
        hideSubmenu();
      else
        showSubmenu();
      e.preventDefault();
    });

    // cross icon / hamburger icon click functions
    navbarClose.on('click', function(){
      if ($(global).width() < 768)
        toggleMobileMenu();
      else
        hide();
    });
    menuIcon.on('click', show);

    resize();

    $(global).on('resize', resize);
  }

  function resize() {
    var width = navbarEl.width();
    var space = width - 500;
    var itemSpace = Math.floor(space / 250);
    var elems = $('#navbar-menu').find('.nav-link');
    var elemsLength = elems.length;

    if (width < 768) {
      submenu.append(elems);
      submenuContainer.removeClass('hide');
      return;
    }

    if (itemSpace === 0) {
      submenu.append(elems);
      submenuContainer.removeClass('hide');
    }
    else if (itemSpace >= elemsLength - 2) {
      submenuContainer.before(elems).addClass('hide');
    }
    else {
      submenu.append(elems.slice(itemSpace, elemsLength));
      submenuContainer.before(elems.slice(0, itemSpace))
        .removeClass('hide');
    }
  }

  function showSubmenu(){
    var submenu = submenu;
      submenu.addClass('show-submenu');
      setTimeout(function(){
        $('body').one('click', function(){
          hideSubmenu();
        });
      }, 20);
  }

  function hideSubmenu(){
    submenu.removeClass('show-submenu');
  }

  function hide(){
    navbarEl.addClass('hide-nav');
    showMenuIcon();
  }

  function show(){
    navbarEl.removeClass('hide-nav');
    hideMenuIcon();
  }

  function hideMenuIcon(){
    menuIcon.removeClass('show-menu-icon');
  }

  function showMenuIcon(){
    menuIcon.addClass('show-menu-icon');
  }

  function toggleMobileMenu(){
    if (submenuContainer.hasClass('hide-mobile')) {
      submenuContainer.removeClass('hide-mobile');
      navbarClose.addClass('navbar-cross');
      setTimeout(function(){
        $('body').one('click', function(){
          submenuContainer.addClass('hide-mobile');
          navbarClose.removeClass('navbar-cross');
        });
      }, 20);
    }
    else {
      submenuContainer.addClass('hide-mobile');
      navbarClose.removeClass('navbar-cross');
    }
  }
  
  initialize();
});