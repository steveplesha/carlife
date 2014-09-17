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
            mileage: 90000
        },
        {
            name: "Grand Caravan",
            type: "Van",
            mileage: 40000
        }];
})();
