'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Flight Schema
 */
var FlightSchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  title: {
    type: String,
    default: '',
    trim: true,
    required: 'Title cannot be blank'
  },
  content: {
    type: String,
    default: '',
    trim: true
  },
  address: {
    type: String,
    default: '',
    trim: true
  },
  checklists: {
    type: Schema.ObjectId,
    ref: 'Checklists'
  },
  drones: {
    type: Schema.ObjectId,
    ref: 'Drones'
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  postFlightNotes: {
    type: String,
    default: '',
    trim: true,
    required: 'Title cannot be blank'
  }
});

mongoose.model('Flight', FlightSchema);
