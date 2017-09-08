console.log("Ethereum Contract Population Script - Chris Wilson - 9.7.2017");

//get args from runtime
var count=1;
process.argv.forEach(function (c) {
  if(c > count){
    count = c;
  }
});

Web3 = require('web3');
process.stdout.write("Locating Ethereum Node... ");
var web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
process.stdout.write("Found\n\n");
var abiDefinition = JSON.parse('[{"constant":false,"inputs":[{"name":"ballotID","type":"uint8"},{"name":"ballotVote","type":"uint32[]"},{"name":"numElements","type":"uint8"}],"name":"castVote","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint8"}],"name":"ballotItems","outputs":[{"name":"itemID","type":"uint8"},{"name":"voteType","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"id","type":"uint8"},{"name":"vType","type":"uint8"},{"name":"vEntries","type":"uint8[]"},{"name":"vResults","type":"uint32[]"}],"name":"addBallotItem","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"itemIds","type":"uint8[]"}],"name":"getCompleteBallotResults","outputs":[{"name":"","type":"uint32[]"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"ballotID","type":"uint8"}],"name":"getResultsFor","outputs":[{"name":"","type":"uint32[]"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"ballotVote","type":"uint8[]"}],"name":"submitBallot","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"}]');
process.stdout.write("Getting Instance of Ballot Contract..." + '\n');
const contractInstance = web3.eth.contract(abiDefinition).at("0x854a5b7c2bc1bb2d58909810962f98b9f1c96557");
setTimeout(function() {
    process.stdout.write("Success!\n\n")

    console.log("Starting Contract Population...");
    runTests();
}, 1000);

function runTests(){

  var a_size = 9;
  var b_size = 2;
  var c_size = 3;

  var a = [
    [1,2,3],
    [3,1,2],
    [2,3,1],
    [1,3,2],
    [1,2,3],
    [3,1,2],
    [2,1,3],
    [3,2,1],
    [1,3,2]
  ];

  var b = [
    [1,0],
    [0,1]
  ];

  var c = [
    [1,1,0],
    [1,0,1],
    [0,1,1]
  ];

  //generate and send as many ballots as the user requested
  for(var z=0; z<count; z++){
    var d = a[(Math.floor(Math.random() * 9) + 1)-1];
    var e = b[(Math.floor(Math.random() * 2) + 1)-1];
    var f = c[(Math.floor(Math.random() * 3) + 1)-1];
    var g = b[(Math.floor(Math.random() * 2) + 1)-1];

    //Generate complete ballot
    var n = [1,3].concat(d,[2,2],e,[3,3],f,[4,2],g);

    console.log("Submitting ballot "+(z+1));
    contractInstance.submitBallot(n,{from: web3.eth.accounts[0], gas: 4700000});
  }

  console.log("Done.");
}
