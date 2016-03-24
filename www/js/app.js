var app = angular.module('starter', ['ionic', 'ngCordova', 'ui.router']);

app.run(function($ionicPlatform, $rootScope, $http) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {

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
    // for contact
    .state('contact', {
      url: '/contact',
      templateUrl: 'templates/contact.html',
      controller: 'editPill',
    })

});


// for the noSQL db
app.factory('pouchdb', function() {
  return new PouchDB('appDB'); // to use the DB

  /* Uncomment these lines to delete DB
  db = new PouchDB('appDB');
  db.destroy().then(function (){
    console.log('db destroyed');
  }, function(){
    console.log('error destroying db');
  });
  */

});
