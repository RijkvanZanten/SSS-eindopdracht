var express = require('express'),
    router  = express.Router();



// User page
router.get('/user/:username', function(req, res, next) {
    
    req.getConnection(function(err, connection) {
        
        if(err) {
            res.locals.err = err;
            return next();
        } 
        
        connection.query("SELECT users.id, users.name, users.bio, users.username FROM users WHERE username = ?", [req.params.username], function(err, record) {
	        if(err) {
				req.error = {
					code: 6,
					msg: 'Error in SQL query [get single user]',
					stat: err
				};
            }
            if(record.length) {
                
                res.locals.title = record[0].name + ' (@' + record[0].username + ') • SSS';
                res.locals.bodyclass = 'explore user';
                res.locals.username = req.session.username;
                res.locals.user = record[0];
                res.locals.userid = req.session.userid;
                var userID = record[0].id;
                
                
                connection.query('SELECT photos.filename, photos.date FROM photos WHERE photos.userID = ? ORDER BY photos.date DESC, photos.id DESC', [userID], function(error, records){
	                if(error) {
						req.error = {
							code: 6,
							msg: 'Error in SQL query [get photos from user]',
							stat: error
						};
		            }
		            res.locals.photos = records;
	                res.render('explore/user');
	            });
	            
                
                
            } else {
                
                res.send('niet gevonden');

            }

        });
    });
    
}, function(req, res) {
    res.status(500);
    res.send('hij is stuk');
});



// Hashtag search
router.get('/tag/:hashtag', function(req, res) {
	res.render('explore/hashtag', {title: "hashtag", bodyclass: 'explore hashtag', hashtag: req.params.hashtag, username: req.session.username});
});


module.exports = router;