var express = require( "express" ),
    bodyParser = require('body-parser'),
    http = require('http'),
    jade = require('jade'),
    path = require('path');
var app = express();


app.set('views', __dirname + '/views');
app.set('view engine', 'jade');

app.use( bodyParser.urlencoded( {
    extended: true
} ) );

app.use( express.static( path.join( __dirname + '/static' ) ) );

app.get( '/', function( req, res ) {
    // res.sendFile( __dirname + "/index.html" );
    res.render('index');
} );

app.post('/search', function(req, res){
    console.log(req);
    var filmdata = '';
    var title = req.body.title, year = req.body.year;
    getInfo(title, year, function(err, data){
      res.render('filmpage',
      {
        title : data.Title,
        year : data.Year,
        writer : data.Writer,
        poster : data.Poster
      });
    });

});

function getInfo (title, year, callback){
  newTitle = title.replace(/ /g, '+');
  var queryString = '/?t=' + newTitle + '&y=' + year + '&plot=short&r=json';
  console.log(queryString);
  var options = {
      host: 'omdbapi.com',
      path: queryString,
      method: 'GET',
      headers: {
          'Content-Type': 'application/json'
      }
  };
  var output = '';
  var outputJSON;
  var getData = http.request(options, function(data){

      console.log(options.host + ':' + data.statusCode);
      data.setEncoding('utf8');

      data.on('data', function (chunk) {
          output += chunk;
      });

      data.on('end', function() {
          outputJSON = JSON.parse(output)

          callback(null, outputJSON);
      });

  });

  getData.end();

}


app.listen( 3000, function() {
    console.log( "Started on PORT 3000" );
} )
