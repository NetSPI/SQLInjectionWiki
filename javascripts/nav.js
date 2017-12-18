var isMobile = $('.mobile:visible').length > 0;

//Load the nav bar and activate
$('.n-navbar').load("/views/nav.html?" + VERSION, () => {
  setActiveNav()
});

//When the navigation hamburger, or X, is clicked open/close it.
$('.n-nav-icon').click(function() {
  toggleNavigation();
  //Hide the scroll from the main content, so it doesn't affect the full nav on mobile
  if (isMobile) {
    if ($('.n-navbar').hasClass('active')) {
      $('body').addClass('noscroll');
    } else {
      $('body').removeClass('noscroll');
    }
  }
});

//On mobile
$(window).resize(function() {
  isMobile = $('.mobile:visible').length > 0;
  if (isMobile) {
    closeNavigation();
    $('body').removeClass('noscroll');
  } else if (getCookie('nav') == 'true' || getCookie('nav') == undefined) {
    openNavigation();
    $('body').removeClass('noscroll');
  }
})

//Highlight the page we are currently on in the nav
function setActiveNav() {
  $('.n-nav-item').removeClass('active');
  var pageType = getRouteProperty('pageType');
  var sectionType = getRouteProperty('sectionType');
  var topicType = getRouteProperty('topicType');
  //If there's no page, we're home
  if (window.location.pathname == '/') {
    $('#homeLink').addClass('active');
  } else if (!sectionType) { //If there's no topic type it's a top link
    $('#' + pageType + 'Link').addClass('active');
  } else { //if it's not a top link then it's a sub topic
    if (topicType == null) {
      topicType = sectionType;
    }
    $('#' + sectionType + ' #' + topicType).addClass('active');
  }
}

//Get a property from the route
/*
URL Schema: /pageType/sectionType/topicType?dbms=[dbms]
Example: /tab/injectionTypes/errorBased?dbms=MySQL
*/
function getRouteProperty(property) {
  var route = window.location.pathname.split('/');
  switch (property) {
    case 'pageType':
      return route[1];
    case 'sectionType':
      return route[2];
    case 'topicType':
      return route[3];
  }
}

//Update the tab(dbms) type
function updateTab(tab) {
  updateQueryStringParameter('dbms', tab);
}

//Update the route, takes a string with the new route.
function updateRoute(route) {
  if (route.indexOf('?') == -1) {
    window.history.pushState(null, new Date(), route + window.location.search);
  } else {
    window.history.pushState(null, new Date(), route);
  }
  if (isMobile) {
    closeNavigation();
  }
  loadPage();
  setActiveNav();
}

//Get a URL query parameter by name
function getParameterByName(name) {
  var url = window.location.href;
  name = name.replace(/[\[\]]/g, "\\$&");
  var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
    results = regex.exec(url);
  if (!results)
    return null;
  if (!results[2])
    return '';
  return decodeURIComponent(results[2].replace(/\+/g, " "));
}

//Update a query string paramter in the url
function updateQueryStringParameter(key, value) {
  var re = new RegExp("([?&])" + key + "=.*?(&|$)", "i");
  var uri = window.location.search;
  var separator = uri.indexOf('?') !== -1
    ? "&"
    : "?";
  if (uri.match(re)) {
    updateRoute(window.location.pathname + uri.replace(re, '$1' + key + "=" + value + '$2'))
  } else {
    updateRoute(window.location.pathname + uri + separator + key + "=" + value)
  }
}

//On forward/back buttons refresh everything
$(window).on("popstate", function(e) {
  loadPage();
  if (getRouteProperty('pageType') == TAB_PAGE_TYPE) {
    $('.nav-link').blur(); //A bug that when you hit the back/fowrard button a tab doesn't always blur
  }
  setActiveNav();
});

//Get a cookie value
function getCookie(name) {
  var value = "; " + document.cookie;
  var parts = value.split("; " + name + "=");
  if (parts.length == 2) {
    return parts.pop().split(";").shift();
  } else {
    return undefined;
  }
}

//If we're on mobile don't open the nav on default
if (getCookie('nav') == "false" || isMobile) {
  closeNavigation();
}

//Toggle the navigation
function toggleNavigation() {
  $('.n-nav-icon').toggleClass('open');
  $('.n-nav-icon').toggleClass('active');
  $(".n-navbar").toggleClass('active');
  if (!isMobile) { //Save the user's preference on desktop
    document.cookie = "nav=" + $('.n-navbar').hasClass('active');
  }
}

//Close the navigation
function closeNavigation() {
  $('.n-nav-icon').removeClass('open');
  $('.n-nav-icon').removeClass('active');
  $(".n-navbar").removeClass('active');
  $('body').removeClass('noscroll');
}
//Open the navigation
function openNavigation() {
  $('.n-nav-icon').addClass('open');
  $('.n-nav-icon').addClass('active');
  $('.n-navbar').addClass('active');
}
