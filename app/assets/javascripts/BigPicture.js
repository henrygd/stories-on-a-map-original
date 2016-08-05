// henrygd.me/BigPicture => mangled for site purposes
 (function() {

  var
    global = window,
    // create global object or add to existing
    BP = global.BigPicture = global.BigPicture || {},
    // trigger element used to open popup
    el,
    // set true after first interaction
    initialized,
    // popup image source
    displayElement,
    // popup image element
    displayImage,
    // popup video element
    openAnimation,
    // container element holding html needed for script
    container,
    // array of prev viewed image urls to check if cached before showing loading icon
    doc = document,
    getID = 'getElementById',
    listenFor ='addEventListener';

  BP.create = function(opts) {
    if (/bp_(container|img)/.test(opts.el.id)) {
      throw 'BigPicture called on own display element';
    }
    // called once on initial open to create elements / add event handlers
    if (!initialized) initialize();
    // add opts to main object
    for (var key in opts) {
      BP[key] = opts[key];
    }
    // set current el
    el = BP.el;
      displayElement = displayImage;
      displayImage.src = el.src;
  };

  // create all needed methods / store dom elements on first use
  function initialize() {
    // if needed elements don't exist, create them
    displayImage = doc[getID]('bp_img') || createEls();
    // store elements for easy lookup
    container = displayImage.parentNode;
    // click bindings for open / closing of image
    container[listenFor]('click', function (e) {
      close(e);
    });
    // display image bindings for image load and error
    displayImage[listenFor]('load', hideLoadingIcon);
    displayImage[listenFor]('error', function(){
      hideLoadingIcon('image');
    });
  }

  // create elements + style needed for script
  function createEls() {
    // #bp_container z-index must be the highest on your page!
    doc.head.insertAdjacentHTML('beforeend', '<style>#bp_container{bottom:0;left:0;right:0;visibility:hidden;position:fixed;top:0;z-index:99999999;background:rgba(0,0,0,.7);opacity:0;transition:opacity .35s}#bp_img,.bp-close{position:absolute;right:0;top:0}#bp_img{display:none;max-height:96%;max-width:96%;bottom:0;left:0;box-shadow:0 0 3em rgba(0,0,0,.5);transition:-webkit-transform .35s;transition:transform .35s;transition:transform .35s,-webkit-transform .35s}.bp-close{cursor:pointer;height:3.5em;width:3.5em;opacity:.85;background:url(data:image/svg+xml;charset=utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20357%20357%22%3E%3Cpath%20fill%3D%22%23FFF%22%20d%3D%22M357%2035.7L321.3%200%20178.5%20142.8%2035.7%200%200%2035.7l142.8%20142.8L0%20321.3%2035.7%20357l142.8-142.8L321.3%20357l35.7-35.7-142.8-142.8%22%2F%3E%3C%2Fsvg%3E) center center no-repeat;background-size:1.2em}.bp-close:hover{opacity:1!important}@media screen and (max-aspect-ratio:9/5){#bp_sv{height:54vw;width:96vw}}</style>');
    doc.body.insertAdjacentHTML('beforeend', '<div id="bp_container"><img id="bp_img"><div class="bp-close"></div></div>');
    return doc[getID]('bp_img');
  }

  // calculate size and position of initial element relative to full size image
  function getRect() {
    var rect = el.getBoundingClientRect();
    var leftOffset = rect.left - (container.clientWidth / 2 - rect.width / 2);
    var centerTop = rect.top - (container.clientHeight / 2 - rect.height / 2);
    var scaleWidth = el.clientWidth / displayElement.clientWidth;
    var scaleHeight = el.clientHeight / displayElement.clientHeight;
    return 'translate3D(' + leftOffset + 'px, ' + centerTop + 
      'px, 0) scale3D(' + scaleWidth + ', ' + scaleHeight + ', 0);';
  }

  // hides loading icon; displays error or routes to open method
  function hideLoadingIcon(err) {
    if (typeof(err) === 'string') {
      alert('Error: The requested ' + err + ' could not be displayed.');
    }
    else
      open();
  }

  function changeCSS(elem, newCSS, opt) {
    elem.style.cssText = newCSS;
  }
  function appendCSS(elem, newCSS) {
    elem.style.cssText += newCSS;
  }
  // return webkit friendly css
  function webkitify(css) {
    return '-webkit-' + css + css;
  }
  function webkitifyKeyframes(css) {
    return '@-webkit-' + css + '@' + css;
  }

  // animate open of image / video; display caption if needed
  function open() {
    changeCSS(displayElement, 'display:block;');
    appendCSS(displayElement, (
      webkitify('transition:none;') + 
      webkitify('transform:' + getRect())
    ));
    // animate opening / add caption 
    changeCSS(container, 'visibility:visible;opacity:1');
    openAnimation = setTimeout(function() {
      changeCSS(displayElement, 'display:block;margin:auto;' + webkitify('transform:none;'));
    }, 40);
  }

  // close active display image
  function close(e) {
    clearTimeout(openAnimation); 

    // changeCSS(displayElement, 'transform:' + transform);
    appendCSS(displayElement, webkitify('transform:' + getRect()));
    // displayElement.style.cssText += webkitify('transform:' + getRect());
    container.style.opacity = '0';

    setTimeout(function(){
      changeCSS(container, '');
      changeCSS(displayElement, '');
    }, 305);
  }

 })();
 