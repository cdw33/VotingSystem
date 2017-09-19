(function () {
  'use strict';

  angular
    .module('votes')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(menuService) {
    // Set top bar menu items
    menuService.addSubMenuItem('topbar', 'admin', {
      title: 'Create New Ballot',
      state: 'admin.ballot'
    });
  }
}());