'use strict';

var omdbAPI = {
  "hostname": "http://www.omdbapi.com/",
  "search": "?s=",
  "imdbID": "?i=",
  "plot": "&plot=short",
  "json": "&r=json",
  "callback": "&callback=JSONcallback",
  "formatDetailsPath": function(query) {
    return omdbAPI.imdbID + query.id + omdbAPI.plot + omdbAPI.json + omdbAPI.callback;
  },
  "formatMoviePath": function(query) {
    var reYear = /^[1|2][9|0][\d]{2}$/;
    var search = reYear.test(query.year) ? query.title + "&y=" + query.year : query.title;
    return omdbAPI.search + search + omdbAPI.plot + omdbAPI.json + omdbAPI.callback;
  }
};


var request = function(apiTool, branch, query, pages) {
  return new Promise(resolve, reject) {
    window.JSONcallback = function(data) {
      var response = JSON.parse(data);
      return resolve(response);
    }
    var JSONPscript = document.createElement('script')
                              .setAttribute("src",
                               apiTool.hostname + apiTool.[branch](query) + "&page=" + pages);
    document.body.appendChild(JSONPscript);
  }
}

function getPageResults(query) {
  var requestArray = [
    request(omdbAPI, "formatMoviePath", query, 1),
    request(omdbAPI, "formatMoviePath", query, 2),
    request(omdbAPI, "formatMoviePath", query, 3),
    request(omdbAPI, "formatMoviePath", query, 4),
  ];
  Promise.all(requestArray)
         .then(function(dataArray) {
           var compiledSearch = dataArray.reduce((acc, next) => {
             return acc.Search.concat(next.Search);
           }, "");
           
         });
}
