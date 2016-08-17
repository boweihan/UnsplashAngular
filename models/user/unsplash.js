// request library for express
var request = require('request');

// bluebird for promises
var promise = require('bluebird');
var options = {
  // overrode pg-promise promise library with bluebird
  promiseLib: promise
};

// postgres information
var pgp = require('pg-promise')(options);
var connectionString = 'postgres://bowei:test@localhost:5432/pictures';
var db = pgp(connectionString);

// api keys
var unsplashCred = {
  applicationId: "78cd46cc136d378fcd53b6f3a7754591387e38d78dccfa52bf3563999447df99",
  secret: "0aa60887488aa8264bb73f0b75a5f0a41cc3cd28da67ed36e15363f7047b6f76",
  bearer: "",
  callbackUrl: "http://localhost:8080/sloogle"
}

// get user name to use in API calls (called automatically after getting bearer token)
function getUserName(token, userId) {
  request.get("https://api.unsplash.com/me?client_id=" + unsplashCred.applicationId + "&bearer_token=" + token, function (error, response, body) {
    db.none('update users set username=$1 where id=$2', [(JSON.parse(body)).username, userId])
      .then(function () {
        console.log('username: ' + JSON.parse(body).username + ', added to user: ' + userId)
      })
  });
}

// get bearer token right after logging in
function getBearerToken(code, userId) {
  request.post("https://unsplash.com/oauth/token?client_id=" + unsplashCred.applicationId + "&client_secret=" + unsplashCred.secret + "&redirect_uri=" + unsplashCred.callbackUrl + "&code=" + code + "&grant_type=authorization_code", function (error, response, body) {
    db.none('update users set token=$1 where id=$2', [(JSON.parse(response.body)).access_token, userId])
      .then(function () {
        console.log(JSON.parse(response.body));
        console.log('token:' + JSON.parse(response.body).access_token + ', added to user: ' + userId);
        getUserName((JSON.parse(response.body).access_token), userId);
      })
  });
}

// API call to unsplash to search for pictures
function searchPictures(req, res, next) {
  console.log(req.query.search);
  request.get("https://api.unsplash.com/photos/search?client_id="+ unsplashCred.applicationId + "&page=1&per_page=50&query=" + req.query.search + "&bearer_token=" + req.user.token, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      res.json({
        status: 'success',
        data: body,
        message: 'retrieved searched pictures'
      });
    } else {
      console.log("request to unsplash.getAllPictures failed!");
    }
  });
}

// API call to unsplash to get curated pictures
function getCuratedPictures(req, res, next) {
  console.log(req.user.token);
  request.get("https://api.unsplash.com/photos/curated?client_id="+ unsplashCred.applicationId + "&page=1&per_page=50&bearer_token=" + req.user.token, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      res.json({
        status: 'success',
        data: body,
        message: 'retrieved curated pictures'
      });
    } else {
      console.log("request to unsplash.getCuratedPictures failed!");
    }
  });
}

// API call to unsplash to like a picture for a user
function likePicture(req, res, next) {
  request.post("https://api.unsplash.com/photos/"+req.query.id+"/like?client_id="+ unsplashCred.applicationId + "&bearer_token=" + req.user.token, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      res.json({
        status: 'success',
        message: 'you liked a picture!'
      });
    } else {
      console.log("request to unsplash.likePicture failed!");
    }
  });
}

// API call to unsplash to unlike a picture for a user
function unLikePicture(req, res, next) {
  request.delete("https://api.unsplash.com/photos/"+req.query.id+"/like?client_id="+ unsplashCred.applicationId + "&bearer_token=" + req.user.token, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      res.json({
        status: 'success',
        message: 'you unliked a picture!'
      });
    } else {
      console.log("request to unsplash.unLikePicture failed!");
    }
  });
}

// API call to unsplash to get all the pictures a user has liked
function getLikedPictures(req, res, next) {
  request.get("https://api.unsplash.com/users/" + req.user.username + "/likes?client_id="+ unsplashCred.applicationId + "&bearer_token=" + req.user.token + "&page=1&per_page=50", function (error, response, body) {
    if (!error && response.statusCode == 200) {
      res.json({
        status: 'success',
        data: body,
        message: 'here are your pictures!'
      });
    } else {
      console.log("request to unsplash.getLikedPictures failed");
    }
  });
}


// database query to insert a favorited picture into the database
function favoritePicture(req, res, next) {
  console.log('favoriting picture');
  db.none('insert into pics (img, user_id)' + 'values ($1, $2)', [req.query.image, req.user.id])
    .then(function () {
      res.status(200)
        .json({
          status: 'success',
          message: 'favorited picture'
        });
    })
    .catch(function (err) {
      return next(err);
    });
}

// database query to show all favorited (i.e. saved) images
function showFavoritedPictures(req, res, next) {
  console.log('showing favorited pictures');
  db.any('select * from pics where user_id='+req.user.id)
    .then(function (data) {
      res.status(200)
        .json({
          status: 'success',
          data: data,
          message: 'retrieved all pictures'
        });
    })
    .catch(function (err) {
      return next(err);
    });
}

module.exports = {
  getBearerToken: getBearerToken,
  searchPictures: searchPictures,
  getCuratedPictures: getCuratedPictures,
  likePicture: likePicture,
  unLikePicture: unLikePicture,
  getLikedPictures: getLikedPictures,
  getUserName: getUserName,
  favoritePicture: favoritePicture,
  showFavoritedPictures: showFavoritedPictures
}
