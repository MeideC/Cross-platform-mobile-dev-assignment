// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'ngCordova' is needed for utilizing camera functionality. Don't forget to define it in bower.json and index.html
var photoList;

angular.module('photoApp', ['ionic', 'photoApp.services', 'ngCordova'])

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

/*
.run(function ($cordovaCamera) {
  $cordovaCamera.imageData = 'img/ionic.png';
})
*/

.config(function($stateProvider, $urlRouterProvider,
                 PhotoLibraryServiceProvider) {
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
  })
  .state('fullscreenphoto', {
    url: '/photo/:photoid',
    templateUrl: 'templates/fullscreenphoto.html',
    controller: 'FullScreenPhotoCtrl'
  });

  var config = {
    bucket: 'cpmd-photo-library',
    website_url: 'http://cpmd-photo-library.s3-website.eu-central-1.amazonaws.com/',
    awsconfig: {
      accessKeyId: 'AKIAJSJHNFR5QOGSGVVA',
      secretAccessKey: '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',
      region: 'eu-central-1',
      apiVersions: {
        s3: '2006-03-01',
        dynamodb: '2012-08-10'
      }
    }
  };
  PhotoLibraryServiceProvider.setConfig(config);
})

  // inject cordova camera plugin
.controller('PhotosCtrl', function ($scope, $cordovaCamera, PhotoLibraryService, ImageService) {
  $scope.refreshPhotoList = function() {
    PhotoLibraryService.getPhotos()
      .then(function onSuccess(photos) {
        $scope.photos = photos.slice(0);
        photoList = photos.slice(0);
      })
      .catch(function onError(error) {
        console.log("PhotoLibrary.getPhotos() ERROR: " + error.message);
      })
      .finally(function() {
        // Stop the ion-refresher from spinning
        $scope.$broadcast('scroll.refreshComplete');
      });
  };

  $scope.$on('$ionicView.beforeEnter', function beforeEnter() {
    // Ionic caches views and this controller will not be recreated upon
    // state re-entry. That means, the code in the outer function will not
    // be executed when re-entering this state after deleting a photo.
    // However, until the list of photos is refreshed from the PhotoLibraryService
    // we will not see that a photo is deleted.
    //
    // That's why it's necessary to subscribe to the '$ionicView.beforeEnter'
    // event and refresh the list manually.
    $scope.refreshPhotoList();
  });

  $scope.takePhoto = function () {

    // define options for $cordovaCamera plugin
    var options = {
      quality: 75,
      destinationType: Camera.DestinationType.FILE_URI,
      sourceType: Camera.PictureSourceType.CAMERA,
      allowEdit: true,
      encodingType: Camera.EncodingType.JPEG,
      targetWidth: 750,
      targetHeight: 750,
      saveToPhotoAlbum: false
    };

    // if photo is successfully made, then save its URI
    $cordovaCamera.getPicture(options).then(function (imageData) {
      uploadNewPhoto(imageData);
    }, function (err) {
      // An error occured. Show a message to the user
    });
  };

  function uploadNewPhoto(url) {
    var newPhoto = PhotoLibraryService.newPhoto();
    newPhoto.url = url;
    newPhoto.thumbnail_url = url;
    newPhoto.progress = 0;

    $scope.photos.push(newPhoto);
    ImageService.getBlobFromImageUrl(url, 750)
      .then(function onSuccess(blob) {
        newPhoto.blob = blob;
        return PhotoLibraryService.addPhoto(newPhoto);
      })
      .then(function onSuccess(photo) {
        console.log("PhotoLibrary.addPhoto() OK: url = " + photo.url);
        newPhoto.url = photo.url;
        newPhoto.thumbnail_url = photo.thumbnail_url;
        delete newPhoto.blob;
        delete newPhoto.progress;
        delete newPhoto.error;
      }, function onError(error) {
        newPhoto.error = error.message;
        console.log("PhotoLibrary.addPhoto() ERROR: " + error.message);
      }, function onNotify(progress) {
        newPhoto.progress = Math.round(progress.loaded / progress.total * 100);
        console.log("PhotoLibrary.addPhoto() " + newPhoto.progress + "% done");
      });
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
  };
})

.controller('FullScreenPhotoCtrl', function($scope, $state, $stateParams, PhotoLibraryService, $ionicSlideBoxDelegate, $ionicModal) {
  var photoId = $stateParams.photoid;
  $scope.photos = photoList;
  for (var i = 0; i < photoList.length; i++) {
    if (photoList[i].id == photoId) {
      // Choose the right slide to  open based on it's index.
      $scope.firstSlide = i;
      break;
    }
  }
  console.log("photosList : " + photoList);
  //$scope.firstSlide = 3;
  //console.log("firstslide: " + $scope.firstSlide);

  $ionicModal.fromTemplateUrl('templates/fullscreen-modal.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modal = modal;
  });

  $scope.deletePhoto = function() {
    console.log("deleted photo");
    PhotoLibraryService.deletePhoto(photoId);
    $state.go('photos');
  };

  $scope.openModal = function() {
    console.log("Opening modal...");
    $scope.modal.show();
  };

  $scope.closeModal = function() {
    console.log("Closing modal.");
    $scope.modal.hide();
  };


  $scope.slideHasChanged = function(index) {
    console.log("slide changed and the index is: " + index);
    photoId = $scope.photos[index].id;
    $ionicSlideBoxDelegate.update();
  };
});
