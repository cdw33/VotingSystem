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
      isPublic: true
    });

    menuService.addMenuItem('topbar', {
      title: 'Live Results',
      state: 'votes.results',
      roles: ['user'],
      class: "live",
      isPublic: true
    });
  }
}());
