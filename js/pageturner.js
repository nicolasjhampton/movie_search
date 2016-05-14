var PageTurner = (function($, window, document) {
  'use strict';

/*
 *  PageTurner Version 1.3.0
 *  Copyright Nicolas James Hampton 2016
 *  Creates pages out of identical html items
 *  with built in search
 *
 */
//.main-content
  var host = {};

  var defaults = {
    "currentPage": $('body'),
    "itemClass": 'movie',
    "itemList": $('#movies'),
    "itemsOnPage": 8,
    "paginationClass": 'pagination',
    "paginationElement": 'div'
  };

  /*
   * Constructor function for pageturner object
   *
   */
  function PageTurner(options) {
    if(!options) {options = {};}
    var config = $.extend( {}, defaults, options );
    $('.' + host.paginationClass).remove();
    Object.keys(config).map(function(setting) {
      host[setting] = config[setting];
    });
  }


  /*
   * Run method
   * Used to attach PageTurner object to DOM
   * and Initialization code
   *
   */
  PageTurner.prototype.run =  function() {
    var that = this;

    var pagination = createPage(0, host.itemClass);
    host.currentPage.append(pagination);
  };


  /*
   * displayPage method
   * Used by createPage
   *
   * @param pageIndex: Integer - Page number you want to display (starts at 0)
   *        entries: DOM element array - all possible items
   *        matches: DOM element array - all currently matching search items
   *
   * @returns navObj: Keys: Page
   *                        entries
   *                        matches
   *
   */
  var displayPage = function(pageIndex, entries) {

    //var itemsOnPage = 10; // number of items to display on a page
    var bottom = pageIndex * host.itemsOnPage; // Bottom of list to display
    var top = pageIndex * host.itemsOnPage + (host.itemsOnPage - 1); // Top of list to display

    $("." + entries).each(function() {
      $(this).hide();
    });


    host.itemList.show();
    $("." + entries).each(function(index){
      // if the entry is in the matches and on this page
      if (index >= bottom && index <= top) {
        $(this).fadeIn('slow'); // Then show it
      }
    });


    return {"entries": $("." + entries), "page":pageIndex}; // This is the navObj
  };


  /*
   * createPageLink method
   * Used by createPageNavList
   *
   * @param  pageIndex: Integer - number of page starting with 0
   *         navObj: Keys: Page
   *                       entries
   *                       matches
   *
   * @returns DOM list item element for a page number link
   *
   */
  var createPageLink = function(pageIndex, navObj) {
    var pageNumberText = pageIndex + 1;
    var pageLink = $('<li><a href="#"></a></li>'); // create a link...
    pageLink.attr('data-page', pageIndex);
    pageLink.css({"display": "inline-block",
                  "padding": "20px",
                  "background-color": "silver",
                  "border-radius": "8px",
                  "margin": "5px",
                  "font-weight": "600"})
            .children().css({"color": "white"});
    // If this page is the current page, mark the link as active
    if (navObj.page == pageIndex) {
      pageLink.css("background-color", "white").children().css({"color": "black"}).addClass('active');
    }
    pageLink.children().text(pageNumberText).click(function(e) { // Add the link text and on click handler
      // This is what happens when the link is clicked
      console.log($(this).parent().attr('data-page'));
      e.preventDefault(); // Prevent the link from leaving the page
      $(this).addClass('active').css({"color": "black"}).parent().css("background-color", "white"); // Mark it active
      $(this).parent().siblings().css("background-color", "silver").children().removeClass('active').css({"color": "white"}); // Remove active class from any other link
      createPage($(this).parent().attr('data-page'), host.itemClass); // Change the page
    });
    return pageLink;
  };


 /*
  * createPageNavList method
  * Used by createPage
  *
  * @param  navObj: Keys: Page
  *                       entries
  *                       matches
  *
  * @returns DOM unordered list element for a page navigation
  *
  */
  var createPageNavList = function(navObj) {
    var navList = $('<ul></ul>').css("display", "block"); // Create nav list.
    var navIndex = Math.ceil(navObj.entries.length / host.itemsOnPage); // Get the number of pages needed.
    for(var i = 0; i < navIndex; i++) { // for each page...
      var pageLink = createPageLink(i, navObj); // create a link...
      navList.append(pageLink); // and attach it to nav list.
    }
    return navList;
  };


  /*
   * createPage method
   * Used by Search, createPageLink Initialization code
   *
   * @param pageIndex: Integer - Page number you want to display (starts at 0)
   *        entries: DOM element array - all possible items
   *        matches: DOM element array - all currently matching search items
   *
   * @returns DOM object with pages and navigation attached
   *
   */
  var createPage = function(pageIndex, entries) {
    var navObj = displayPage(pageIndex, entries);
    var navList = createPageNavList(navObj);
    var pagination = $('<' + host.paginationElement +
                       ' class="' + host.paginationClass + '"></' +
                       host.paginationElement + '>');
    pagination.append(navList);
    pagination.css({"display": "block", "text-align": "center"});
    return pagination;
  };


  return PageTurner;

})($, window, document);
