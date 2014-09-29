(function() {
    var app = angular.module('myApp', []);
    var myDataRef = new Firebase('https://burning-heat-392.firebaseio.com');
    
    app.directive('carList', [ '$http', function($http) {
        return {
            restrict: 'E',
            templateUrl: 'car-info.html'//,
            //controller: function(){
            //    var inventory = this;
            //    inventory.cars = [];
            //    $http.get('/car.json').success(function(data){
            //        inventory.cars = data;
            //    });
            //},
            //controllerAs: 'car'
        };
    }]);
    
    app.controller("CarController", [ '$http', function($http) {
        var inventory = this;
        inventory = [ ];
        $http.get('/js/car.json').success(function(data){
            inventory.cars=data;
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
})();
