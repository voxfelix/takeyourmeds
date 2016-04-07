var app = angular.module('starter', ['ionic', 'ngCordova', 'ui.router', 'ion-datetime-picker']);

app.run(function($ionicPlatform, $rootScope, $http, $rootScope) {
	$ionicPlatform.ready(function() {
		if (window.cordova && window.cordova.plugins.Keyboard) {

			cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

			// Don't remove this line unless you know what you are doing. It stops the viewport
			// from snapping when text inputs are focused. Ionic handles this internally for
			// a much nicer keyboard experience.
			cordova.plugins.Keyboard.disableScroll(true);
		}
		if (window.StatusBar) {
			StatusBar.styleDefault();
		}

        $rootScope.$on('$cordovaLocalNotification:trigger', function(event, notification, state) {
            // send sms message
        	$scope.sendSms = function() {
        		var options = {
        			replaceLineBreaks: false, // true to replace \n by a new line, false by default
        			android: {
        				intent: '' // send SMS with the native android SMS messaging
        			}
        		};

                $rootScope.textMessage = notification.nameOfMed + ', is scheduled to be taken now.';

        		$cordovaSms
        			.send($rootScope.contact.number, $rootScope.textMessage, options)
        			.then(function() {
        				console.log('Success');
        			}, function(error) {
        				console.log('Error');
        			});
        	};
        });
	});
});

app.config(function($stateProvider, $urlRouterProvider) {
	$urlRouterProvider.otherwise('/');

	$stateProvider
	// for main page
		.state('app', {
			cache: false,
			url: '/',
			templateUrl: 'templates/home.html',
			controller: 'index'
		})
		// for addPill view
		.state('addPill', {
			cache: false,
			url: '/addPill',
			templateUrl: 'templates/addPill.html',
			controller: 'addPill',
		})
		// for editPill view
		.state('editPill', {
			cache: false,
			url: '/editPill/:id',
			templateUrl: 'templates/editPill.html',
			controller: 'editPill',
		})
		// for contact
		.state('contacts', {
			cache: false,
			url: '/contacts',
			templateUrl: 'templates/contacts.html',
			controller: 'contacts',
		})

});


// for the noSQL db - medications
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

// for the noSQL db - contact
app.factory('contactdb', function() {
	return new PouchDB('contactdb'); // to use the DB

	/* Uncomment these lines to delete DB
	db = new PouchDB('appDB');
	db.destroy().then(function (){
	  console.log('db destroyed');
	}, function(){
	  console.log('error destroying db');
	});
	*/

});
