[![Votem Logo](https://votem.com/wp-content/uploads/2015/04/logo2x.png)](http://votem.com/)

## About This Project
This application is my submission for Votem's Development Team Coding Assessment.

The goal was to build a functional web-based voting platform. The primary requirements are as follows:
* Voter Registration and Authentication
* Ballot Submission with Multiple contest types
* Viewing of Results
* Documentation

This project covers those basic requirements, and expands on them by also utilizing the Ethereum Blockchain to securely store voting records.  

## Implementation

From a high level, the implementation is as follows:

The software stack used is MEAN, which includes:
* __MongoDB__ - a schemaless NoSQL database system.
* __Express__ - a lightweight framework used to build web applications in Node.
* __AngularJS__ - a JavaScript framework developed by Google.
* __Node.js__ - a server side JavaScript execution environment.

The application boilerplate code is:
* __MEAN.JS__ - a full-stack JavaScript solution that helps you build fast, robust, and maintainable production web applications.

The Blockchain is:
* __Ethereum__ - a  decentralized platform that runs smart contracts: applications that run exactly as programmed without any possibility of downtime, censorship, fraud or third party interference.

## Prerequisites
The following applications are required to build this project:
* __Node.js 7+__
```bash
$ curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash -
$ sudo apt-get install -y nodejs
```
* __MongoDB__ (https://docs.mongodb.com/manual/installation/)
```bash
$ sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 0C49F3730359A14518585931BC711F9BA15703C6
$ echo "deb [ arch=amd64,arm64 ] http://repo.mongodb.org/apt/ubuntu xenial/mongodb-org/3.4 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-3.4.list
$ sudo apt-get update
$ sudo apt-get install -y mongodb-org
```
* __npm__
```bash
$ sudo apt-get install npm
```
* __Grunt__
```bash
$ npm install -g grunt-cli
```

For testing purposes, you will need the following, both can be installed via npm:
* __testrpc__
* __web3__
```bash
$ npm install ethereumjs-testrpc web3@0.20.1
```

Once all the prerequisites are installed, the project can be downloaded using git
```bash
$ git clone https://github.com/cdw33/VotingSystem
```

## Setting up the development environment

First, ensure MongoDB is running
```bash
$ sudo service mongod start
```
Next, start up the Ethereum test node
```bash
$ testrpc
```

Now you can deploy the ballot contract to the blockchain by navigating into the Ethereum folder in the projects root directory and running:
```bash
$ node deploy_contract.js
```
This command will output the address of the contract which needs to be copied into the project file
```bash
'./modules/votes/server/controllers/votes.server.controller.js'
```
into the line:
```bash
const contractInstance = web3.eth.contract(abiDefinition).at(COPY_HERE);
```

## Running the application
At this point you should be able to build and run the application, to do so, navigate the the projects root directory and run grunt:
```bash
$ grunt
```

If there are no errors, you should now be able to access the app at localhost:3000/

## License
(The MIT License)

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
