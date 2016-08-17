module.exports = function(app, passport, db, unsplash) {

  // test route that doesn't consume API calls
    app.get('/api/test', isLoggedIn, db.getAllPictures);

  // main routes for handling image API endpoints
  app.get('/api/curated', isLoggedIn, unsplash.getCuratedPictures);
  app.get('/api/pictures', isLoggedIn, unsplash.searchPictures);
  app.get('/api/pictures/like', isLoggedIn, unsplash.likePicture);
  app.get('/api/pictures/unlike', isLoggedIn, unsplash.unLikePicture);
  app.get('/api/liked', isLoggedIn, unsplash.getLikedPictures);
  app.get('/api/pictures/favorite', isLoggedIn, unsplash.favoritePicture);
  app.get('/api/favorited', isLoggedIn, unsplash.showFavoritedPictures);

  // unused routes for deleting pictures and other CRUD functions
  // app.post('/api/pictures', isLoggedIn, db.createPicture);
  // app.put('/api/pictures/:id', isLoggedIn, db.updatePicture);
  // app.delete('/api/pictures/:id', isLoggedIn, db.removePicture);

  // route for getting bearer token after logging in
  app.get('/sloogle', isLoggedIn, function(req, res) {
    if (req.query.code) {
      unsplash.getBearerToken(req.query.code, req.user.id);
      // res.redirect('/sloogle');
    }
    res.sendFile(__dirname + '/public/views/sloogle.html');
  });

	// route for home page with login links, using rendering of EJS templates
  app.get('/', function(req, res){
    res.render('index.ejs');
  });

  // logout route
	app.get('/logout', function(req, res) {
		req.logout();
		res.redirect('/');
	});

	// login route
	app.get('/login', function(req, res) {
		res.render('login.ejs', { message: req.flash('loginMessage') });
	});

  // process the login form
  app.post('/login', passport.authenticate('local-login', {
    successRedirect: '/sloogle',
    failureRedirect: '/login',
    failureFlash: true
  }));

  // signup form
	app.get('/signup', function(req, res) {
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
