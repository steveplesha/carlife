(function() {
    var app = angular.module('myApp', []);
    
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
