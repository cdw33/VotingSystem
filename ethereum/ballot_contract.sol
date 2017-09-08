pragma solidity ^0.4.11;

contract Ballot {

  //Ballot Item object, each ballot is made up of several Ballot Items
  struct BallotItem {
      uint8 itemID;
      uint8 voteType; //1=ranked, 2=simple majority, 3=pick 2
      uint8[] entries;
      uint32[] results;
  }

  //Hash table using (BallotItemID, BallotItem Object) key/value pair
  mapping (uint8 => BallotItem) public ballotItems;

  //Ballot Constructor
  function Ballot() {}

  //Given the Ballot Item attributes, create a new Ballot Item and add it to the map
  function addBallotItem(uint8 id, uint8 vType, uint8[] vEntries, uint32[] vResults){
    BallotItem memory bi = BallotItem({
                              itemID: id,
                              voteType: vType,
                              entries: vEntries,
                              results: vResults
                           });

    ballotItems[id] = bi;
  }

  //Handle voter submitted data for a given Ballot Item based on the Item type (ranked, simple majority, etc.)
  function castVote(uint8 ballotID, uint32[] ballotVote, uint8 numElements) {
    uint j;
    uint8 voteCount;

    if(ballotItems[ballotID].voteType == 1) { //Ranked
        uint weight;

        for(j = 0; j < numElements; j++) {

            weight = numElements-(ballotVote[j]-1);

            ballotItems[ballotID].results[j]+=uint32(weight);
        }
    }
    else if(ballotItems[ballotID].voteType == 2) { //Simple Majority
        voteCount = 0;
        uint voteIndex;

        for(j = 0; j < numElements; j++) {
            if(ballotVote[j] == 1) {
                voteCount++;
                voteIndex = j;
            }
        }

        if(voteCount == 0) {
            //ERROR - No Votes
        }
        else if(voteCount > 1) {
            //ERROR - Too Many Votes
        }
        else{
            ballotItems[ballotID].results[voteIndex]++;
        }
    }
    else if(ballotItems[ballotID].voteType == 3) { //Pick 2
        voteCount = 0;
        uint[2] voteIndices;

        for(j = 0; j < numElements; j++) {
            if(ballotVote[j] == 1){
                voteCount++;

                if(voteCount <= 2){
                  voteIndices[voteCount-1] = j;
                }
            }
        }

        if(voteCount == 0) {
            //ERROR - No Votes
        }
        else if(voteCount > 2) {
            //ERROR - Too Many Votes
        }
        else if(voteCount == 1) {
            ballotItems[ballotID].results[voteIndices[0]]++;
        }
        else if(voteCount == 2) {
            ballotItems[ballotID].results[voteIndices[0]]++;
            ballotItems[ballotID].results[voteIndices[1]]++;
        }
        else {
            //Unknown Error
        }
    }
    else {
        //ERROR - unknown vote type
    }
  }

  //ballotVote format: ItemID,NumberOfElements,Element1,Element2,...
  //                   ie.(1,3,1,3,2)
  //This function takes a submitted ballot and parses and applies the data
  function submitBallot(uint8[] ballotVote) {
    uint i=0;
    uint8 tmpId;
    uint8 numEntries;
    uint32[] tmpVote;
    uint8 numElements = 0;

    //Build vote profile
    while(i < ballotVote.length){
        tmpId = ballotVote[i];

        i++;

        numEntries = ballotVote[i];

        i++;

        for(uint j = 0; j < numEntries; j++) {
            if(tmpVote.length <= numElements) {
                tmpVote.push(ballotVote[i]);

                tmpVote[numElements] = ballotVote[i];

                numElements++;
            }
            else{
                tmpVote[numElements] = ballotVote[i];

                numElements++;
            }

            i++;
        }

        //submit vote
        castVote(tmpId, tmpVote, numElements);
        numElements=0;
    }
  }

  //generates and returns a string with the complete, concatenated, voting results
  //uses the format: ItemID,NumberOfElements,Element1,Element2,...
  //                   ie.(1,3,1,3,2) or 2 of the same results (1,3,1,3,2,1,3,1,3,2)
  function getCompleteBallotResults(uint8[] itemIds) returns (uint32[]) {

      uint32[] outResult = [];
      uint32[] memory tmpResult = [];

      for(uint8 i = 0; i < itemIds.length; i++) {
          outResult.push(itemIds[i]);

          tmpResult = getResultsFor(itemIds[i]);

          outResult.push(uint32(tmpResult.length));

          for(uint8 j = 0; j < tmpResult.length; j++) {
              outResult.push(tmpResult[j]);
          }
      }

      return outResult;
  }

  //returns the raw results for a given ballot item
  function getResultsFor(uint8 ballotID) returns (uint32[]) {
    return ballotItems[ballotID].results;
  }
}
