app.controller('addPill', function($scope, $state, $stateParams, $ionicActionSheet, $cordovaSms, $cordovaContacts, $cordovaLocalNotification, pouchdb, contactdb) {

  // get medications from PouchDB
  $scope.Medications = [];
  pouchdb.allDocs({
    include_docs: true
  }).then(function(result) {

    for (var i = 0; i < result.rows.length; i++) { // for var in object.rows
      $scope.Medications.push(result.rows[i].doc);
    };
    $scope.$apply();
    console.log($scope.Medications);

    // to add Date and time together to create a single dateTime
    $scope.combineDateAndTime = function(date, time) {
      timeString = time.getHours() + ':' + time.getMinutes() + ':00';

      var year = date.getFullYear();
      var month = date.getMonth() + 1; // Jan is 0, dec is 11
      var day = date.getDate();
      var dateString = '' + year + '-' + month + '-' + day;
      var combined = new Date(dateString + ' ' + timeString);

      return combined;
    };






    // set notifcations function
    $scope.setLocalNotification = function(data) {
      $cordovaLocalNotification.schedule({
        id: data.id,
        nameOfMed: data.name,
        text: $scope.localMessage(data),
        firstAt: $scope.combineDateAndTime(data.date, data.time),
        every: data.repeat
      });
    };

    $scope.localMessage = function(data) {
        var medication = data.name;
        var amount = data.amount;
        var frequency = data.repeat;
        var type = data.type;

        message = 'You\'re daily reminder that Jack is sexy.';
        return message;
    };






    // $scope.getId([array of objects])
    $scope.getId = function(array) {
      var list = [];
      if (array.length == 0) {
        list.push(parseInt(1110));
      } else {
        for (var i = 0; i < array.length; i++) {
          list.push(parseInt(array[i]._id));
        };
      }
      var val = (Math.max.apply(Math, list) + 1).toString();
      return val;
    };

    // for medData object to put into $scope.submit
    $scope.new_id = $scope.getId($scope.Medications);

    $scope.medData = {
      _id: $scope.new_id,
      id: $scope.new_id,
      name: null,
      amount: null,
      type: null,
      date: null,
      time: null,
      repeat: null
    };

    // to submit a pill
    $scope.submit = function() {
      pouchdb.put(
        $scope.medData
      ).then(function() {
        console.log('PouchDB doc created with _id: ', $scope.medData._id);
        $state.go('app', {}, {
          reload: true
        });
        $scope.setLocalNotification($scope.medData);
      }, function(error) {
        console.log('Error creating PouchDB doc');
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

  }); // NOTE: These braces belong to pouchdb.allDocs({}).then(...)
  // I don't know why this is, just go with it...
});
