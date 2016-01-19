var express = require('express'),
	router  = express.Router();
	
router.get('*', function(req, res) {
	res.render('404', {title: 'Niet gevonden', bodyclass: '404', username: req.session.username});
});
	
module.exports = router;