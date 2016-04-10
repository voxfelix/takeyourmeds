app.controller('index', function ($rootScope, $scope, $state, $stateParams, $ionicActionSheet, $cordovaSms, $cordovaContacts, $cordovaLocalNotification, pouchdb, contactdb) {
  // get contact info
  contactdb.get('contact').then(function (result) {
    console.log('success in contact');
  }, function (error) {
    console.log('error in loading contact: ', error);
  });

  // get medications from PouchDB
  $scope.Medications = [];
  pouchdb.allDocs({include_docs: true}).then(function (result) {
    for (var i = 0; i < result.rows.length; i++) { // for var in object.rows
      $scope.Medications.push(result.rows[i].doc);
    };

    $scope.$apply();
    console.log($scope.Medications);
  });

  // get contact details
  $scope.contact = {};
  contactdb.allDocs({include_docs: true}).then(function (result) {
    $scope.contact = result.rows[0].doc;
    $scope.$apply();
    console.log($scope.contact);
  });

  $scope.sendSms = function (notification) {

    var options = {
      replaceLineBreaks: false, // true to replace \n by a new line, false by default
      android: {
        intent: '' // send SMS with the native android SMS messaging
      }
    };

    $scope.textMessage = 'You sexy beast, Jack!';

    $cordovaSms.send($scope.contact.number, $scope.textMessage, options).then(function () {
      alert('Success! SMS was sent');
    }, function (error) {
      alert('An error occurred in SMS');
    });
  };


  $rootScope.$on('$cordovaLocalNotification:trigger', function(event, notification, state) {
      $scope.sendSms(notification);
  });

});