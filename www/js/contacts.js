app.controller('contacts', function($scope, $state, $stateParams, $ionicActionSheet, $cordovaSms, $cordovaContacts, $cordovaLocalNotification, pouchdb, contactdb) {

  $scope.$on('$ionicView.enter', function() {
    $scope.chooseContact();
  });

  $scope.chooseContact = function() {
    $cordovaContacts.pickContact().then(function(contactPicked) {
      $scope.contact._id = 'contact';
      $scope.contact.name = contactPicked.displayName;
      $scope.contact.number = contactPicked.phoneNumbers[0].value;
    });
  }

  $scope.submit = function() {
    contactdb.put(
      $scope.contact
    ).then(function(res) {
      console.log('Added contact');
      $state.go('app', {}, {
        reload: true
      });
    }, function(error) {
      console.log('Failed to add contact');
      console.log(error);
      $state.go('app', {}, {
        reload: true
      });
    });
  };

  $scope.back = function() {
    $state.go('app', {}, {
      reload: true
    });
  };
});
