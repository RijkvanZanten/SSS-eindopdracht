var express = require('express'),
	router = express.Router()


function getPhotos(req, res, next) {
	req.getConnection(function(error, connection) {
		if(error) {
			req.error = {
				code: 5,
				msg: 'Error in to establishing database connection',
				stat: error
			};
			res.send(req.error);
		}
		
		connection.query('SELECT photos.id, photos.filename, photos.caption, photos.date, users.username FROM photos LEFT JOIN users ON photos.userID = users.id ORDER BY photos.date DESC, photos.id DESC LIMIT 12', function(error, records){
			if(error) {
				req.error = {
					code: 6,
					msg: 'Error in SQL query [photos]',
					stat: error
				};
				res.send(req.error);
			}
			
			res.locals.photos = records;
			next();
		});
	});
}

function getComments(req, res, next) {
	if(!res.locals.photos.length) {
		next();
	}
	
	var photoIDs = [];
			
	for(i = 0; i < res.locals.photos.length; i ++) {
		photoIDs.push(res.locals.photos[i].id);
	}
	
	req.getConnection(function(error, connection) {
		if(error) {
			req.error = {
				code: 5,
				msg: 'Error in to establishing database connection',
				stat: error
			};
		}
		
		connection.query('SELECT comments.*, users.username FROM comments LEFT JOIN users on comments.user_id = users.id WHERE comments.photo_id IN (?)', [photoIDs], function(error, records) {
			if(error) {
				req.error = {
					code: 6,
					msg: 'Error in SQL query [comments]',
					stat: error
				};
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
			
			res.render('index', {title: 'SSS', bodyclass: 'home', username: req.session.username, userid: req.session.userid, error: req.error});
		});
	});
}

router.get('/', getPhotos, getComments, function(req, res) {
	res.render('index', {title: 'Serverside Scripting', bodyclass: 'home', username: req.session.username, userid: req.session.userid, error: req.error});
});

module.exports = router;