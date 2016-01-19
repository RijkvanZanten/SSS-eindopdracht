module.exports = {
	auth: function(req, res, next) {
		if(req.session.username) {
			next();
		} else {
			res.redirect('/user/login');
		}
	}
}