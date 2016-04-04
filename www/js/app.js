// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('photoApp', ['ionic', 'photoApp.services'])

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

.controller('PhotosCtrl', function ($scope, PhotoLibraryService) {
  $scope.$on('$ionicView.beforeEnter', function beforeEnter() {
    // Ionic caches views and this controller will not be recreated upon
    // state re-entry. That means, the code in the outer function will not
    // be executed when re-entering this state after deleting a photo.
    // However, until the list of photos is refreshed from the PhotoLibraryService
    // we will not see that a photo is deleted.
    //
    // That's why it's necessary to subscribe to the '$ionicView.beforeEnter'
    // event and refresh the list manually.
    PhotoLibraryService.getPhotos().then(function(photos) {
      $scope.photos = photos;
    });
  });
})

.controller('PhotoCtrl', function($scope, $state, PhotoLibraryService) {
  var photoId = $state.params.photoid;
  PhotoLibraryService.getPhoto(photoId).then(function(photo) {
    $scope.photo = photo;
  });

  $scope.deletePhoto = function() {
    PhotoLibraryService.deletePhoto(photoId);
    $state.go('photos');
  }
});
