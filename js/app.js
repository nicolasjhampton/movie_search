!function($, Request, omdbAPI, window, document) {
'use strict';



/*
 *  Search bar
 *
 */
 var title = "";
 var year = "";

$('#submit').click(function(e) {
  e.preventDefault();

  var query = {
    "title": $('#search').val().toLowerCase().trim(),
    "year": $('#year').val().toLowerCase().trim()
  };

  new Request(omdbAPI.hostname)
      .get(query, omdbAPI.formatMoviePath, 4 )//omdbAPI.search + search + omdbAPI.json, 4)
      .then(printMovieResults)
      .fetch();
});

var printMovieResults = function(movies) {
  if(movies.Response == "True") {
    var html = templateEngine(movies.Search, movieTemplate);

    $('#movies').html(html).children().click(onMovieClick);

    new PageTurner().run();

  } else if (movies.Error == "Movie not found!") {

    $('#movies').html(noneFound.first + title + noneFound.second);

  }
};

var onMovieClick = function() {
  $(this).prop('disabled', true);
  var query = {
    "id": $(this).attr('data-id')
  }
  new Request(omdbAPI.hostname)
      .get(query, omdbAPI.formatDetailsPath, 1)
      .then(printDetails)
      .fetch();
};

/*
 *  View template functions
 *
 */

var noneFound = {
  "first": "<li class='no-movies'><i class='material-icons icon-help'>help_outline</i>No movies found that match: ",
  "second": ".</li>"
};

var movieTemplate = {
  "imageTag": { "a": "<img class='movie-poster' src='",
               "b": "'>"},
  "placeholder": "<i class='material-icons poster-placeholder'>crop_original</i>",
  "Start": "<li class='movie' data-id='",
  "imdbID": "'><div class='poster-wrap'>",
  "Poster": "</div><span class='movie-title'>",
  "Title": "</span><span class='movie-year'>",
  "Year": "</span></li>",
  "order": [
      "imdbID",
      "Poster",
      "Title",
      "Year"
  ]
};

var detailsTemplate = {
  "imageTag": { "a": "<img alt='movie poster' src='",
                "b": "'>"},
  "placeholder": "",
  "Start": "<div class='details'><header><a class='return' alt='return to search results' href='#'>Search Results</a>",
  "Poster": "<div><h2 class='clearfix'>",
  "Title": " (",
  "Year": ")</h2><h4>IMDB Rating: ",
  "imdbRating": "</h4></div></header><div><h4>Plot Synopsis:</h4><p>",
  "Plot": "</p><a alt='link to imdb page' href='http://www.imdb.com/title/",
  "imdbID": "'>View on IMDB</a></div></div>",
  "order": [
    "Poster",
    "Title",
    "Year",
    "imdbRating",
    "Plot",
    "imdbID"
  ]
};

var formatPoster = function(poster, template) {
  return (poster !== "N/A") ? template.imageTag.a + poster + template.imageTag.b : template.placeholder;
};

var templateEngine = function(data, template) {
  data = (Array.isArray(data)) ? data : [data];
  var html = data.map(function(obj) {

    obj.Poster = formatPoster(obj.Poster, template);

    return template.order.reduce(function(a, b, index) {
      return a + obj[b] + template[b]
    }, template.Start);

  });
  return html.join('');
};

var printDetails = function(details) {
  var html = templateEngine(details, detailsTemplate);
  $('#movies').hide();
  $('.pagination').hide();
  $('.main-content').append(html);
  $('.return').click(returnToResults);
};

var returnToResults = function(e) {
  e.preventDefault();
  $(this).off();
  $('.details').remove();
  $('.pagination').show();
  $('#movies').show();
  $('.movie').prop('disabled', false);
};

}(jQuery, RequestApi, omdbAPI, window, document);
