(function () {
  'use strict';

  angular
    .module('votes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('admin.ballot', {
        url: '',
        templateUrl: 'modules/votes/views/admin/ballot-add.client.view.html',
        controller: 'BallotAddController',
        controllerAs: 'vm'
      });
  }
}());
