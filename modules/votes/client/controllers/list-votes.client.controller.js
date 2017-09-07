(function () {
  'use strict';

  // Votes controller
  angular
    .module('votes')
    .controller('VotesListController', VotesListController);

  VotesListController.$inject = ['$scope', '$state', '$window', 'Authentication', 'voteResolve'];

  function VotesListController ($scope, $state, $window, Authentication, vote) {
    var vm = this;

    vm.authentication = Authentication;
    vm.vote = vote;
    vm.error = null;
    vm.form = {};

    //cmd 2 identifies this as requesting voting data
    vm.vote.cmd = 2;
    vm.vote.data = "1,3,3,1,2,2,2,1,0,3,2,1,3";

    function refresh(){
      console.log("refresh");
      requestVoteData();
    }

    function requestVoteData() {

      // TODO: move create/update logic to service
       if (vm.vote._id) {
         vm.vote.$update(successCallback, errorCallback);
       } else {
         vm.vote.$save(successCallback, errorCallback);
       }

      function successCallback(res) {
          //incoming res var is a stringified json, we need to clean it up
          var result = "";
          var arr = JSON.stringify(res).replace(/:/g, ',').split(",");

          var i=3;
          while(i<arr.length){
            result = result + arr[i] + ',';
            i+=5;
          }

          //remove trailing comma and apostrophes
          result = result.split('"').join('');
          result = result.substring(0, result.length - 1);

          //Turn result data back into array for parsing
          var data = result.split(',');


          var i=0
          while(i<data.length){
            var itemId = data[i];
            i++;
            var numElements = data[i];
            i++;

            switch (itemId) {
              case "1":
                $scope.A1 = data[i];
                i++;
                $scope.A2 = data[i];
                i++;
                $scope.A3 = data[i];
                i++;
                break;
              case "2":
                $scope.B1 = data[i];
                i++;
                $scope.B2 = data[i];
                i++;
                break;
              case "3":
                $scope.C1 = data[i];
                i++;
                $scope.C2 = data[i];
                i++;
                $scope.C3 = data[i];
                i++;
                break;
              default:
            }
          }

          $scope.date = Date();

          $scope.results = result;
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }

    //Submit dummy request form as soon as it is valid
    $scope.$watch('vm.form.voteForm.$valid',function(newValue,oldvalue) {
          if(newValue) {
              requestVoteData();
          }

      });
  }
}());
