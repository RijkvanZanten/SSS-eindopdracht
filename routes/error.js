var express = require('express'),
	router = express.Router();
	
router.get('*', function(req, res) {
	res.status(400);
	
	// Respond that fits the client
	if(req.accepts('html')) {
		res.locals.pagetitle = "You f'ed it up.";
		res.locals.bodyclass = 'error-404';
		
		res.render('404', {url: req.url});
	} else if(req.accepts('json')) {
		res.send({error: 'Error 404: Not found'});
	} else {
		res.type('txt').send('Not found');
	}
	
});

module.exports = router;