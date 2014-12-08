(function () {
    
    var app = angular.module('myApp', ['firebase', 'ngRoute']);
    var myDataRef = new Firebase('https://burning-heat-392.firebaseio.com');
    var authData = myDataRef.getAuth();
    
    app.config(['$routeProvider', '$locationProvider', 
        function($routeProvider, $locationProvider) {
            $locationProvider.html5Mode(true);
            
            $routeProvider.
              when('/', {
                  templateUrl: 'app/index.html',
                  controller: 'MainController'
              }).
              when('/cars', {
                  templateUrl: 'app/partials/car-info.html',
                  controller: 'MainController'
              }).
              when('/register', {
                  templateUrl: 'app/partials/register.html',
                  controller: 'MainController'
              }).
              when('/addcar', {
                  templateUrl: 'app/partials/add-car.html',
                  controller: 'MainController'
              }).
              when('/editcar/:id', {
                  templateUrl: 'app/partials/editcar.html',
                  controller: 'editCarController'
              }).
              when('/login', {
                  templateUrl: 'app/partials/login.html',
                  controller: 'MainController'
              }).
              when('/addrepair/:id', {
                  templateUrl: 'app/partials/add-repair.html',
                  controller: 'MainController'
              }).
              otherwise({
                  redirectTo: 'app/index.html'
              });
        }]);
    

    
    app.controller("MainController", ["$scope", "$firebase", "$location", "$routeParams", function($scope, $firebase, $location, $routeParams) {
        //var sync = $firebase(myDataRef);
        
        $scope.addCar = function(year, make, model) {
            console.log('authData before getAuth: ' + authData);
            var authData = myDataRef.getAuth();
            var currentUser = myDataRef.child('users').child(authData.uid);
            var vehicleRef = myDataRef.child('vehicles').push();
            var vehicleRefID = vehicleRef.name();
            //var vehicleRef = myDataRef.child('users').child(authData.uid).child('vehicles');
            //var sync = $firebase(vehicleRef);

            console.log("current user: " + currentUser);
            console.log("vehiclerefid: " + vehicleRefID);
            var picture = "app/img/default-vehicle.png";

            vehicleRef.set({year: year, make: make, model: model, picture: picture});
            currentUser.child("vehicles").child(vehicleRefID).set(true);
            /*vehicleRef.push({
                year: $scope.year,
                make: $scope.make,
                model: $scope.model,
                picture: $scope.picture
            });*/

            console.log("End of addCar function reached");
            $location.path('/cars');
            
        };
        
        $scope.editCar = function(year, make, model) {
            console.log("start editcar function");
            $scope.vehicle = $scope.carlist[$routeParams.id];
            console.log($scope.vehicle);
            $scope.$save();
            $location.path('/cars');
        }
            
        
        $scope.addRepair = function(carID) {
            console.log("Starting addRepair");
            var authData = myDataRef.getAuth();
            //console.log($scope.$index);
            //console.log(carID);
            /*$scope.repair = $scope.vehicle[$routeParams.id];
            console.log("scope.repair: " + $scope.repair);
            */
            console.log("scope.id: " + $scope.$id);
            console.log("scope.id without $ on id:" + $scope.id);
            myDataRef.child('users').child(authData.uid).child('vehicles').child(carID).child('repairs').push({
                work: $scope.work,
                cost: $scope.cost,
                mileage: $scope.mileage
            });
            console.log("End of addRepair function");
            $location.path('/cars');
        };
        
        $scope.removeCar = function() {
            console.log("Starting removeCar");
            var authData = myDataRef.getAuth();
        };

        $scope.register = function() {
            console.log("Register function entered");
            console.log("user: " + $scope.emailRegister + " / pw: " + $scope.passwordRegister);
            
            myDataRef.createUser({
                email    : $scope.emailRegister,
                password : $scope.passwordRegister
            }, function(error) {
                if (error === null) {
                    console.log("user created successfully"); 
                    myDataRef.authWithPassword({
                        email   : $scope.emailRegister, 
                        password: $scope.passwordRegister
                    }, function ( error, authData) {
                        console.log("user id: " + authData.uid + ", Provider: " + authData.provider);
                        myDataRef.child('users').child(authData.uid).set(authData);
                        $location.path('/');
                    })
                } else { 
                    console.log("error creating user:", error);
                }
            });
        }; 
        
        $scope.login = function () {
            myDataRef.authWithPassword({
                email    : $scope.emailLogin,
                password : $scope.passwordLogin
            }, function (error, authData) {
                if (error === null) {
                    console.log("user id: " + authData.uid + ", Provider: " + authData.provider);
                    $location.path('/cars');
                } else {
                    alert("Error authenticating: ", error);
                }
            });
        };
        
        $('.bt-social').on('click', function(e) { 
        
            var $currentButton = $(this);
            var provider = $currentButton.data("provider");
            e.preventDefault();
            console.log("bt social clicked with provider " + provider);
            
            thirdPartyLogin(provider);
        });
            
        function thirdPartyLogin(provider) {
            console.log("third party login entered");
            myDataRef.authWithOAuthPopup(provider, function (error, authData) {
                if (error === null) {
                    console.log("user id: " + authData.uid + ", Provider: " + authData.provider);
                    $location.path('/cars');
                } else {
                    alert("Error authenticating: ", error);
                }
            });
        };
                    
        $scope.logout = function() {
            myDataRef.unauth();
            $scope.authData = "";
            $('.login-state').html("Not logged in");
            alert("You are logged out");
			console.log("User logged out");
            $location.path('/');
        };
        
        myDataRef.onAuth(function(authData) {
            if (authData) {
                $('.login-state').html("Logged In");
                $scope.authData = authData;
                var vehicleRef = myDataRef.child('users').child(authData.uid).child('vehicles');
                //var vehicleRef = myDataRef.child('users').child(authData.uid).child('vehicles');
                var sync = $firebase(vehicleRef);
                carlist = sync.$asArray();
                    
                carlist.$loaded().then(function() {
                    console.log("list has " + carlist.length + " items");
                    console.log(carlist);
                });
                
                $scope.carlist = carlist;
                console.log("cars assigned, carlist scope = " + $scope.carlist);
            } else {
                $('.loginState').html("Not Logged In");
            }
        });    
        
    }]);
    
    app.controller("editCarController", ["$scope", "$firebase", "$location", "$routeParams", function($scope, $firebase, $location, $routeParams) {
        console.log("starting edit controller");
        var authData = myDataRef.getAuth();
        var ref = new Firebase(myDataRef + '/users/' + authData.uid + '/vehicles/');
        var sync = $firebase(ref);
        var carlist = sync.$asArray();
        console.log(carlist);
        console.log(carlist[$routeParams.id]);
        $scope.vehicle = carlist.$getRecord($routeParams.id);
        console.log($scope.vehicle);
    }]);
            
    function handleFileSelect(evt) {
        var f = evt.target.files[0];
        var reader = new FileReader();
        console.log("entered file select");
        reader.onload = (function(theFile) {
            return function(e) {
                var filePayload = e.target.result;
                // Generate a location that can't be guessed using the file's contents and a random number
                var hash = CryptoJS.SHA256(Math.random() + CryptoJS.SHA256(filePayload));
                var f = new Firebase(myDataRef + '/pano/' + hash + '/filePayload');
                console.log(f);
               // spinner.spin(document.getElementById('spin'));
               // Set the file payload to Firebase and register an onComplete handler to stop the spinner and show the preview
               f.set(filePayload, function() { 
                 // spinner.stop();
                            //document.getElementById("pano").src = e.target.result;
                 //$('#file-upload').hide();
                 // Update the location bar so the URL can be shared with others
                 window.location.hash = hash;
               });
             };
            })(f);
            reader.readAsDataURL(f);
        }        
    /*$(function() {
        // $('#spin').append(spinner);
        console.log("entered function");
        var myDataRef = new Firebase('https://burning-heat-392.firebaseio.com');
        var idx = window.location.href.indexOf('#');
        var hash = (idx > 0) ? window.location.href.slice(idx + 1) : '';
        if (hash === '') {
            // No hash found, so render the file upload button.
            $('#file-upload').show();
            //document.getElementById("file-upload").addEventListener('change', handleFileSelect, false);
        } else {
            // A hash was passed in, so let's retrieve and render it.
            // spinner.spin(document.getElementById('spin'));
            var f = new Firebase(myDataRef + '/pano/' + hash + '/filePayload');
            console.log(f);
        f.once('value', function(snap) {
            var payload = snap.val();
            if (payload != null) {
            document.getElementById("pano").src = payload;
            } else {
            $('#body').append("Not found");
            }
            //spinner.stop();
        });
      }
    }); */ 
}())
