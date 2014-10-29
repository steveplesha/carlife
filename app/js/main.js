(function () {

    
    var app = angular.module('myApp', ['firebase']);
    var myDataRef = new Firebase('https://burning-heat-392.firebaseio.com');
    
    app.controller("MainController", ["$scope", function($scope) {
        
        $scope.addCar = function() {
            $scope.makeModel = $('#vehicleInput').val();
            $scope.cartype = $('#vehicleTypeInput').val();
            $scope.mileage = $('#mileageInput').val();
            var authData = myDataRef.getAuth();

            myDataRef.child('users').child(authData.uid).child('vehicles').push({
                name: $scope.makeModel,
                type: $scope.cartype,
                mileage: $scope.mileage
            });
            alert("clicked");
        };

        $scope.register = function() {
            $scope.email = $('#emailRegister').val();
            $scope.password = $('#passwordInput').val();
            alert("user: " + $scope.email + " / pw: " + $scope.password);
            
            myDataRef.createUser({
                email    : $scope.email,
                password : $scope.password
            }, function(error) {
                if (error === null) {
                    console.log("user created successfully");
                    alert("User Created Successfully");           
                } else { 
                    console.log("error creating user:", error);
                    alert("Error creating user: ", error);
                }
            });
        }; 
        
        $scope.login = function () {
            $scope.email = $('#loginEmail').val();
            $scope.password = $('#loginPassword').val();
            myDataRef.authWithPassword({
                email    : $scope.email,
                password : $scope.password
            }, function (error, authData) {
                if (error === null) {
                    alert("user id: " + authData.uid + ", Provider: " + authData.provider);
                    vehicleRef = myDataRef.child('users').child(authData.uid).child('vehicles');
                    vehicleRef.set(authData);
                    vehicleRef.once('value', function(dataSnapshot) {
                        this.cars = dataSnapshot;
                    });
                } else {
                    alert("Error authenticating: ", error);
                }
            });
        };
        
        $scope.logout = function() {
            myDataRef.unauth();
            alert("You are logged out");
        };
        
        myDataRef.onAuth(function(authData) {
            if (authData) {
                $('.loginState').html("Logged In");
            } else {
                $('.loginState').html("Logged Out");
            }
        });
        
    }]);
            
            
            
	var vehicle = [
	{
		name: 'Corolla',
		type: "Sedan",
		mileage: 90000,
		picture: 'app/img/2006ToyotaCorolla.jpg',
		repairs: [
			{
				workDone: "Oil Change",
				cost: 35,
				shop: "Duke of Oil"
			}
		]
	},
	{
		name: "Grand Caravan",
		type: "Van",
		mileage: 40000,
		picture: 'app/img/2012GrandCaravan.jpg'
	}];
    




}())
