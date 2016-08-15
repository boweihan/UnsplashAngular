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

function getBearerToken(code, userId) {
  request.post("https://unsplash.com/oauth/token?client_id=" + unsplashCred.applicationId + "&client_secret=" + unsplashCred.secret + "&redirect_uri=" + unsplashCred.callbackUrl + "&code=" + code + "&grant_type=authorization_code", function (error, response, body) {
    db.none('update users set token=$1 where id=$2', [(JSON.parse(response.body)).access_token, userId])
      .then(function () {
        console.log('token added to user: ' + userId)
      })
  });
}

function getAllPictures(string, bearerToken) {
  var search = "apple";

  request.get("https://api.unsplash.com/photos/search?client_id="+ unsplashCred.applicationId + "&page=1&query=" + search + "&Authorization=" + bearerToken, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      console.log(body);
    }
    else {
      console.log("error is " + error);
      console.log("response is " + JSON.stringify(response));
    }
  });
}


module.exports = {
  getBearerToken: getBearerToken,
  getAllPictures: getAllPictures
}
