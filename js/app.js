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
  year = $('#year').val().toLowerCase().trim()
  console.log(reYear.test(year));
  search = reYear.test(year) ? title + "&y=" + year : title;
  console.log(search);
  requestAPI(search, searchUrl, printMovieResults)
});


/*
 *  API handlers
 *
 */

var waitingFunction;

var detailsUrl = {
  "first": "http://www.omdbapi.com/?i=",
  "second": "&plot=short&r=json"
}

var searchUrl = {
  "first": "http://www.omdbapi.com/?s=",
  "second": "&r=json"
}

var requestAPI = function(data, urlObj, callback) {
  var request = new XMLHttpRequest();
  waitingFunction = callback;
  request.onreadystatechange = onResponse;
  request.open("GET", urlObj.first + data + urlObj.second);
  request.send();
}

var onResponse = function() {
  if(this.readyState >= 4 && this.status >= 200 && this.status <= 300) {
    var response = JSON.parse(this.responseText);
    console.log(response);
    waitingFunction(response);
  }
};


/*
 *  View template functions
 *
 */

var first = "<li data-id='";

var firstTwo = "'><div class='poster-wrap'>"

var posterOne = "<img class='movie-poster' src='";

var posterTwo = "'>";

var second = "</div><span class='movie-title'>";

var third = "</span><span class='movie-year'>"

var fourth = "</span></li>";

var placeholder = "<i class='material-icons poster-placeholder'>crop_original</i>";

var noneFound = {
  "first": "<li class='no-movies'><i class='material-icons icon-help'>help_outline</i>No movies found that match: ",
  "second": ".</li>"
}

var printMovieResults = function(movies) {
  if(movies.Response == "True") {
    var html = movies.Search.map(function(obj) {
      var image = (obj.Poster == "N/A") ?  placeholder : posterOne + obj.Poster + posterTwo;
      var header = first + obj.imdbID + firstTwo;
      return header + image + second + obj.Title + third + obj.Year + fourth;
    }).join('');
    $('#movies').html(html).children().click(onMovieClick);
  } else if (movies.Error == "Movie not found!") {
    $('#movies').html(noneFound.first + title + noneFound.second);
  }
}

var onMovieClick = function() {
  requestAPI($(this).attr('data-id'), detailsUrl, print);
}

var print = function(details) {
  $('#movies').children().hide();
  var html = "";
  html += "<div class='details'><header><a class='return' alt='return to search results' href='#'>Search Results</a>";
  html += "<img alt='movie poster' src='" + details.Poster + "'>";
  html += "<div><h2 class='clearfix'>" + details.Title + " (" + details.Year + ")" + "</h2>";
  html += "<h4>IMDB Rating: " + details.imdbRating + "</h4></div>";
  html += "</header>"
  html += "<div><h4>Plot Synopsis:</h4><p>" + details.Plot + "</p>"
  html += "<a alt='link to imdb page' href='http://www.imdb.com/title/" + details.imdbID + "'>View on IMDB</a></div></div>";
  $('#movies').append(html);
  $('.return').click(returnToResults);
}

var returnToResults = function(e) {
  e.preventDefault();
  $(this).off();
  $('.details').remove();
  $('#movies').children().show();
}

}(jQuery, window, document);
