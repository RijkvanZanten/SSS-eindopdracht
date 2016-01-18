var express = require('express'),
	router = express.Router()

router.get('/', function(req, res, next) {
	req.getConnection(function(error, connection) {
		if(error) {
			req.error = {
				code: 5,
				msg: 'Error in to establishing database connection',
				stat: error
			};
			res.send(req.error);
		}
		connection.query('SELECT photos.id, photos.filename, photos.caption, photos.date, users.username, users.profile_pic_path AS profpic FROM photos LEFT JOIN users ON photos.userID = users.id ORDER BY photos.date DESC, photos.id DESC LIMIT 12', function(error, records){
			if(error) {
				req.error = {
					code: 6,
					msg: 'Error in SQL query [photos]',
					stat: error
				};
				res.send(req.error);
			}
			res.locals.photos = records;
			
			var photoIDs = [];
			for(i = 0; i < res.locals.photos.length; i ++) {
				photoIDs.push(res.locals.photos[i].id);
			}
			
			connection.query('SELECT comments.*, users.username FROM comments LEFT JOIN users on comments.user_id = users.id WHERE comments.photo_id IN (?)', [photoIDs], function(error, records) {
				if(error) {
					req.error = {
						code: 6,
						msg: 'Error in SQL query [comments]',
						stat: error
					};
					res.send(req.error);
				}
				for(i = 0; i < res.locals.photos.length; i++) {
					var photoID = res.locals.photos[i].id;
					
					res.locals.photos[i].comments = [];
					
					for(x = 0; x < records.length; x++) {
						if(photoID == records[x].photo_id) {
							res.locals.photos[i].comments.push(records[x]);
						}
					}
				}
				res.render('index', {title: 'SSS', bodyclass: 'home'});
			});
		});
	});
});

module.exports = router;