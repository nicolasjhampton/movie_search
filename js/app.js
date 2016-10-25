!function($, window, document) {
 'use strict';


/*
 *  View templates
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

var omdbAPI = {
  "hostname": "http://www.omdbapi.com/",
  "search": "?s=",
  "imdbID": "?i=",
  "plot": "&plot=short",
  "json": "&r=json",
  "callback": "&callback=",
  "formatDetailsPath": function(query, callback) {
    return omdbAPI.imdbID + query.id + omdbAPI.plot + omdbAPI.json + omdbAPI.callback + callback;
  },
  "formatMoviePath": function(query, callback) {
    var reYear = /^[1|2][9|0][\d]{2}$/;
    var search = reYear.test(query.year) ? query.title + "&y=" + query.year : query.title;
    return omdbAPI.search + search + omdbAPI.plot + omdbAPI.json + omdbAPI.callback + callback;
  }
};

var request = function(apiTool, branch, query, pages) {
  return new Promise(function(resolve, reject) {

    var callbackName = "JSONcallback" + Math.round(100000 * Math.random());
    window[callbackName] = function(data) {
      console.log(data);
      return resolve(data);
    }

    var JSONPscript = document.createElement('script');
    JSONPscript.setAttribute("src", apiTool.hostname + apiTool[branch](query, callbackName) + "&page=" + pages);
    document.body.appendChild(JSONPscript);
  });
}

function getPageResults(query) {
  var requestArray = [
    request(omdbAPI, "formatMoviePath", query, 1),
    request(omdbAPI, "formatMoviePath", query, 2),
    request(omdbAPI, "formatMoviePath", query, 3),
    request(omdbAPI, "formatMoviePath", query, 4),
  ];
  return Promise.all(requestArray);
}

function getPageDetails(query) {
  return request(omdbAPI, "formatDetailsPath", query, 1)
                .then((data) => {
                  return data;
                });
}

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

  getPageResults(query)//omdbAPI.search + search + omdbAPI.json, 4)
      .then((dataArray) => {
        console.log(dataArray);
        var data = dataArray.reduce((acc, next) => {
          return acc.concat(next.Search);
        }, []);
        console.log(data);
        printMovieResults(data);
      });
});

var printMovieResults = function(movies) {
    var html = templateEngine(movies, movieTemplate);

    $('#movies').html(html).children().click(onMovieClick);

    new PageTurner({
      "animate": "slow",
      "itemClass": 'movie',
      "itemsOnPage": 8,
      "paginationClass": 'pagination',
      "paginationElement": 'div'
    }).render();
};

var onMovieClick = function() {
  $(this).prop('disabled', true);
  var query = {
    "id": $(this).attr('data-id')
  }

  getPageDetails(query)
      .then(printDetails);
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

}(jQuery, window, document);
