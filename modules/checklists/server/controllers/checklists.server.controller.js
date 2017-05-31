'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Checklist = mongoose.model('Checklist'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create a checklist
 */
exports.create = function (req, res) {
  var checklist = new Checklist(req.body);
  checklist.user = req.user;
  checklist.checkelement = req.checkelement;

  checklist.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(checklist);
    }
  });
};

/**
 * Show the current checklist
 */
exports.read = function (req, res) {
  res.json(req.checklist);
};

/**
 * Update a checklist
 */
exports.update = function (req, res) {
  var checklist = req.checklist;

  checklist.title = req.body.title;
  checklist.content = req.body.content;
  checklist.checkelement = req.body.checkelement;

  checklist.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(checklist);
    }
  });
};

/**
 * Delete an checklist
 */
exports.delete = function (req, res) {
  var checklist = req.checklist;

  checklist.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(checklist);
    }
  });
};

/**
 * List of Checklists
 */
exports.list = function (req, res) {
  Checklist.find().sort('-created').populate('user', 'displayName').exec(function (err, checklists) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(checklists);
    }
  });
};

/**
 * Checklist middleware
 */
exports.checklistByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Checklist is invalid'
    });
  }

  Checklist.findById(id).populate('user', 'displayName').exec(function (err, checklist) {
    if (err) {
      return next(err);
    } else if (!checklist) {
      return res.status(404).send({
        message: 'No checklist with that identifier has been found'
      });
    }
    req.checklist = checklist;
    next();
  });
};
