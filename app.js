// Require the dependencies
// --------------------------------------------------------------------
var express 	 = require('express'),
	session		 = require('express-session'),
	myConnection = require('express-myconnection'),
	mysql 		 = require('mysql'),
	bodyParser   = require('body-parser');



// Setup the packages
// --------------------------------------------------------------------
// Express
var app = express();
app.use(express.static('public'));

// EJS
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

// Bodyparser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// Sessions
app.use(session({
	secret: "P85dvHsxWp0XFD8kfh3VwkKcj3cvs2GT",
	saveUninitialized: true,
	resave: false
}));

// MySQL
app.use(myConnection(mysql, {
	host: 'localhost',
	user: 'student',
	password: 'serverSide',
	port: 3306,
	database: 'eindopdracht'
}, 'single'));


// Routes & Routers
// --------------------------------------------------------------------
var indexRouter     = require('./routes/index.js'),
    exploreRouter   = require('./routes/explore.js'),
    uploadRouter	= require('./routes/upload.js');
    
app.use('/', indexRouter);
app.use('/explore', exploreRouter);
app.use('/upload', uploadRouter);


// Start server
// --------------------------------------------------------------------
app.listen(3000, function() {
	console.log('App started. Listening on default port (3000)');
});