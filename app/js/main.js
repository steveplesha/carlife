(function() {
    var app = angular.module('myApp', ['firebase']);
    var myDataRef = new Firebase('https://burning-heat-392.firebaseio.com');
    var carRef = myDataRef.child('vehicles');
    

    
    app.controller("CarController", function() {
        this.cars = vehicle;
    });

    $('#jsAddNewCar').onclick(function(){
        var makeModel = $('#vehicleInput').val();
        var type = $('#vehicleTypeInput').val();
        var mileage = $('#mileageInput').val();
        
        carRef.push({
            name: "Sierra",
            type: "Pickup",
            mileage: 43000
        });
    });
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
