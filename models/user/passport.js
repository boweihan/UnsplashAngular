// bcrypt for salting and hashing password
var bcrypt = require('bcrypt');

// load authentication strategies (local strategy in this case, option to add oauth)
var LocalStrategy = require('passport-local').Strategy;

// load bluebird promise library
var promise = require('bluebird');
var options = {
  // overrode pg-promise promise library with bluebird
  promiseLib: promise
};

// postgres info
var pgp = require('pg-promise')(options);
var connectionString = 'postgres://bowei:test@localhost:5432/pictures';
var db = pgp(connectionString);

// local login
module.exports = function(passport) {

  // used to serialize the user for the session
  passport.serializeUser(function(user, done) {
      done(null, user.id);
  });

  // used to deserialize the user
  passport.deserializeUser(function(id, done) {
    db.one('select * from users where id = $1', [id])
      .then(function(user){
        done(null, user);
      }).catch(function(e){
        done(e, false);
      });
  });

  // defining the local-login function for passport
  passport.use('local-login', new LocalStrategy({
      // by default, local strategy uses username and password, we will override with email
      usernameField : 'email',
      passwordField : 'password',
      passReqToCallback : true // allows us to pass in the req from our route (lets us check if a user is logged in or not)
  },
  // checks if password matches encrypted password
  function(req, email, password, done) {
    db.one('select * from users where email = $1', [email])
      .then(function(user) {
        console.log(user);
        if (user && bcrypt.compareSync(password, user.password)) {
          done(null, user);
        }
        else {
          done(null, false, req.flash('loginMessage', 'Unknown Credentials'));
        }
      })
      .catch(function(e) {
        done(null, false, req.flash('loginMessage', 'Unknown Credentials'));
      });
  }));

  // The legendary nested database query to automatically log in after signing up (lord have mercy)
  passport.use('local-signup', new LocalStrategy({
    usernameField : 'email',
    passwordField : 'password',
    passReqToCallback : true
  },
  function(req, email, password, done) {
    db.one('select * from users where email = $1', [email])
      .then(function(user) {
        if (user) {
          done(null, false, req.flash('loginMessage', 'That email is already taken1.'));
        }
      })
      .catch(function(e) {
        console.log(bcrypt.hashSync(password, 10));
        db.none('insert into users (email, password) values ($1, $2)', [email, bcrypt.hashSync(password, 10)])
          .then(function() {
            db.one('select * from users where email = $1', [email])
              .then(function(user) {
                if (user && bcrypt.compareSync(password, user.password)) {
                  done(null, user);
                }
              })
          })
      })
  }));
}
