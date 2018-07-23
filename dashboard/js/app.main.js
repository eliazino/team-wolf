'use strict';

var App = angular
  .module('app')
  .controller('AppCtrl', ['$scope', '$http', '$location', '$window',
        function AppCtrl($scope, $http, $location, $window) {
          try{
            $scope.user = JSON.parse(localStorage.getItem('pd'));
            $scope.hospital = JSON.parse(localStorage.getItem('hd'));
          }catch(e){

          }
      var route = $location.path();
      if(localStorage.getItem("pd")){
          if(route == '/signin' || route == '/register') $location.path('/dashboard');
      }
    }
]);
