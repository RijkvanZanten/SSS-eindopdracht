var express = require('express'),
	router  = express.Router(),
	multer  = require('multer'),
	upload  = multer({dest: 'public/usermedia/profilepics/'}),
	fs = require('fs');


// Check authentication middleware
function auth(req, res, next) {
	if(req.session.username) {
		res.redirect('/');
	} else {
		next();
	}
}



// GET login. Show login form
// ------------------------------------------------------------

router.get('/login', auth, function(req, res) {
	res.render('user/login', {title: 'login', bodyclass: 'account login', username: req.session.username});
});

// ------------------------------------------------------------



// POST login. Check provided records against DB
// ------------------------------------------------------------

router.post('/login', function(req, res) {
	req.getConnection(function(error, connection) {
		if(error){
			req.error = {
				code: 5,
				msg: 'Error in creating database connection',
				stat: error
			};
			res.send(req.error);
		}
		connection.query('SELECT users.id, users.username, users.password FROM users WHERE users.username = ?', [req.body.username], function(error, records) {
			if(error) {
				req.error = {
					code: 6,
					msg: 'Error in SQL query',
					stat: error
				};
				res.send(req.error);
			}
			if(records.length !== 0 && req.body.password == records[0].password) {
				req.session.userid = records[0].id;
				req.session.username = records[0].username;
				res.redirect('/');
			} else {
				res.render('user/login', {title: 'login', bodyclass: 'account error login', username: req.session.username});
			}
			
		});
	});
});

// ------------------------------------------------------------



// GET create. Show create new user form
// ------------------------------------------------------------

router.get('/create', auth, function(req, res) {
	res.render('user/create', {title: 'Registreer account • SSS', bodyclass: 'account create', username: req.session.username});
});

// ------------------------------------------------------------



// POST create. Check entry, check if already exists, 
//   create new user in DB, get userID and set session.
// ------------------------------------------------------------

function checkEntry(req, res, next) {
	if(req.body.name == '' || req.body.username == '' || req.body.password == '') {
		res.send('niet alles ingevuld');
	} else {
		next();
	}
}

function checkIfExists(req, res, next) {
	req.getConnection(function(error, connection) {
		if(error){
			req.error = {
				code: 5,
				msg: 'Error in creating database connection',
				stat: error
			};
			res.send(req.error);
		}
		
		connection.query('SELECT * FROM users WHERE username = ?', [req.body.username], function(error, records) { 
			if(error) {
				req.error = {
					code: 6,
					msg: 'Error in SQL query [check if user exists]',
					stat: error
				};
				res.send(req.error);
			}
			
			if(records.length) {
				res.send('bestaat al');
			} else {
				next();
			}
			
		});
	});
}

function changeProfilePic(req, res, next) {
	fs.rename(
		req.file.path, 
		req.file.destination + req.body.username
	);
	  
	next();
}

function insert(req, res, next) {
	req.getConnection(function(error, connection) {
		if(error){
			req.error = {
				code: 5,
				msg: 'Error in creating database connection',
				stat: error
			};
			res.send(req.error);
		}
			
		connection.query('INSERT INTO users (name, username, password, bio) VALUES ( ? , ? , ? , ? )', [req.body.name, req.body.username, req.body.password, req.body.bio], function(error, records) {
			if(error) {
				req.error = {
					code: 6,
					msg: 'Error in SQL query [insert new user]',
					stat: error
				};
				res.send(req.error);
			}
			next();
		});
	});
}

function retrieve(req, res, next) {
	req.getConnection(function(error, connection) {
		if(error){
			req.error = {
				code: 5,
				msg: 'Error in creating database connection',
				stat: error
			};
			res.send(req.error);
		}
			
		connection.query('SELECT users.id FROM users WHERE users.username = ?', [req.body.username], function(error, record) {
			if(error) {
				req.error = {
					code: 6,
					msg: 'Error in SQL query [get newly created user ID]',
					stat: error
				};
				res.send(req.error);
			}
			
			req.session.username = req.body.username;
			req.session.userid = record[0].id;
		
			res.redirect('/');
		});		
	});	
}

router.post('/create', checkEntry, checkIfExists, upload.single('profile_pic'), changeProfilePic, insert, retrieve);
	
// ------------------------------------------------------------	



module.exports = router;