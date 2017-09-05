//Web3 = require('web3');
//web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
abiDefinition = JSON.parse('[{"constant":false,"inputs":[{"name":"ballotID","type":"uint8"},{"name":"ballotVote","type":"uint32[]"},{"name":"numElements","type":"uint8"}],"name":"castVote","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint8"}],"name":"ballotItems","outputs":[{"name":"itemID","type":"uint8"},{"name":"voteType","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"id","type":"uint8"},{"name":"vType","type":"uint8"},{"name":"vEntries","type":"uint8[]"},{"name":"vResults","type":"uint32[]"}],"name":"addBallotItem","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"itemIds","type":"uint8[]"}],"name":"getCompleteBallotResults","outputs":[{"name":"","type":"uint32[]"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"ballotID","type":"uint8"}],"name":"getResultsFor","outputs":[{"name":"","type":"uint32[]"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"ballotVote","type":"uint8[]"}],"name":"submitBallot","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"}]');
BallotContract = web3.eth.contract(abiDefinition);
contractInstance = BallotContract.at('0xcbf455c5787050f0057bdd199ed90175519e1d4a');
//
//var ballot = [{"id":1,"type":1,"title":"FOR COMMANDER IN CREAM AND VICE ICE","subTitle":"(RANKED CHOICE VOTING (INSTANT RUNOFF))","instructions":"Rank candidates in order of choice. Mark your favorite candidate as first choice and then indicate your second and additional back-up choices in order of choice. You may rank as many candidates as you want.","candidates":["Reese WithoutASpoon - Democrat for C.I.C<br>Cherry Garcia - Democrat for Vice Ice","Choco 'Chip' Dough - Republican for C.I.C<br>Carmela Coney - Republican for Vice Ice","Magic Browny - Independent for C.I.C<br>Phish Food - Independent for C.I.C"],"votes":[23, 2, 67]}]

function test(){
    console.log("test");
}

function submitBallot(){

    data = [1,3,3,1,2,2,2,1,0,3,2,1,3];

    contractInstance.submitBallot([1,3,3,1,2,2,2,1,0,3,2,1,3],{from: web3.eth.accounts[0], gas: 4700000})

    // return contractInstance.getCompleteBallotResults.call([1,2,3]).toLocaleString()
    return contractInstance.getResultsFor.call(1).toLocaleString();
}

function getBallotResults(){
    return contractInstance.getCompleteBallotResults.call([1,2,3]).toLocaleString();
}

var app = angular.module("myApp", []);
app.controller("myCtrl", function($scope) {
  $scope.myTxt = "You have not yet clicked submit";
  $scope.submitBallot = function () {
      $scope.myTxt = "You clicked submit!";
  }
});

candidates = {"Rama": "candidate-1", "Nick": "candidate-2", "Jose": "candidate-3"}

function voteForCandidate() {
  candidateName = $("#candidate").val();
  contractInstance.voteForCandidate(candidateName, {from: web3.eth.accounts[0]}, function() {
    let div_id = candidates[candidateName];
    $("#" + div_id).html(contractInstance.totalVotesFor.call(candidateName).toString());
  });
}

$(document).ready(function() {
//   candidateNames = Object.keys(candidates);
//   for (var i = 0; i < candidateNames.length; i++) {
//     let name = candidateNames[i];
//     let val = contractInstance.totalVotesFor.call(name).toString()
//     $("#" + candidates[name]).html(val);
//   }
});
