// Require dependencies
var express    = require('express'),
	bodyParser = require('body-parser'),
	session    = require('express-session');

// Setup the router object
var router = express.Router();

// Dummy data
var accounts = [
	{
		username: 'rijk',
		password: 'kampen1'
	}
];

// Middleware that checks if a session exists
var authenticate = function(req, res, next) {
	if(req.session && req.session.user) {
		next();
	} else {
		res.redirect('users/login');
	}
};

// Cross reference the provided username and password with the dummy data.
function checkAuthentication(username, password) {
	for(i = 0; i < accounts.length; i++) {
		if(accounts[i].username === username && accounts[i].password === password) {
			return true;
		} else {
			return false;
		}
	};
};


router.get('/', authenticate, function(req, res) {
	res.locals.username = req.session.user;
	
	res.locals.pagetitle = "Welkom " + req.session.user;
	res.locals.bodyclass = 'users-page logged-in';
		
	res.render('users');
});

router.get('/login', function(req, res) {
	
	res.locals.pagetitle = "Login";
	res.locals.bodyclass = 'login';
	
	res.render('login');
});

router.post('/login', function(req, res) {
	if(!req.body.username || !req.body.password) {
		res.redirect('/users/login');
	} else if(checkAuthentication(req.body.username, req.body.password)) {
		req.session.user = req.body.username;
		res.redirect('/users');
	} else {
		res.redirect('/users/login');
	}
});

router.get('/logout', function (req, res) {
	req.session.destroy();
	res.redirect('/users');
});

module.exports = router;