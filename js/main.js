(function() {
    var app = angular.module('myApp', []);
    
/*    app.directive('vehicleInfo', function(){
        return {
            restrict: 'E',
            templateUrl: 'car-info.html'
        };
    });
*/    
    app.controller('CarController', ['$http', function($http){
        this.cars = vehicle;
        /*var motor= this;
        motor.cars = [];
        $http.get('/car.json').success(function(data){
            motor.cars = data;
        }); */
    }]);
    
    var vehicle = [
        {
            name: 'Corolla',
            type: "Sedan",
            mileage: 90000,
            picture: '/img/2006ToyotaCorolla.jpg',
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
            picture: '/img/2012GrandCaravan.jpg'
        }];
})();
