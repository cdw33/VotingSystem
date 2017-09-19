(function () {
  'use strict';

  // Votes controller
  angular
    .module('votes')
    .controller('BallotAddController', BallotAddController);

  BallotAddController.$inject = ['$scope', '$state', '$window', 'Authentication'];

  function BallotAddController ($scope, $state, $window, Authentication) {
    var vm = this;

    vm.authentication = Authentication;
    vm.error = null;
    vm.form = {};

    $scope.add = function() {
        var f = document.getElementById('file').files[0],
            r = new FileReader();

        r.onloadend = function(e) {
          var data = e.target.result;
          generateSample(data);
          // console.log(JSON.parse(data));
        }

        r.readAsText(f);
    }

    function generateSample(data){
        // var jsonData = JSON.parse(data);
        // console.log(jsonData);
        // $scope.sample = createBallotItem(JSON.parse(data));
// $scope.myText = "My name is: <h1>John Doe</h1>";


        // var app = angular.module("votes", ['ngSanitize']);
        // app.controller("BallotAddController", function($scope) {
        //     $scope.myText = "My name is: <h1>John Doe</h1>";
        // });

       

        // html filter (render text as html)
        // $sce.trustAsHtml('<h1>John Doe</h1>');

        document.getElementById('example').innerHTML = createBallotItem(JSON.parse(data));


        $scope.$apply();
    }

    function createBallotItem(data){

        var ballot = "";

        var title = data[0].title;
        var subtitle = data[0].subTitle;
        var instructions = data[0].instructions;

        var tableHeaders = data[0].tableHeaders;
        var tableData = data[0].tableData;
        var numItems = data[0].numberOfItems;

        ballot += createBallotItemHeader(title, subtitle, instructions);

        ballot += createBallotItemTable(tableHeaders, tableData, numItems);    

        return ballot;
    }

    function createBallotItemHeader(title, subtitle, instructions){
        var header = '<h3>' + title + '</h3>'+
                     '<h4>' + subtitle + '</h4>'+
                     '<h4>' + instructions + '</h4>' +
                     '<hr>';

          return header;
    }

    function createBallotItemTable(tableHeaders, tableData, numItems){

        var table = "";

        var len = tableHeaders.length;

        table += '<table class="table table-sm" style="width:50%;">'+
                 '<thead class="thead-inverse">'+
                 '<tr>';
       
        for(var i=0; i<len; i++){
            table += '<th>' + tableHeaders[i] + '</th>';
        }

        table += '</tr>';

        for(i=0; i<numItems; i++){
            var id = 'A' + (i+1);

            table += '<tr>'+
                     '<td>'+
                     '<select name="' + id + '" id="' + id + '" ng-model="vm.vote.' + id + '">';

            for(var j=1; j<= numItems; j++){
                table += '<option value="' + j + '">' + j + '</option>';
            }

            table += '</select>'+
                     '</td>'+
                     '<td>' + tableData[i].candidate + '</td>'+
                     '<td>' + tableData[i].affiliation + '</td>'+
                     '</tr>';
            
        }

        table += '</table>';

        return table;
    }

    

    

    
  }
}());
