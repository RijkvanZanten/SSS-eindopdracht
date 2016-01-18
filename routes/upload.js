var express = require('express'),
	router  = express.Router(),
	multer	= require('multer'),
	upload  = multer({dest: 'public/usermedia/photos'}),
	path	= require('path'),
	fs		= require('fs');
	


// ------------------------------------------------------------
// GET
// Show the upload form to users 
// ------------------------------------------------------------

router.get('/', function(req, res) {
	res.render('upload', {title: 'Upload photo', bodyclass: 'uploadphoto'});
});



// ------------------------------------------------------------
// POST
// New image to usermedia dir and insert record into DB
// ------------------------------------------------------------

// Middleware functions
// ------------------------------------------------------------

var uploadFile = upload.single('photo');

// Move file to correct subdirectory ordered by date
function moveFile(req, res, next) {
	
	// If there is no file uploaded, proceed to the errorCallback
	if(!req.file) {
		req.error = {
			code: 1,
			msg: 'No file uploaded'
		}
		next();
	}
	
	
	// Check if uploaded image is a png or a jpeg. If not, proceed to errorCallback.
	if(req.file.mimetype == 'image/png' || req.file.mimetype == 'image/jpeg') {
	
		var date = new Date();
		var year = date.getFullYear().toString();
		var month = date.getMonth() + 1;
		
		if(month < 10) {
			month = '0' + month.toString();
		} else {
			month = month.toString();
		}
		
		// Check if image year directory exists
		fs.stat(path.join('public/usermedia/photos', year), function(error, stat) {
			
			// If not; create directory for current year
			if(error && error.errno === -2) {
				fs.mkdirSync(path.join('public/usermedia/photos', year));
			} else if(error && error !== -2){
				req.error = {
					code: 3,
					msg: 'Error in getting year directory information',
					stat: error
				}
			}
			
			// Check if image month directory exists
			fs.stat(path.join('public/usermedia/photos', year, month), function(error, stat) {
				
				// If not; create directory for current month
				if(error && error.errno === -2) {
					fs.mkdirSync(path.join('public/usermedia/photos', year, month));
				} else if(error && error !== -2){
					req.error = {
						code: 4,
						msg: 'Error in getting month directory information',
						stat: error
					}
				}
				
				// Place uploaded file in the correct directory and reset the name
				fs.rename(req.file.path, path.join('public/usermedia/photos', year, month, req.file.originalname));
				
				next();
			});
		});
		
	} else {
		req.error = {
			code: 1,
			msg: "Uploaded file wasn't an image"
		}
		next();
	}
	
}


function insertData(req, res, next) {
	
	// If the previous middleware had an error, proceed to the errorCallback
	if(req.error) {
		next();
	} else {
		req.getConnection(function(error, connection) {
			if(error) {
				req.error = {
					code: 5,
					msg: 'Error in creating database connection',
					stat: error
				};
				next();
			} else {
				connection.query('INSERT INTO photos (filename, userID, caption, date) VALUES (?, ?, ?, NOW() );', [req.file.originalname, 1, req.body.caption], function(error, result) {
					if(error) {
						req.error = {
							code: 6,
							msg: 'Error in SQL query',
							stat: error
						};
						next();
					} else {
						res.redirect('/');
					}
				});
			}
		});
	}
}

function errorCallback(req, res) {
	res.status(500);
	res.send(req.error);
}

router.post('/', uploadFile, moveFile, insertData, errorCallback);
	
	
	

module.exports = router;