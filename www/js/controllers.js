app.controller('index', function ($scope, $cordovaCalendar, pouchdb) {
  // get medications from PouchDB
  $scope.Medications = [];
  pouchdb.allDocs({include_docs: true}).then(function (result) {
    for (var i = 0; i < result.rows.length; i++) { // for var in object.rows
      $scope.Medications.push(result.rows[i].doc);
    };
    $scope.$apply();
    console.log($scope.Medications);
  });

});



app.controller('addPill', function ($scope, $stateParams, $cordovaCalendar, pouchdb) {
  // get medications from PouchDB
  $scope.Medications = [];
  pouchdb.allDocs({include_docs: true}).then(function (result) {
    for (var i = 0; i < result.rows.length; i++) { // for var in object.rows
      $scope.Medications.push(result.rows[i].doc);
    };
    $scope.$apply();
    console.log($scope.Medications);

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
      var val = (  Math.max.apply(Math, list) +  1   ).toString();
      return val;
    };

    // for medData object to put into $scope.submit
    $scope.new_id = $scope.getId($scope.Medications);
    // $scope.new_id = '1111';
    $scope.medData = {
      _id: $scope.new_id,
      id: $scope.new_id,
      name: null,
      amount: null,
      type: null,
      dateTime: null
    };

    // to submit a pill
    $scope.submit = function () {
      pouchdb.put(
        $scope.medData
      ).then(function () {
        console.log('PouchDB doc created with _id: ', $scope.medData._id);
      }).catch(function (error) {
        console.log('Error creating PouchDB doc');
        console.log(error);
      });
    };

  }); // NOTE: These braces belong to pouchdb.allDocs({}).then(...)
  // I don't know why this is, just go with it...
});


app.controller('editPill', function ($scope, $stateParams, $cordovaCalendar, pouchdb) {
  // get medications from PouchDB
  $scope.Medications = [];
  pouchdb.allDocs({include_docs: true}).then(function (result) {
    for (var i = 0; i < result.rows.length; i++) { // for var in object.rows
      $scope.Medications.push(result.rows[i].doc);
    };
    $scope.$apply();

    // to open selected medication
    $scope.current_med = $stateParams.id.toString();
    for (var i = 0; i < $scope.Medications.length; i++) {
      if ($scope.Medications[i].id == $scope.current_med) {
        $scope.medData = $scope.Medications[i];
        console.log($scope.medData);
      };
    };

    $scope.submit = function () {
      pouchdb.put(
        $scope.medData
      ).then(function (res) {
        console.log('Updated ', $scope.medData[id], ' doc');
      }, function (error) {
        console.log('Failed updating doc');
        console.log(error);
      });
    };

  }); // NOTE: These braces belong to pouchdb.allDocs({}).then(...)
      // Before all Hell gets loose, just listen to my advice... LEAVE THE BRACES!!!
});
