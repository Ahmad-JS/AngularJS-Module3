(function () {
    'use strict';
  
    angular.module('NarrowItDownApp', [])
      .controller('NarrowItDownController', NarrowItDownController)
      .service('MenuSearchService', MenuSearchService)
      .directive('foundItems', FoundItemsDirective);
  
    function FoundItemsDirective() {
      let ddo = {
        scope: {
          titles: "<",
          found: "<",
          remove: "&"
        },
        templateUrl: "foundItems.html",
        controller: FoundItemsDirectiveController,
        controllerAs: "founds",
        bindToController: true
      };
      return ddo;
    }
  
    function FoundItemsDirectiveController() {
      let founds = this;
      founds.isDataComing = function () {
        return founds.found.length > 0;
      };
    }
  
    NarrowItDownController.$inject = ['MenuSearchService'];
    function NarrowItDownController(MenuSearchService) {
      let narrow = this;
      narrow.found = [];
      narrow.titles = {
        name: "NAME",
        description: "DESCRIPTION",
        short_name: "SHORT NAME"
      };
  
      narrow.removeMenuItem = function (index) {
        MenuSearchService.removeItem(index);
      };
  
      narrow.getItems = function (searchMenu) {
        let promise = MenuSearchService.getMatchedMenuItems(searchMenu);
        promise.then(function (items) {
          narrow.found = items;
          narrow.searched = narrow.found.length === 0;
        }).catch(function (error) {
          console.log(error);
        });
      };
    }
  
    MenuSearchService.$inject = ['$http'];
    function MenuSearchService($http) {
      let menu = this;
      menu.items = [];
  
      menu.getMatchedMenuItems = function (searchMenu) {
        return $http({
          method: "GET",
          url: "https://coursera-jhu-default-rtdb.firebaseio.com/menu_items.json",
          params: {}
        }).then(function (result) {
          menu.items = getMatchedItems(searchMenu, result);
          return menu.items;
        });
      };
  
      menu.removeItem = function (index) {
        menu.items.splice(index, 1);
    };

    function getMatchedItems(searchMenu, result) {
      let resultItems = [];
      if (!searchMenu) {
        return resultItems;
      }
      for (let item in result.data) {
        let items = result.data[item]['menu_items'];
        for (let i = 0; i < items.length; i++) {
          if (items[i].description.toLowerCase().indexOf(searchMenu.toLowerCase()) !== -1) {
            resultItems.push(items[i]);
          }
        }
      }
      return resultItems;
    }
  }
})();
