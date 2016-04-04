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
      // keep a copy of the array (to be able to modify it as needed
      // without affecting others)
      $scope.photos = photos.slice(0);
    });
  });

  $scope.takePhoto = function() {
    // for now always upload the same photo from a local file
    // we'll add photos from the actual camera later
    uploadNewPhoto('img/ionic.png');
  };

  function uploadNewPhoto(url) {
    var date = new Date(); // now

    // do some formatting to make an OK default name for the new photo
    // 2011-10-05T14:48:00.000Z -> 2011.10.05 at 14.48.00
    var title = date.toISOString();
    title = title.slice(0, 10).replace(/\-/g, ".") + ' at '
      + title.slice(11, 19).replace(/:/g, ".");

    var photo = {
      id: date.getTime().toString(), // time with milliseconds should be unique enough
      title: title,
      date: date,
      thumbnail_url: url
    };

    // Adding the new photo object to the $scope makes it immediately visible
    // on the screen. Calling the PhotoLibraryService.addPhoto() initiates
    // actual uploading to the server which normally takes some time (and may fail).
    $scope.photos.push(photo);
    PhotoLibraryService.addPhoto(photo);
  }
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
