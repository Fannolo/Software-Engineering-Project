'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Checkelement = mongoose.model('Checkelement'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create a Checkelement
 */
exports.create = function (req, res) {
  var checkelement = new Checkelement(req.body);
  checkelement.user = req.user;

  checkelement.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(checkelement);
    }
  });
};

/**
 * Show the current checkelement
 */
exports.read = function (req, res) {
  res.json(req.checkelement);
};

/**
 * Update a checkelement
 */
exports.update = function (req, res) {
  var checkelement = req.checkelement;

  checkelement.title = req.body.title;
  checkelement.content = req.body.content;

  checkelement.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(checkelement);
    }
  });
};

/**
 * Delete an checkelement
 */
exports.delete = function (req, res) {
  var checkelement = req.checkelement;

  checkelement.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(checkelement);
    }
  });
};

/**
 * List of checkelements
 */
exports.list = function (req, res) {
  Checkelement.find().sort('-created').populate('user', 'displayName').exec(function (err, checkelements) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(checkelements);
    }
  });
};

/**
 * checkelement middleware
 */
exports.checkelementByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'checkelement is invalid'
    });
  }

  Checkelement.findById(id).populate('user', 'displayName').exec(function (err, checkelement) {
    if (err) {
      return next(err);
    } else if (!checkelement) {
      return res.status(404).send({
        message: 'No checkelement with that identifier has been found'
      });
    }
    req.checkelement = checkelement;
    next();
  });
};
