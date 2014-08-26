(function() {
    var app = angular.module('myApp', []);
    
/*    app.directive('vehicleInfo', function(){
        return {
            restrict: 'E',
            templateUrl: 'car-info.html'
        };
    });
*/    
    app.controller('CarController', function(){
        this.cars = vehicle;
    });
    
    var vehicle = [
        {
            name: 'Corolla',
            type: "sedan",
            mileage: 90000
        },
        {
            name: "Grand Caravan",
            type: "van",
            mileage: 40000
        }];
})();
