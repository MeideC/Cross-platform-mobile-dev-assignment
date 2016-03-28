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

.controller('PhotosCtrl', function ($scope) {
  $scope.photos = [
    {
      "date": "05/08/2000",
      "carrier": "Elisa",
      "id": "motorola",
      "thumbnail_url": "img/motorola.jpg",
      "title": "Motorola\u2122 Rarz"
    },
    {
      "date": "05/06/1767",
      "carrier": "DNA",
      "id": "nexus",
      "thumbnail_url": "img/nexus6.png",
      "title": "Google Nexus\u2122 6"
    },
    {
      "date": "08/01/2020",
      "carrier": "AT&T",
      "id": "iPhone",
      "thumbnail_url": "img/iphone.jpg",
      "title": "Apple iPhone\u2122 SE"
    },
    {
      "date": "05/01/1999",
      "carrier": "Vodafone",
      "id": "Nokia",
      "thumbnail_url": "img/nokia.jpg",
      "title": "Nokia\u2122 forever!"
    },
    {
      "date": "20/01/1996",
      "carrier": "AT&T",
      "id": "Samsung",
      "thumbnail_url": "img/samsung.jpg",
      "title": "Samsung\u2122 Galaxy s7"
    },
    {
      "date": "05/08/1867",
      "carrier": "Tele",
      "id": "Dell",
      "thumbnail_url": "img/dell.jpeg",
      "title": "Dell\u2122 Venue"
    }
  ];
})
