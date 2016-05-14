!function($, window, document) {
'use strict';

/*
 *  Search bar
 *
 */

 var title = "";
 var year = "";

$('#submit').click(function(e) {
  e.preventDefault();
  var search = "";
  var reYear = /^[1|2][9|0][\d]{2}$/;
  title = $('#search').val().toLowerCase().trim();
  year = $('#year').val().toLowerCase().trim();
  search = reYear.test(year) ? title + "&y=" + year : title;
  new RequestApi(omdbAPI.hostname)
      .get(omdbAPI.search + search + omdbAPI.json, 4)
      .then(printMovieResults)
      .fetch();
});


/*
 *  API handlers
 *
 */



var omdbAPI = {
  "hostname": "http://www.omdbapi.com/",
  "search": "?s=",
  "imdbID": "?i=",
  "plot": "&plot=short",
  "json": "&r=json"
}

var RequestApi = function(hostname) {
  this.request = new XMLHttpRequest();
  this.hostname = hostname;
  this.pages = 1;
}

RequestApi.prototype.get = function(path, pagesRequested) {
  this.path = path;
  this.pagesRequested = pagesRequested;
  this.request.open("GET", this.hostname + path + "&page=" + this.pages);
  return this;
}

RequestApi.prototype.then = function(callback) {
  var that = this;
  this.request.onreadystatechange = function() {
    if(this.readyState >= 4 && this.status >= 200 && this.status <= 300) {
      var response = JSON.parse(this.responseText);
      console.log(response);
      console.log(response.hasOwnProperty("Search"));
      if(response.hasOwnProperty("Search")) {
        if(that.pages > 1) {
          that.data.Search = that.data.Search.concat(response.Search);
          console.log(that.data.Search);
          console.log(response.Search);
        } else if (that.pages == 1){
          that.data = response;
        }
        if (that.pages < that.pagesRequested) {
          that.pages++;
          that.get(that.path, that.pagesRequested).then(callback).fetch();
        } else {
          callback(that.data);
        }
      } else {
        callback(response);
      }
    }
  }
  return this;
}

RequestApi.prototype.fetch = function() {
  this.request.send();
}


/*
 *  View template functions
 *
 */


var movieTemplate = {
  "a": "<li class='movie' data-id='",
  "b": "'><div class='poster-wrap'>",
  "c": "<img class='movie-poster' src='",
  "d": "'>",
  "e": "</div><span class='movie-title'>",
  "f": "</span><span class='movie-year'>",
  "g": "</span></li>"
}

var placeholder = "<i class='material-icons poster-placeholder'>crop_original</i>";

var noneFound = {
  "first": "<li class='no-movies'><i class='material-icons icon-help'>help_outline</i>No movies found that match: ",
  "second": ".</li>"
};

var printMovieResults = function(movies) {
  if(movies.Response == "True") {
    var html = movies.Search.map(function(obj) {
      var image = (obj.Poster == "N/A") ?  placeholder : movieTemplate.c + obj.Poster + movieTemplate.d;
      var header = movieTemplate.a + obj.imdbID + movieTemplate.b;
      return header + image + movieTemplate.e + obj.Title + movieTemplate.f + obj.Year + movieTemplate.g;
    }).join('');
    $('#movies').html(html).children().click(onMovieClick);
    var pageTurner = new PageTurner();
    pageTurner.run();
  } else if (movies.Error == "Movie not found!") {
    $('#movies').html(noneFound.first + title + noneFound.second);
  }
};

var onMovieClick = function() {
  new RequestApi(omdbAPI.hostname)
      .get(omdbAPI.imdbID + $(this).attr('data-id') + omdbAPI.plot + omdbAPI.json, 1)
      .then(printDetails)
      .fetch();
};

var detailsTemplate = {
  "a": "<div class='details'><header><a class='return' alt='return to search results' href='#'>Search Results</a>",
  "poster": "<img alt='movie poster' src='",
  "poster2": "'>",
  "b": "<div><h2 class='clearfix'>",
  "c": " (",
  "d": ")</h2><h4>IMDB Rating: ",
  "e": "</h4></div></header><div><h4>Plot Synopsis:</h4><p>",
  "f": "</p><a alt='link to imdb page' href='http://www.imdb.com/title/",
  "g": "'>View on IMDB</a></div></div>"
}

var printDetails = function(details) {
  $('#movies').hide();
  $('.pagination').hide();
  var poster = "";
  if(details.Poster !== "N/A") {
    poster = detailsTemplate.poster + details.Poster + detailsTemplate.poster2;
  }
  var html = detailsTemplate.a + poster + detailsTemplate.b + details.Title + detailsTemplate.c;
  html += details.Year + detailsTemplate.d + details.imdbRating + detailsTemplate.e;
  html += details.Plot + detailsTemplate.f + details.imdbID + detailsTemplate.g;
  $('.main-content').append(html);
  $('.return').click(returnToResults);
};

var returnToResults = function(e) {
  e.preventDefault();
  $(this).off();
  $('.details').remove();
  $('.pagination').show();
  $('#movies').show();
};

}(jQuery, window, document);
