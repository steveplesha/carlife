(function() {
    var app = angular.module('myApp', ['firebase']);
    var myDataRef = new Firebase('https://burning-heat-392.firebaseio.com');
    var carRef = myDataRef.child('vehicles');
    var loginref = new Firebase("https://burning-heat-392.firebaseio.com");    

    
    app.controller("CarController", ["$scope", function($scope) {
        this.cars = vehicle;
        
        $scope.addCar = function() {
            $scope.makeModel = $('#vehicleInput').val();
            $scope.cartype = $('#vehicleTypeInput').val();
            $scope.mileage = $('#mileageInput').val();

            carRef.push({
                name: $scope.makeModel,
                type: $scope.cartype,
                mileage: $scope.mileage
            });
            alert("clicked");
            $scope.addCarForm.$setPristine();
        };
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


    loginref.onAuth(function(authData) {
        if (authData) {
            console.log("User ID: " + authData.uid + ", Provider: " + authData.provider);
        } else {
			console.log("No go");
        }
    });      
	  
    function googleLogin() {
        loginref.authWithOAuthPopup("google", function(err, authData) {
            if (authData) {
            // the access token will allow us to make Open Graph API calls
            console.log(authData.facebook.accessToken);
          }
        }, {
          scope: "email" // the permissions requested
        });
    };

})();
