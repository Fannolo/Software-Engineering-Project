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
    default: ''
  },
  address: {
    type: String,
    default: ''
  },
  checklist: {
    type: String,
    default: ''
  },
  drone: {
    type: String,
    default: ''
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  postFlightNotes: {
    type: String,
    default: ''
  },
  flightActive:{
    type: Boolean,
    default: true
  }
});

mongoose.model('Flight', FlightSchema);
