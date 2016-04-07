app.controller('editPill', function($scope, $state, $stateParams, $ionicActionSheet, $cordovaSms, $cordovaContacts, $cordovaLocalNotification, pouchdb, contactdb) {
  // get medications from PouchDB
  $scope.Medications = [];
  pouchdb.allDocs({
    include_docs: true
  }).then(function(result) {
    for (var i = 0; i < result.rows.length; i++) { // for var in object.rows
      $scope.Medications.push(result.rows[i].doc);
    };
    $scope.$apply();

    // to open selected medication
    $scope.current_med = $stateParams.id.toString();
    for (var i = 0; i < $scope.Medications.length; i++) {
      if ($scope.Medications[i].id == $scope.current_med) {
        $scope.medData = $scope.Medications[i];
        console.log($scope.medData._id);
        $scope.id = $scope.medData.id;
      };
    };

    $scope.submit = function() {
      pouchdb.put(
        $scope.medData
      ).then(function(res) {
        console.log('Updated ', $scope.medData.id, ' doc');
        $state.go('app', {}, {
          reload: true
        });
      }, function(error) {
        console.log('Failed updating doc');
        console.log(error);
        $state.go('app', {}, {
          reload: true
        });
      });
    };

    // Show the action sheet
    $scope.showActionSheet = function() {
      var hideSheet = $ionicActionSheet.show({

        buttons: [],
        destructiveText: 'Delete',
        cancelText: 'Cancel',
        destructiveButtonClicked: function() {
          console.log('deleting ', $scope.medData);
          pouchdb.get($scope.medData._id).then(function(doc) {
            return pouchdb.remove(doc);
            console.log('Deleted doc ' + $scope.id);
            $state.go('app', {}, {
              reload: true
            });
          });
        },
        buttonClicked: function(index) {
          return true;
        }

      });
    };

  }); // NOTE: These braces belong to pouchdb.allDocs({}).then(...)
  // Before all Hell gets loose, just listen to my advice... LEAVE THE BRACES!!!
});
