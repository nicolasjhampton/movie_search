var RequestApi = (function(APIRequest, omdbAPI) {
'use strict';

/*
 *  API handlers
 *
 */

var RequestApi = function(hostname) {
  this.request = new APIRequest();//XMLHttpRequest();
  this.hostname = hostname;
  this.pages = 1;
};

RequestApi.prototype.get = function(query, formatter, pagesRequested) {
  this.query = query;
  this.path = formatter(this.query);
  this.pagesRequested = pagesRequested;
  this.request.open("GET", this.hostname + this.path + "&page=" + this.pages);
  return this;
};

RequestApi.prototype.then = function(callback) {
  this.callback = callback;
  var that = this;

  this.request.onreadystatechange = function() {

    if(that.request.readyState >= 4 && that.request.status >= 200 && that.request.status <= 300) {
      var response = JSON.parse(that.request.responseText);

      that.gatherAndPrintData(response);

    }
  };

  return this;
};

RequestApi.prototype.fetch = function() {
  this.request.send();
};

RequestApi.prototype.gatherAndPrintData = function(response) {
  if(response.hasOwnProperty("Search")) {

    this.getAllPages(response);

  } else {

    this.callback(response);

  }
};

RequestApi.prototype.getAllPages = function(response) {
  this.concatPageData(response);

  if (this.pages < this.pagesRequested) {
    this.requestNextPage();
  } else {
    this.callback(this.data);
  }
};

RequestApi.prototype.concatPageData = function(response) {
  if(this.pages > 1) {
    this.data.Search = this.data.Search.concat(response.Search);
  } else {
    this.data = response;
  }
};

RequestApi.prototype.requestNextPage = function() {
  this.pages++;
  this.get(this.query, omdbAPI.formatMoviePath, this.pagesRequested).then(this.callback).fetch();
};

return RequestApi;

})(XMLHttpRequest, omdbAPI);
