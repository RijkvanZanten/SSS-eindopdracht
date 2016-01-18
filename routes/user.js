var express = require('express'),
	router = express.Router();

var auth = function(req, res, next) {
	if(req.session.username) {
		res.redirect('/');
	} else {
		next();
	}
}

router.get('/login', auth, function(req, res) {
	res.render('user/login', {title: 'login', bodyclass: 'login'});
});

router.get('/create', auth, function(req, res) {
	res.send('create');
});
	
module.exports = router;