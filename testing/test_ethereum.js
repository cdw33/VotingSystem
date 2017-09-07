console.log("Ethereum Testing Script - Chris Wilson - 9.7.2017");

//Create a new testrpc session
Web3 = require('web3');
fs = require('fs');
process.stdout.write("Locating Ethereum Node... ");
web3 = new Web3(new Web3.providers.HttpProvider("http://192.168.1.73:8545"));
process.stdout.write("Found\n\n");
process.stdout.write("Parsing Contract File...\n");
code = fs.readFileSync('../ethereum/ballot_contract.sol').toString();
solc = require('solc');
process.stdout.write("Compiling... ");
compiledCode = solc.compile(code);
process.stdout.write("Success!\n\n");
abiDefinition = JSON.parse(compiledCode.contracts[':Ballot'].interface);
BallotContract = web3.eth.contract(abiDefinition);
byteCode = compiledCode.contracts[':Ballot'].bytecode;
process.stdout.write("Deploying Ballot Contract to Ethereum Node...");
deployedContract = BallotContract.new({data: byteCode, from: web3.eth.accounts[0], gas: 4700000});
setTimeout(function() {
    process.stdout.write("Done\n\n");
    process.stdout.write("Getting Instance of Ballot Contract..." + '\n');
    contractInstance = BallotContract.at(deployedContract.address);
    process.stdout.write("Creating Ballot Items... ")
    contractInstance.addBallotItem(1,1,[1,2,3],[0,0,0],{from: web3.eth.accounts[0], gas: 4700000})
    contractInstance.addBallotItem(2,2,[1,2],[0,0],{from: web3.eth.accounts[0], gas: 4700000})
    contractInstance.addBallotItem(3,3,[1,2,3],[0,0,0],{from: web3.eth.accounts[0], gas: 4700000})
    contractInstance.addBallotItem(4,2,[1,2],[0,0],{from: web3.eth.accounts[0], gas: 4700000})
    process.stdout.write("Success!\n\n")
    process.stdout.write("Ballot Contract Stored at: " + contractInstance.address + "\n");

    console.log("Starting Tests...");
    runTests();
}, 1000);

function runTests(){
  //get args from runtime
  var count=1;
  process.argv.forEach(function (c) {
    if(c > count){
      count = c;
    }
  });

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

  var expD = [0,0,0];
  var expE = [0,0];
  var expF = [0,0,0];
  var expG = [0,0];

  //generate and send as many ballots as the user requested
  for(var z=1; z<=count; z++){
    var d = a[(Math.floor(Math.random() * 9) + 1)-1];
    var e = b[(Math.floor(Math.random() * 2) + 1)-1];
    var f = c[(Math.floor(Math.random() * 3) + 1)-1];
    var g = b[(Math.floor(Math.random() * 2) + 1)-1];

    //Generate complete ballot
    var n = [1,3].concat(d,[2,2],e,[3,3],f,[4,2],g);

    //update exptected voting data
    for(var y=0; y<3; y++){
      expD[y] += 3-(d[y]-1);
    }

    for(y=0; y<2; y++){
      expE[y] += e[y];
    }

    for(y=0; y<3; y++){
      expF[y] += f[y];
    }

    for(y=0; y<2; y++){
      expG[y] += g[y];
    }

    console.log("Submitting ballot "+z);
    contractInstance.submitBallot(n,{from: web3.eth.accounts[0], gas: 4700000})
  }

  var result = contractInstance.getCompleteBallotResults.call([1,2,3,4]).toLocaleString().split(',');

  // console.log("result:" + result);
  console.log("Item 2 - Expected: [" + expE + "]   Actual: [" + result.slice(9, 11) + "]   - " + (equals(expE, result.slice(9, 11)) ? "Pass":"Fail!"));
  console.log("Item 1 - Expected: [" + expD + "] Actual: [" + result.slice(4, 7) + "] - " + (equals(expD, result.slice(4, 7)) ? "Pass":"Fail!"));
  console.log("Item 4 - Expected: [" + expG + "]   Actual: [" + result.slice(18, 20) + "]   - " + (equals(expG, result.slice(18, 20)) ? "Pass":"Fail!"));
  console.log("Item 3 - Expected: [" + expF + "] Actual: [" + result.slice(13, 16) + "] - " + (equals(expF, result.slice(13, 16)) ? "Pass":"Fail!"));

}

function equals(a,b){
    if(a.length != b.length){
      return false;
    }

    for(var i=0; i<a.length; i++){
      if(a[i] != b[i]){
        return false;
      }
    }

    return true;
}
