app.controller('index', function ($scope, Medications) {
  // get medications
  var promise = Medications.getMedications();
  promise.then(function (data) {
    $scope.Medications = data.data;
    console.log($scope.Medications)
  });

});



app.controller('addPill', function ($scope, $stateParams, Medications) {
  // get medications
  var promise = Medications.getMedications();
  promise.then(function (data) {
    $scope.Medications = data.data;
    console.log($scope.Medications)
  });

});


app.controller('editPill', function ($scope, $stateParams, $cordovaFile, Medications) {
  // get medications
  var promise = Medications.getMedications();
  promise.then(function (data) {
    $scope.Medications = data.data;
    console.log($scope.Medications);
  });

  // to get the next id number
  var getCurrent = function () {
    for (var i in $scope.Medications) {
      var current = $scope.Medications[i].id;
      if (current > last) {
        var biggest = current;
      }
      var last = current;
    }
    return parseInt(biggest) + 1;
  }

  // to store new medication
  var medData = {
    id: getCurrent,
    name: "Something else",
    amount: 34,
    datetime: ["%:00pm"],
    frequency: "three hundred times daily",
    type: "supplment"
  };

  $scope.save = function () {
    $scope.Medications.push(medData);
    console.log($scope.Medications);
    $cordovaFile.writeExistingFile(url, 'db.json', "$scope.Medications", true);
  }
});
