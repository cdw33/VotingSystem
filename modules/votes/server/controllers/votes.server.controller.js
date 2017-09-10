'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Vote = mongoose.model('Vote'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash'),
  Web3 = require('web3');

  var web3 = new Web3(new Web3.providers.HttpProvider("http://192.168.1.73:8545"));
  var abiDefinition = JSON.parse('[{"constant":false,"inputs":[{"name":"ballotID","type":"uint8"},{"name":"ballotVote","type":"uint32[]"},{"name":"numElements","type":"uint8"}],"name":"castVote","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint8"}],"name":"ballotItems","outputs":[{"name":"itemID","type":"uint8"},{"name":"voteType","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"id","type":"uint8"},{"name":"vType","type":"uint8"},{"name":"vEntries","type":"uint8[]"},{"name":"vResults","type":"uint32[]"}],"name":"addBallotItem","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"itemIds","type":"uint8[]"}],"name":"getCompleteBallotResults","outputs":[{"name":"","type":"uint32[]"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"ballotID","type":"uint8"}],"name":"getResultsFor","outputs":[{"name":"","type":"uint32[]"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"ballotVote","type":"uint8[]"}],"name":"submitBallot","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"}]');
  const contractInstance = web3.eth.contract(abiDefinition).at("0x8a655e7401dcd385cee9dab23d64a14004ef35a1");

/**
 * Create a Vote
 */
exports.create = function(req, res) {
  var vote = new Vote(req.body);
  vote.user = req.user;

  //Get what cmd to process
  var cmd = req.body.cmd;

  var data;
  switch(cmd) {
    case 1: //get ballot data from form
        data = [1, 3, req.body.A1, req.body.A2, req.body.A3,
                2, 2, req.body.B1 == 1 ? 1:0, req.body.B2 == 2 ? 1:0,
                3, 3, req.body.C1 == true ? 1:0, req.body.C2 == true ? 1:0, req.body.C3 == true ? 1:0,
                4, 2, req.body.D1 == 1 ? 1:0, req.body.D2 == 2 ? 1:0];
        break;
    case 2: //get voting request data
        data = req.body.data;
        break;
    default:
   }

  vote.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {

     //Process and return data based on given command
    switch(cmd) {
      case 1: //submit ballot data to blockchain
          contractInstance.submitBallot(data,{from: web3.eth.accounts[0], gas: 4700000})
          res.jsonp(vote);
          break;
      case 2: //request voting data from blockchain
          res.jsonp(JSON.stringify(contractInstance.getCompleteBallotResults.call([1,2,3,4]).toLocaleString()));
          break;
      default:
        return res.status(400).send({
          message: errorHandler.getErrorMessage("Unknown Command")
        });
     }
    }
  });
};

/**
 * Show the current Vote
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var vote = req.vote ? req.vote.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  vote.isCurrentUserOwner = req.user && vote.user && vote.user._id.toString() === req.user._id.toString();

  res.jsonp(vote);
};

/**
 * Update a Vote
 */
exports.update = function(req, res) {
  var vote = req.vote;

  vote = _.extend(vote, req.body);

  vote.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(vote);
    }
  });
};

/**
 * Delete an Vote
 */
exports.delete = function(req, res) {
  var vote = req.vote;

  vote.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(vote);
    }
  });
};

/**
 * List of Votes
 */
exports.list = function(req, res) {
  Vote.find().sort('-created').populate('user', 'displayName').exec(function(err, votes) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(votes);
    }
  });
};

/**
 * Vote middleware
 */
exports.voteByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Vote is invalid'
    });
  }

  Vote.findById(id).populate('user', 'displayName').exec(function (err, vote) {
    if (err) {
      return next(err);
    } else if (!vote) {
      return res.status(404).send({
        message: 'No Vote with that identifier has been found'
      });
    }
    req.vote = vote;
    next();
  });
};
