var omdbAPI = {
  "hostname": "http://www.omdbapi.com/",
  "search": "?s=",
  "imdbID": "?i=",
  "plot": "&plot=short",
  "json": "&r=json",
  "callback": "&callback=",
  "formatDetailsPath": function(query) {
    return omdbAPI.imdbID + query.id + omdbAPI.plot + omdbAPI.json + omdbAPI.callback;
  },
  "formatMoviePath": function(query) {
    var reYear = /^[1|2][9|0][\d]{2}$/;
    var search = reYear.test(query.year) ? query.title + "&y=" + query.year : query.title;
    return omdbAPI.search + search + omdbAPI.plot + omdbAPI.json + omdbAPI.callback;
  }
};
