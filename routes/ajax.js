var express = require('express'),
	router  = express.Router();
	
router.post('/insert', function(req, res, next){
		
	console.log(req.body);	
	
	req.getConnection(function(error, connection) {
		if(error) {
			req.error = {
				code: 5,
				msg: 'Error in creating database connection',
				stat: error
			};
			console.log(req.error);
			res.end();
		}
		connection.query('INSERT INTO comments (photo_id, comment, user_id, date) VALUES (?, ?, ?, NOW() );', [req.body.photoid, req.body.comment, req.body.userid], function(error, record) {
			if(error){
				req.error = {
					code: 6,
					msg: 'Error in SQL query [insert]',
					stat: error
				};
				res.end();
			}
			connection.query('SELECT comments.comment, users.username FROM comments LEFT JOIN users ON comments.user_id = users.id WHERE comments.photo_id = ? ', [req.body.photoid], function(error, records) {
				if(error) {
					req.error = {
						code: 6,
						msg: 'Error in SQL query [comments]',
						stat:error
					};
					res.end();
				}
				res.send(records);
			});
		});
	});
		
});

module.exports = router;