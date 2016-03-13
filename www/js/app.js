// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var app = angular.module('starter', ['ionic', 'ngCordova', 'ngStorage', 'ui.router']);
var db = null;

app.run(function($ionicPlatform, $cordovaSQLite, $rootScope, $http) {
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
});

app.config(function ($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise('/');

  $stateProvider
    // for main page
    .state('app', {
      url: '/',
      templateUrl: 'templates/home.html',
      controller: 'index'
    })
    // for addPill view
    .state('addPill', {
      url: '/addPill',
      templateUrl: 'templates/addPill.html',
      controller: 'addPill',
    })
    // for editPill view
    .state('editPill', {
      url: '/editPill/:id',
      templateUrl: 'templates/editPill.html',
      controller: 'editPill',
    })

});


app.service('Medications', function ($http, $q){
  var defferer = $q.defer();
  $http.get('db.json').then(function (data) {
    defferer.resolve(data);
  });

  this.getMedications = function () {
    return defferer.promise;
  }

});
