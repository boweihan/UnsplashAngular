module.exports = function(app, passport, db, unsplash) {
// picture routes
  app.get('/api/curated', isLoggedIn, unsplash.getCuratedPictures);
  app.get('/api/pictures', isLoggedIn, unsplash.searchPictures);
  app.get('/api/pictures/like', isLoggedIn, unsplash.likePicture);
  app.get('/api/pictures/unlike', isLoggedIn, unsplash.unLikePicture);
  app.get('/api/liked', isLoggedIn, unsplash.getLikedPictures);
  // app.post('/api/pictures', isLoggedIn, db.createPicture);
  // app.put('/api/pictures/:id', isLoggedIn, db.updatePicture);
  // app.delete('/api/pictures/:id', isLoggedIn, db.removePicture);
// normal routes ===============================================================
  app.get('/sloogle', isLoggedIn, function(req, res) {
    if (req.query.code) {
      unsplash.getBearerToken(req.query.code, req.user.id);
    }
    // res.render('sloogle.ejs');
    res.sendFile(__dirname + '/public/views/sloogle.html');
  });
	// show the home page (will also have our login links)
  app.get('/', function(req, res){
    // res.sendFile(__dirname + '/views/index.html');
    res.render('index.ejs');
  });

	// LOGOUT ==============================
	app.get('/logout', function(req, res) {
		req.logout();
		res.redirect('/');
	});

// =============================================================================
// AUTHENTICATE (FIRST LOGIN) ==================================================
// =============================================================================

	// locally --------------------------------
		// LOGIN ===============================
		// show the login form
		app.get('/login', function(req, res) {
			res.render('login.ejs', { message: req.flash('loginMessage') });
		});
    // app.get('/login', function(req, res){
    //   res.sendFile(__dirname + '/views/login.ejs');
    // });

    app.post('/login', passport.authenticate('local-login', {
      successRedirect: '/sloogle',
      failureRedirect: '/login',
      failureFlash: true
    }));

		// SIGNUP =================================
		// show the signup form
		app.get('/signup', function(req, res) {
      // res.sendFile(__dirname + '/views/signup.html');
      res.render('signup.ejs', { message: req.flash('loginMessage') });
		});

		// process the signup form
		app.post('/signup', passport.authenticate('local-signup', {
			successRedirect : '/sloogle', // redirect to the secure profile section
			failureRedirect : '/signup', // redirect back to the signup page if there is an error
			failureFlash : true // allow flash messages
		}));
};

// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
	if (req.isAuthenticated())
		return next();

	res.redirect('/');
}
