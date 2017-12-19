var DEFAULT_TAB = 'MySQL';
var TAB_PAGE_TYPE = 'tab';
var ABSOLUTE_LOADER = '<div class="spinner absoluteSpinner"><div class="double-bounce1"></div><div class="double-bounce2"></div></div>';
var activePage = '';
var activeTopicType = '';
var activeTab = DEFAULT_TAB;
var tabIds = ['MySQL', 'SQLServer', 'Oracle'];
//Amount of characters to show in a <td> before truncating
var PREVIEW_LENGTH = 1000;

loadPage()
//Load the page
function loadPage() {
  if (window.location.pathname == '/') { //Default to home
    $.get('/views/home.html?' + VERSION, function(response, data) {
      $('#contentContainer').html(response);
    })
    activePage = 'home';
  } else { //We at least have a pageType
    var pageType = getRouteProperty('pageType');
    var topicType = getRouteProperty('topicType');
    var tabType = getParameterByName('dbms');
    //If the page or topic type changed we should probably load new info
    if (activePage !== pageType || activeTopicType !== topicType) {
      $("#contentContainer").prepend(ABSOLUTE_LOADER);
      if (pageType != TAB_PAGE_TYPE) { //Tabbed pages need to be handled differently
        $.get('/views/' + pageType + '.html?' + VERSION, function(response, data) {
          if (response.indexOf('<head>') > -1 && response.indexOf('<title>SQL') > -1) {
            //Whatever view it is, we don't have it and it defaulted to index.html
            debugger;
            window.location.pathname = '/';
          } else {
            $('#contentContainer').html(response);
            if ($('#contentContainer .injectionDescription')) {
              loadInjectionDescriptions();
            }
          }
        })
      } else {
        //Tab pages have to load tab.html, then all the contents for each tab.
        //Put that in a staging area until it's all loaded so we don't get content popping in randomly
        $.get('/views/' + pageType + '.html?' + VERSION, function(response, data) {
          $('#contentContainerStage').html(response);
          loadTabs();
        })
      }
    } else if (activeTab !== tabType) {
      if (!tabType) {
        tabType = DEFAULT_TAB;
      }
      $('#injectionTabs a[href="#' + tabType + '"]').tab('show');
    }
    activePage = pageType;
    activeTab = tabType;
    activeTopicType = topicType;
  }
}

//Load all injection tabs
function loadTabs() {
  var sectionType = getRouteProperty('sectionType');
  var topicType = getRouteProperty('topicType');
  if (sectionType == null) {
    return; //Something happend.
  } else if (topicType == null) {
    topicType = sectionType; //For sectionTypes that only have one topicType
  }
  var promises = [];
  //Get all tabs that we need to load
  var tabs = $('#contentContainerStage .tab-pane').map(function(idx, elem) {
    return elem.id;
  })
  //Load each tab
  for (var i = 0; i < tabs.length; i++) {
    //Add each tab to a promise array
    promises.push($.get("/build/" + tabs[i] + "/" + sectionType + "/" + topicType + '.html?' + VERSION, (function() {
      //Using a closure here to save the tab.
      //Would use const instead of var, but IE SUCKS.
      var currTab = tabs[i];
      return function(response, status, test) {
        handleTabLoad(response, status, currTab)
      }
    })()))
  }
  //Wait until they're all loaded, so they can be displayed in unison
  $.when.apply($, promises).then(function() {
    var tabName = getParameterByName('dbms');
    if (!tabName) {
      tabName = DEFAULT_TAB;
    }
    //Transfer content from the staging area into the live area
    $('#contentContainer').html($('#contentContainerStage').html());
    //Load their injection descriptions.
    loadInjectionDescriptions();
    //Clear the staging area
    $('#contentContainerStage').html(null);
    //Select the active tab
    $('#injectionTabs a[href="#' + tabName + '"]').tab('show');
  })
}

//For use in loadTabs()
//Handle the response from a GET request for a specific tab
//Load the current tab into the staging area, to be transferred to the live area after all tabs load
function handleTabLoad(response, status, tab) {
  //When a page doesn't exist we return /index.html, this allows us to use real URL paths.
  //If we try to load a view that doesn't exist, check if it has a head and a title, that's the indicator that it errored back to /index.html
  //Crappy...I know.
  if (response.indexOf('<head>') > -1 && response.indexOf('<title>SQL') > -1) {
    $("#contentContainerStage #" + tab).html("<p class=\"readableText\">No data yet, please contribute on our <a href=\"https://github.com/NetSPI/SQLInjectionWiki\" target=\"_blank\">Github</a> if you know any useful methods!</p>");
  } else {
    $('#contentContainerStage #' + tab).html(response);
    //Collapse any rows that have a ton of content
    $('#contentContainerStage #' + tab + ' td').each(function(idx, data) {
      if (data.innerText.length > PREVIEW_LENGTH) {
        data.innerHTML = "<div class=\"collapseRow\">" + data.innerHTML + getShowElement(true) + "</div>";
      }
    })
  }
}

//Load the descriptions for the current injection type
function loadInjectionDescriptions() {
  $('.injectionDescription').each(function(idx, description) {
    description.innerHTML = descriptions[description.id];
  })
}

//Toggle the show more/less object
function toggleRow() {
  this.event.target.parentElement.classList.toggle('open');
  if (this.event.target.parentElement.classList.contains('open')) {
    this.event.target.outerHTML = getShowElement(false);
  } else {
    this.event.target.outerHTML = getShowElement(true);
  }
}

//Adds show more and show less links around the data
function getShowElement(more) {
  if (more) {
    return "<div onClick=\"toggleRow(this)\" class=\"showMore\">Show more</div>"
  } else {
    return "<div onClick=\"toggleRow(this)\" class=\"showMore\">Show less</div>"
  }
}

//After all ajax requests have completed, remove the loading screen
$(document).ajaxStop(function() {
  $(document).off('ajaxStop');
  setTimeout(function() {
    $('#contentWrapper').removeClass('hidden');
    $('.loadWrapper').animate({
      'opacity': 0
    }, 250);
    setTimeout(function() {
      $('.loadWrapper').remove();
    }, 1000)
  }, 750);
})

//Initialize any "show more" links
//We have it with this weird 'body'.on syntax so that we don't have to add the handler
// to every new element.  This adds it to any future elements as well as current elements.
$('body').on('click', '.dataPreviewLink.showMore', function(e) {
  $(e.target).toggleClass('show');
  $($(e.target).parent()).find('.dataPreviewLink.showLess').toggleClass('show');
  $($(e.target).next('.dataPreview')).toggleClass('show');
})
$('body').on('click', '.dataPreviewLink.showLess', function(e) {
  $(e.target).toggleClass('show');
  $($(e.target).parent()).find('.dataPreviewLink.showMore').toggleClass('show');
  $($(e.target).prev('.dataPreview')).toggleClass('show');
})
