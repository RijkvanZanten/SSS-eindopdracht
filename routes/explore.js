var express = require('express'),
    router  = express.Router();



// User page
router.get('/user/:username', function(req, res, next) {
    
    req.getConnection(function(err, connection) {
        
        if(err) {
            res.locals.err = err;
            return next();
        } 
        
        connection.query("SELECT name, profile_pic_path, bio, username FROM users WHERE username = ?", [req.params.username], function(err, record) {
            
            if(err) {
                res.locals.err = err;
                return next();
            } 
               
            if(record.length) {
                
                res.locals.title = record[0].name + ' (@' + record[0].username + ') • SSS';
                res.locals.user = record[0];
                res.render('explore/user');
                
            } else {
                
                res.send('niet gevonden');

            }

        });
    });
    
}, function(req, res) {
    console.log(res.locals.err);
    res.status(500);
    res.send('hij is stuk');
});



// Hashtag search
router.get('/tag/:hashtag', function(req, res) {
	res.render('explore/hashtag', {title: "hashtag", hashtag: req.params.hashtag});
});


module.exports = router;