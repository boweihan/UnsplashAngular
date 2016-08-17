// THIS FILE IS DEPRECATED AND NO LONGER IN USE FOR THE APP
// It provided base CRUD functionality for picture manipulation

var promise = require('bluebird');
var options = {
  // overrode pg-promise promise library with bluebird
  promiseLib: promise
};
var pgp = require('pg-promise')(options);
var connectionString = 'postgres://oeupplkqmvjyik:j-USwIR_qmpHvvctYfiLigVkao@ec2-54-221-226-148.compute-1.amazonaws.com:5432/d1ab48uu38khao';
var db = pgp(connectionString);

// get all pictures
function getAllPictures(req, res, next) {
  db.any('select * from pics')
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

// get single picture
function getSinglePicture(req, res, next) {
  var picID = parseInt(req.params.id);
  db.one('select * from pics where id = $1', picID)
    .then(function (data) {
      res.status(200)
        .json({
          status: 'success',
          data: data,
          message: 'retrieved one picture'
        });
    })
    .catch(function (err) {
      return next(err);
    });
}

// create a new picture in the database
function createPicture(req, res, next) {
  db.none('insert into pics(name, description, img)' + 'values(${name}, ${description}, ${img}', req.body)
    .then(function () {
      res.status(200)
        .json({
          status: 'success',
          message: 'inserted one picture'
        });
    })
    .catch(function (err) {
      return next(err);
    });
}

// update a picture in the database
function updatePicture(req, res, next) {
  db.none('update pics set name=$1, description=$2, img=$3 where id=$4', [req.body.name, req.body.description, req.body.img, parseInt(req.body.id)])
    .then(function () {
      res.status(200)
        .json({
          status: 'success',
          message: 'updated picture'
        });
    })
    .catch(function (err) {
      return next(err);
    });
}

// destroy a picture
function removePicture(req, res, next) {
  var picID = parseInt(req.params.id);
  db.result('delete from pics where id=$1', picID)
    .then(function (result) {
      res.status(200)
        .json({
          status: 'success',
          message: `removed ${result.rowCount} picture`
        });
    })
    .catch(function (err) {
      return next(err);
    });
}

module.exports = {
  getAllPictures: getAllPictures,
  getSinglePicture: getSinglePicture,
  createPicture: createPicture,
  updatePicture: updatePicture,
  removePicture: removePicture,
}
