'use strict';

/**
 * PageTurner
 * @summary Creates pages out of identical html items with built in search
 * @version 1.0.0
 * @copyright Nicolas James Hampton 2016
 * @license MIT
 */

var $ = (typeof module == "undefined") ? $ : require('jquery');

/**
 * Configures the settings for the PageTurner instance
 * @constructor PageTurner
 *
 */
function PageTurner(options) {
  if(!options) {options = {};}

  var defaults = {
    "animate": "",
    "currentPage": 'body',
    "itemClass": 'page-item',
    "itemsOnPage": 10,
    "paginationClass": 'pagination',
    "paginationElement": 'div',
    "paginationStyles": {
      "display": "inline-block",
      "padding": "20px",
      "background-color": "silver",
      "border-radius": "8px",
      "margin": "5px",
      "font-weight": "600",
    },
    "activeLinkStyles": {
      "child": {"color": "black",},
      "parent": {"background-color": "white",}
    },
    "inactiveLinkStyles": {
      "child": {"color": "white",},
      "parent": {"background-color": "silver",}
    }
  };

  this.host = {};

  var config = $.extend( {}, defaults, options );

  Object.keys(config).map(setting => this.host[setting] = config[setting]);

}

/**
 * Render method
 * Used to attach PageTurner object to DOM
 * and Initialization code
 * @memberof PageTurner
 */
PageTurner.prototype.render = function() {
  var pagination = this.createPage(0, this.host.itemClass);
  $(this.host.currentPage).append(pagination);
};

/**
 * createPage method
 * Used by run and createPageLink
 * @memberof PageTurner
 *
 * @param {Number} pageIndex: Integer - Page number you want to display (starts at 0)
 * @param {String} entries: class to identify mathcing DOM elements - all possible items
 * @returns {jQueryObject} pagination pagination menu with links attached
 */
PageTurner.prototype.createPage = function(pageIndex, entries) {
  var navObj = this.displayPage(pageIndex, entries);
  var navList = this.createPageNavList(navObj);
  var pagination = $('<' + this.host.paginationElement +
                     ' class="' + this.host.paginationClass + '"></' +
                     this.host.paginationElement + '>');
  pagination.append(navList);
  pagination.css({"display": "block", "text-align": "center"});
  return pagination;
};

/**
 * displayPage method
 * Used by createPage
 * @memberof PageTurner
 *
 * @param {Number} pageIndex: Integer - Page number you want to display (starts at 0)
 * @param {String} entries: class to identify mathcing DOM elements - all possible items
 * @returns {Object} navObj: {entries: jQueryObject, page: Number}
 */
PageTurner.prototype.displayPage = function(pageIndex, entries) {
  var that = this;
  // Bottom of list to display
  var bottom = pageIndex * this.host.itemsOnPage;
  // Top of list to display
  var top = pageIndex * this.host.itemsOnPage + (this.host.itemsOnPage - 1);

  $("." + entries).each(function() {
    $(this).hide();
  });

  $("." + entries).each(function(index){
    // if the entry is in the matches and on this page
    if (index >= bottom && index <= top) {
      // Then show it
      (that.host.animate) ? $(this).show(that.host.animate) : $(this).show();
    }
  });

  return {"entries": $("." + entries), "page": pageIndex}; // This is the navObj
};

/**
 * createPageNavList method
 * Used by createPage
 * @memberof PageTurner
 *
 * @param {Object} navObj: {entries: jQueryObject, page: Number}
 * @returns {jQueryObject} pageList unordered list of navigation links
 */
PageTurner.prototype.createPageNavList = function(navObj) {
  // Create nav list.
  var navList = $('<ul></ul>').css("display", "block");
  // Get the number of pages needed.
  var navIndex = Math.ceil(navObj.entries.length / this.host.itemsOnPage);

  for(var i = 0; i < navIndex; i++) { // for each page...
    var pageLink = this.createPageLink(i, navObj); // create a link...
    navList.append(pageLink); // and attach it to nav list.
  }
  return navList;
};

/**
 * createPageLink method
 * Used by createPageNavList
 * @memberof PageTurner
 *
 * @param {Number} pageIndex: Integer - number of page starting with 0
 * @param {Object} navObj: {entries: jQueryObject, page: Number}
 * @returns {jQueryObject} pageList unordered list of navigation links
 */
PageTurner.prototype.createPageLink = function(pageIndex, navObj) {
  var that = this;
  var pageNumberText = pageIndex + 1;
  var pageLink = $('<li><a href="#"></a></li>'); // create a link...
  pageLink.attr('data-page', pageIndex);
  pageLink.css(this.host.paginationStyles)
          .children().css(this.host.inactiveLinkStyles.child);

  // If this page is the current page, mark the link as active
  if (navObj.page == pageIndex) {
    pageLink.css(this.host.activeLinkStyles.parent)
            .children().css(this.host.activeLinkStyles.child)
            .addClass('active');
  }

  // Add the link text and on click handler
  pageLink.children().text(pageNumberText).click(function(e) {
    // Prevent the link from leaving the page
    e.preventDefault();

    // Mark it active
    $(this).addClass('active').css(that.host.activeLinkStyles.child)
    .parent().css(that.host.activeLinkStyles.parent);

    // Remove active class from any other link
    $(this).parent().siblings().css(that.host.inactiveLinkStyles.parent)
    .children().removeClass('active').css(that.host.inactiveLinkStyles.child);

    // Change the page
    that.createPage($(this).parent().attr('data-page'), that.host.itemClass);
  });

  return pageLink;
};


(typeof module == "undefined")
? window.PageTurner = PageTurner:
  module.exports = PageTurner;
