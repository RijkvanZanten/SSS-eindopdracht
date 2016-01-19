// Socket.io
var server = require('http').Server(app);
var io = require('socket.io')(server);
	// de requires helaas hier vanwege het gebruik van het app object// Require the dependencies
// --------------------------------------------------------------------
var express 	 = require('express'),
	session		 = require('express-session'),
	myConnection = require('express-myconnection'),
	mysql 		 = require('mysql'),
	bodyParser   = require('body-parser'),
	socket		 = require('socket.io'),
	http 		 = require('http');



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
app.use(bodyParser.urlencoded({extended: true}));


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

// Socket.IO
var server = http.Server(app);
var io = socket(server);

app.use(function(req, res, next) {
	req.io = io;
	next();
});

// Routes & Routers
// --------------------------------------------------------------------
var indexRouter     = require('./routes/index.js'),
    exploreRouter   = require('./routes/explore.js'),
    uploadRouter	= require('./routes/upload.js'),
    userRouter		= require('./routes/user.js'),
    ajaxRouter		= require('./routes/ajax.js'),
    errorRouter		= require('./routes/error.js');
    
app.use('/', indexRouter);
app.use('/explore', exploreRouter);
app.use('/upload', uploadRouter);
app.use('/user', userRouter);
app.use('/ajax', ajaxRouter);
app.use(errorRouter);



// Realtime gekkigheid (comments)
// --------------------------------------------------------------------
io.on('connection', function (socket) {
	socket.on('new comment', function (data) {
		socket.broadcast.emit('comment', data);
	});
});

// Start server
// --------------------------------------------------------------------
server.listen(3000, function() {
	console.log('App started. Listening on default port (3000)');
});