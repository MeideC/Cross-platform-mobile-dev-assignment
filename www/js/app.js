// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('photoApp', ['ionic'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise('/');

  $stateProvider.state('photos', {
    url: '/',
    templateUrl: 'templates/photos.html',
    controller: 'PhotosCtrl'
  })
  .state('photo', {
    url: '/photo/:photoid',
    templateUrl: 'templates/photo.html',
    controller: 'PhotoCtrl'
  });
})

.controller('PhotosCtrl', function ($scope, $http) {
  $http.get('data/photos.json').success(function (data) {
    $scope.photos = data;
  });
})

.controller('PhotoCtrl', function($scope, $http, $filter, $stateParams) {
  var photoid = $stateParams.photoid;
  $http.get('data/photos.json').success(function (data) {
    $scope.photo = $filter('filter')(data, { id: photoid })[0];
  });
});
