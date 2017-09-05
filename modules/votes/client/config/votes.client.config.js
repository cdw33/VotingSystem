(function () {
  'use strict';

  angular
    .module('votes')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(menuService) {
    // Set top bar menu items
    menuService.addMenuItem('topbar', {
      title: 'Vote Now!',
      state: 'votes.vote',
      roles: ['user'],
      isPublic: false
    });  
      
    menuService.addMenuItem('topbar', {
      title: 'Live Results',
      state: 'votes.results',
      roles: ['*'],
      class: "live",
      isPublic: true    
    });   

   /* // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'votes', {
      title: 'List Votes',
      state: 'votes.list'
    });

    // Add the dropdown create item
    menuService.addSubMenuItem('topbar', 'votes', {
      title: 'Create Vote',
      state: 'votes.create',
      roles: ['user']
    });*/
  }
}());
