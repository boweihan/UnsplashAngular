var request = require('request');
var promise = require('bluebird');
var options = {
  // overrode pg-promise promise library with bluebird
  promiseLib: promise
};
var pgp = require('pg-promise')(options);
var connectionString = 'postgres://bowei:test@localhost:5432/pictures';
var db = pgp(connectionString);

var unsplashCred = {
  applicationId: "78cd46cc136d378fcd53b6f3a7754591387e38d78dccfa52bf3563999447df99",
  secret: "0aa60887488aa8264bb73f0b75a5f0a41cc3cd28da67ed36e15363f7047b6f76",
  bearer: "",
  callbackUrl: "http://localhost:8080/sloogle"
}
//token comes back invalid for this at the moment
function getUserName(token, userId) {
  request.get("https://api.unsplash.com/me?client_id=" + unsplashCred.applicationId + "&bearer_token=" + token, function (error, response, body) {
    db.none('update users set username=$1 where id=$2', [(JSON.parse(body)).username, userId])
      .then(function () {
        console.log('username: ' + JSON.parse(body).username + ', added to user: ' + userId)
      })
  });
}

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

function searchPictures(req, res, next) {
  request.get("https://api.unsplash.com/photos/search?client_id="+ unsplashCred.applicationId + "&page=1&query=" + "apple" + "&bearer_token=" + req.user.token, function (error, response, body) {
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

function getCuratedPictures(req, res, next) {
  console.log(req.user.token);
  request.get("https://api.unsplash.com/photos/curated?client_id="+ unsplashCred.applicationId + "&page=1&bearer_token=" + req.user.token, function (error, response, body) {
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

function getLikedPictures(req, res, next) {
  request.get("https://api.unsplash.com/users/" + req.user.username + "/likes?client_id="+ unsplashCred.applicationId + "&bearer_token=" + req.user.token + "&page=1", function (error, response, body) {
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


module.exports = {
  getBearerToken: getBearerToken,
  searchPictures: searchPictures,
  getCuratedPictures: getCuratedPictures,
  likePicture: likePicture,
  unLikePicture: unLikePicture,
  getLikedPictures: getLikedPictures,
  getUserName: getUserName
}
