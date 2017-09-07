//This file deploys a Ballot Contract to the given Ethereum node
//It then initalizes the new Ballot Items for the Contract
Web3 = require('web3');
fs = require('fs');
process.stdout.write("Locating Ethereum Node... ");
web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
process.stdout.write("Found\n\n");
process.stdout.write("Parsing Contract File...\n");
code = fs.readFileSync('./ballot_contract.sol').toString();
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
    process.stdout.write("Success!\n\n")
    process.stdout.write("Ballot Contract Stored at: " + contractInstance.address + "\n");
}, 1000);
