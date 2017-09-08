(function () {
  'use strict';

  angular
    .module('votes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('votes', {
        abstract: true,
        url: '/votes',
        template: '<ui-view/>'
      })
      .state('votes.results', {
        url: '',
        templateUrl: 'modules/votes/views/list-votes.client.view.html',
        controller: 'VotesListController',
        controllerAs: 'vm',
        resolve: {
          voteResolve: newVote
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Votes List'
        }
      })
      .state('votes.vote', {
        url: '/create',
        templateUrl: 'modules/votes/views/form-vote.client.view.html',
        controller: 'VotesController',
        controllerAs: 'vm',
        resolve: {
          voteResolve: newVote
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Votes Create'
        }
      })
      .state('votes.edit', {
        url: '/:voteId/edit',
        templateUrl: 'modules/votes/views/form-vote.client.view.html',
        controller: 'VotesController',
        controllerAs: 'vm',
        resolve: {
          voteResolve: getVote
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Vote {{ voteResolve.name }}'
        }
      })
      .state('votes.view', {
        url: '/:voteId',
        templateUrl: 'modules/votes/views/view-vote.client.view.html',
        controller: 'VotesController',
        controllerAs: 'vm',
        resolve: {
          voteResolve: getVote
        },
        data: {
          pageTitle: 'Vote {{ voteResolve.name }}'
        },
        css: ['public/lib/chartist/dist/chartist.min.css']
      });
  }

  getVote.$inject = ['$stateParams', 'VotesService'];

  function getVote($stateParams, VotesService) {
    return VotesService.get({
      voteId: $stateParams.voteId
    }).$promise;
  }

  newVote.$inject = ['VotesService'];

  function newVote(VotesService) {
    return new VotesService();
  }
}());
