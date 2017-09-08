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
    vm.vote.data = "";

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

          //First 2 elements are garbage data from somewhere,
          //hopefully this gets removed when I figure out where..
          if(data[1] == 0){
            data = data.slice(2,data.length);
          }

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
              case "4":
                $scope.D1 = data[i];
                i++;
                $scope.D2 = data[i];
                i++;
                $scope.D3 = data[i];
                i++;
                break;
              default:
            }
          }

          buildPieChart();

          $scope.date = Date();
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }

    function buildPieChart(){
      var data1 = {
        labels: ['Reese & Cherry', 'Choco & Carmela', 'Magic & Phish'],
        series: [$scope.A1, $scope.A2, $scope.A3]
      };

      var data2 = {
        labels: ['Yes', 'No'],
        series: [$scope.B1, $scope.B2]
      };

      var data3 = {
        labels: ['P. Nut Butter', 'Cream C. Kol', 'Marsh Mallow'],
        series: [$scope.C1, $scope.C2, $scope.C2]
      };

      var data4 = {
        labels: ['Yes', 'No'],
        series: [$scope.D1, $scope.D2]
      };

      var options = {
        labelInterpolationFnc: function(value) {
          return value[0];
        }
      };

      var responsiveOptions = [
        ['screen and (min-width: 640px)', {
          chartPadding: 30,
          labelOffset: 100,
          labelDirection: 'explode',
          labelInterpolationFnc: function(value) {
            return value;
          }
        }],
        ['screen and (min-width: 1024px)', {
          labelOffset: 0,
          chartPadding: 40
        }]
      ];

      new Chartist.Pie('#pie-chart-1', data1, options, responsiveOptions);

      new Chartist.Pie('#pie-chart-2', data2, options, responsiveOptions);
      new Chartist.Pie('#pie-chart-3', data3, options, responsiveOptions);
      new Chartist.Pie('#pie-chart-4', data4, options, responsiveOptions);
    }

    //Submit dummy request form as soon as it is valid
    $scope.$watch('vm.form.voteForm.$valid',function(newValue,oldvalue) {
          if(newValue) {
              requestVoteData();
          }

      });
  }
}());
