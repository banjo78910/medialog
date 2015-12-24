var tvdbAPIKey = '0c9e28484184c8c8507b02b5e1421f7a';

//node dependencies
var express = require( "express" ),
	bodyParser = require( 'body-parser' ),
	http = require( 'http' ),
	path = require( 'path' );
var app = express();

//use jade for template engine
app.set( 'views', __dirname + '/views' );
app.set( 'view engine', 'jade' );

//body parser settings
app.use( bodyParser.urlencoded( {
	extended: true
} ) );

//static path settings for client javascript, etc.
app.use( express.static( path.join( __dirname + '/static' ) ) );

//main page load
app.get( '/', function( req, res ) {
	res.render( 'index' );
} );

//film search function
app.post( '/search', function( req, res ) {
	var title = req.body.title,
		id = req.body.id,
		year = req.body.year;
	getInfo( title, year, id, function( err, data ) {
		console.log( data );
		res.render( 'filmpage', {
			title: data.title,
			year: data.release_date,
			poster: "http://image.tmdb.org/t/p/w500" + data.poster_path
		} );
	} );

} );

//queries TVDB and returns the info as JSON
function getInfo( title, year, id, callback ) {
	newTitle = title.replace( / /g, '+' );
	// var queryString = '/?t=' + newTitle + '&y=' + year + '&plot=short&r=json';
	var queryString = '/3/movie/' + id + '?api_key=' + tvdbAPIKey;
	console.log( queryString );
	var options = {
		host: 'api.themoviedb.org',
		path: queryString,
		method: 'GET',
		headers: {
			'Content-Type': 'application/json'
		}
	};

	var getData = http.request( options, function( data ) {
		var output = '';

		console.log( options.host + ':' + data.statusCode );

		data.setEncoding( 'utf8' );

		data.on( 'data', function( chunk ) {
			output += chunk;
		} );

		data.on( 'end', function() {
			callback( null, JSON.parse( output ) );
		} );

	} );

	getData.end();

}

app.listen( 3000, function() {
	console.log( "Started on PORT 3000" );
} )