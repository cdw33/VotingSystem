'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Vote Schema
 */
var VoteSchema = new Schema({
  hasVoted: {
    type: Boolean,
    default: true  
  },
  votedDate: {
    type: Date,
    default: Date.now
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('Vote', VoteSchema);
