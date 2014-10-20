(function () {

    
    var app = angular.module('myApp', ['firebase']);
    var myDataRef = new Firebase('https://burning-heat-392.firebaseio.com/');
    var userRef = myDataRef.child('users');
    var carRef = userRef.child('vehicles');   
    
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
    
    app.controller('LoginController', ['$scope', 'simpleLogin', '$location', function($scope, $simpleLogin, $location) {
            
        
            $scope.register = function() {
                $scope.err = null;
                alert("user: " + $scope.email + " / pw: " + $scope.password);

                if( assertValidAccountProps() ) {
                    simpleLogin.createAccount( $scope.email, $scope.password )
                    .then(function(/* user */){
                        $location.path('/users');
                    }, function(err) {
                        $scope.err = errMessage(err);
                    });
                }
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
    




}())
