"use strict";

var fs = require('fs');
var path = require('path');
var jsdom = require('mocha-jsdom');
var expect = require('chai').expect;
var html = fs.readFileSync(path.join(__dirname, 'test.html'), 'utf8');

describe("PageTurner", function() {

  // Arrange
  var $;
  var pageTurner;
  jsdom();

  before(function(done) {
    document.body.innerHTML = html;
    $ = require('jquery');
    var PageTurner = require('../pageturner.js');
    pageTurner = new PageTurner();
    done();
  });

  describe("createPage method", function() {

    it("should return a jQuery object", function() {
      // Act
      var pagination = pageTurner.createPage(1, pageTurner.host.itemClass);
      // Assert
      expect(pagination).to.have.property('jquery');
    });

    it("should have the appropriate number of links inside", function() {
      // Act
      var pagination = pageTurner.createPage(1, pageTurner.host.itemClass);
      // Assert
      expect(pagination.children().children()).to.have.lengthOf(6);
    });

  });

  describe("displayPage method", function() {

    it("should have the entries list in the object returned", function() {
      // Act
      var navObj = pageTurner.displayPage(1, pageTurner.host.itemClass);
      // Assert
      expect(navObj.entries).to.deep.equal($('.student-item'));
    });

    it("should have the current page index in the object returned", function() {
      // Act
      var navObj = pageTurner.displayPage(3, pageTurner.host.itemClass);
      // Assert
      expect(navObj.page).to.equal(3);
    });

    it("should show the correct amount of items", function() {
      // Act
      var navObj = pageTurner.displayPage(3, pageTurner.host.itemClass);
      var visible = $('.student-item').filter((index, element) => {
        return element.style.display != 'none';
      });
      // Assert
      expect(visible).to.have.lengthOf(10);
    });

    it("should show the correct first item", function() {
      // Act
      var navObj = pageTurner.displayPage(3, pageTurner.host.itemClass);
      var visible = $('.student-item').filter((index, element) => {
        return element.style.display != 'none';
      });
      // Assert
      expect(visible[0].innerHTML).to.contain('matthew.fortin@example.com');
    });

    it("should show the correct last item", function() {
      // Act
      var navObj = pageTurner.displayPage(3, pageTurner.host.itemClass);
      var visible = $('.student-item').filter((index, element) => {
        return element.style.display != 'none';
      });
      // Assert
      expect(visible[9].innerHTML).to.contain('devon.barnes@example.com');
    });


  });

  describe("createPageNavList method", function() {

    var navObj;

    before(function() {
      navObj = {
        "entries": $("." + pageTurner.host.itemClass),
        "page": 2
      }
    });

    it("should return a jQuery object", function() {
      // Act
      var navList = pageTurner.createPageNavList(navObj);
      // Assert
      expect(navList).to.have.property('jquery');
    });

    it("should have the appropriate number of links inside", function() {
      // Act
      var navList = pageTurner.createPageNavList(navObj);
      // Assert
      expect(navList.children()).to.have.lengthOf(6);
    });

  });

  describe("createPageLink method", function() {

    var navObj;

    before(function() { //pageIndex, navObj
      navObj = {
        "entries": $("." + pageTurner.host.itemClass),
        "page": 4
      }
    });

    it("should return a jQuery object", function() {
      // Act
      var navLink = pageTurner.createPageLink(4, navObj);
      // Assert
      expect(navLink).to.have.property('jquery');
    });

    it("should have the appropriate page number", function() {
      // Act
      var navLink = pageTurner.createPageLink(4, navObj);
      // Assert
      expect(navLink.children().text()).to.equal('5');
    });

    it("should have active state on current page number", function() {
      // Act
      var navLink = pageTurner.createPageLink(4, navObj);
      // Assert
      expect(navLink.children().hasClass('active')).to.be.true;
    });

    it("should not have active state on page number not current", function() {
      // Act
      var navLink = pageTurner.createPageLink(3, navObj);
      // Assert
      expect(navLink.children().hasClass('active')).to.be.false;
    });

  });

});
