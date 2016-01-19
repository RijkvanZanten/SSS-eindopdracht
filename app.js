// Load the modules
var express    = require('express'),
	path       = require('path'),
	bodyParser = require('body-parser'),
	session    = require('express-session');
	
// Routers
var userRouter = require('./routes/users.js'),
	errorRouter = require('./routes/error.js');

// Set up app
var app = express();

// Setup bodyparser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// Use sessions
app.use(session({
	secret: "KijkNouEenGeheimpje",
	resave: false,
	saveUninitialized: true
}));

// Define views engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Set static directory
app.use(express.static('public'));

// Connect routers to routes
app.use('/users', userRouter);

// 404 Router
app.use(errorRouter);

// Start app
app.listen(3000, function() {
	console.log('Server started');
});