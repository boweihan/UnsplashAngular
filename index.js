// tools that we need
var express = require('express');
var passport = require('passport');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var db = require('./models/deprecated/picture');
var app = express();
var flash = require('connect-flash');
var unsplash = require('./models/picture');

// passport configuration file (fuck yeah, modularity!)
require('./models/user')(passport); // pass passport for configuration

// we need this to be an app
app.use(cookieParser());
app.use(bodyParser());

// the stuff we're using for passport
app.use(session({ secret: 'zomaareenstukjetekstDatjenietzomaarbedenkt'}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// allow serving of static files (ie in public)
app.use('/public', express.static(__dirname + '/public'));

// set view engine to allow embedded JS and change the default directory from ./views to ./public/views
app.set('view engine', 'ejs');
app.set('views', __dirname + '/public/views');

// routes
require('./routes')(app, passport, db, unsplash);

// start the server
app.listen(8080, function() {
  console.log("Sick, the node server is running! (localhost:8080)")
})
