app.controller('index', function($scope, $state, $stateParams, $ionicActionSheet, $cordovaSms, $cordovaContacts, pouchdb, contactdb) {
	contactdb.get('contact').then(function(result) {
		console.log('sucuess in contact');
	}, function(error) {
		console.log('error in loading contact: ', error);
	});

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
	});

	// get contact details
	$scope.contact = {};
	contactdb.allDocs({
		include_docs: true
	}).then(function(result) {
		$scope.contact = result.rows[0].doc;
		$scope.$apply();
		console.log($scope.contact);
	});

	$scope.sendSms = function() {

		var options = {
			replaceLineBreaks: false, // true to replace \n by a new line, false by default
			android: {
				intent: '' // send SMS with the native android SMS messaging
			}
		};

		$scope.textMessage = 'test message';

		$cordovaSms
			.send($scope.contact.number, $scope.textMessage, options)
			.then(function() {
				alert('Success');
				console.log('Success! SMS was sent');
			}, function(error) {
				alert('Error');
				console.log('An error occurred');
			});
	};
});









app.controller('addPill', function($scope, $state, $stateParams, $ionicActionSheet, $cordovaSms, $cordovaContacts, pouchdb, contactdb) {

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

		// $scope.getFrequency(datetime, freq) | ['every day', 'every second day', 'every third day' ... 'weekly', 'biweekly']
		$scope.getFrequency = function(datetime, freq) {
			var array = [];
			array.push(datetime);
			if (freq = 'every day') {
				array.push(new Date().setDate(datetime.getDate() + 1).toString());
			};
			console.log(array);
		};

		// for medData object to put into $scope.submit
		$scope.new_id = $scope.getId($scope.Medications);

		$scope.medData = {
			_id: $scope.new_id,
			id: $scope.new_id,
			name: null,
			amount: null,
			type: null,
			dateTime: null,
			frequency: $scope.getFrequency(new Date(), 'every day')
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
			}).catch(function(error) {
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









app.controller('editPill', function($scope, $state, $stateParams, $ionicActionSheet, $cordovaSms, $cordovaContacts, pouchdb, contactdb) {
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
					console.log($scope.medData);
					pouchdb.get($scope.medData._id).then(function(doc) {
						return pouchdb.remove(doc);
						console.log('Deleted doc ' + $scope.id);
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









app.controller('contacts', function($scope, $state, $stateParams, $ionicActionSheet, $cordovaSms, $cordovaContacts, pouchdb, contactdb) {

    $scope.$on('$ionicView.enter', function () {
        $scope.chooseContact();
    });

    $scope.chooseContact = function () {
        $cordovaContacts.pickContact().then(function (contactPicked) {
            $scope.contact._id  = 'contact';
            $scope.contact.name = contactPicked.displayName;
            $scope.contact.number = contactPicked.phoneNumbers[0].value;
        });
    }

    $scope.submit = function () {
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
