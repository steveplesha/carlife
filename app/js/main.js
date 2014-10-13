(function() {
    var app = angular.module('myApp', ['firebase']);
    var myDataRef = new Firebase('https://burning-heat-392.firebaseio.com');
    var carRef = myDataRef.child('vehicles');
    

    
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



    /*    

    carRef.push({
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
        });
  */  
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
})();
