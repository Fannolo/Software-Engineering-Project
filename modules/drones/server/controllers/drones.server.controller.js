'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Drone = mongoose.model('Drone'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create a drone
 */
exports.create = function (req, res) {
  var drone = new Drone(req.body);
  drone.user = req.user;

  drone.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(drone);
    }
  });
};

/**
 * Show the current drone
 */
exports.read = function (req, res) {
  res.json(req.drone);
};

/**
 * Update a drone
 */
exports.update = function (req, res) {
  var drone = req.drone;

  drone.title = req.body.title;
  drone.content = req.body.content;

  drone.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(drone);
    }
  });
};

/**
 * Delete an drone
 */
exports.delete = function (req, res) {
  var drone = req.drone;

  drone.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(drone);
    }
  });
};

/**
 * List of drones
 */
exports.list = function (req, res) {
  Drone.find().sort('-created').populate('user', 'displayName').exec(function (err, drones) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(drones);
    }
  });
};

/**
 * drone middleware
 */
exports.droneByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'drone is invalid'
    });
  }

  Drone.findById(id).populate('user', 'displayName').exec(function (err, drone) {
    if (err) {
      return next(err);
    } else if (!drone) {
      return res.status(404).send({
        message: 'No drone with that identifier has been found'
      });
    }
    req.drone = drone;
    next();
  });
};
