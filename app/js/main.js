(function() {
    var app = angular.module('myApp', []);
    var myDataRef = new Firebase('https://burning-heat-392.firebaseio.com');
        
    app.controller("CarController", function() {
        this.cars = vehicle;
    });
    
    var carRef = myDataRef.child('vehicles');
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
