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
                  controller: 'EditCarController'
              }).
              when('/login', {
                  templateUrl: 'app/partials/login.html',
                  controller: 'MainController'
              }).
              when('/addrepair/:id', {
                  templateUrl: 'app/partials/add-repair.html',
                  controller: 'EditCarController'
              }).
              otherwise({
                  redirectTo: 'app/index.html'
              });
        }]);
    
    
    app.controller("MainController", ["$scope", "$firebase", "$location", "$routeParams", function($scope, $firebase, $location, $routeParams) {
        
        $scope.addCar = function(year, make, model) {
            console.log('authData before getAuth: ' + authData);
            var authData = myDataRef.getAuth();
            var currentUserRef = myDataRef.child('users').child(authData.uid);
            var spinner = new Spinner({color: '#ddd'});
            var picture = "app/img/default-vehicle.png";

            $scope.handleFileSelectAdd = function(evt) {
                var f = evt.target.files[0];
                var reader = new FileReader();
                reader.onload = (function(theFile) {
                    return function(e) {
                        var filePayload = e.target.result;
                        picture = e.target.result;
                        document.getElementById('pano').src = picture;
                    };
                })(f);
            reader.readAsDataURL(f);
            };
            document.getElementById('file-upload').addEventListener('change', $scope.handleFileSelectAdd, false);

            currentUserRef.child('vehicles').push({year: year, make: make, model: model, picture: picture, user: authData.uid});
            /*vehicleRef.push({
                year: $scope.year,
                make: $scope.make,
                model: $scope.model,
                picture: $scope.picture
            });*/

            console.log("End of addCar function reached");
            $location.path('/cars');
            
        };
        
        $scope.removeCar = function(car) {
            console.log("Starting removeCar");
            var authData = myDataRef.getAuth();
            $scope.carlist.$remove(car);
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
                //var vehicleRef = myDataRef.child('users').child(authData.uid).child('vehicles');
                var userRef = new Firebase(myDataRef + '/users/' + authData.uid);       
                var userVehicleRef = new Firebase(myDataRef + '/users/' + authData.uid + '/vehicles');
                console.log(userVehicleRef);
                var sync = $firebase(userVehicleRef);
                carlist = sync.$asArray();
                    
                carlist.$loaded().then(function() {
                    console.log("list has " + carlist.length + " items");
                    console.log(carlist);
                });
            
                $scope.carlist = carlist;
 
                
                
                //console.log("cars assigned, carlist scope = " + $scope.carlist);
            } else {
                $('.loginState').html("Not Logged In");
            }
        });    
        
    }]);
    
    app.controller("EditCarController", ["$scope", "$firebase", "$location", "$routeParams", function($scope, $firebase, $location, $routeParams) {
        console.log("starting edit controller");
        var authData = myDataRef.getAuth();
        var ref = new Firebase(myDataRef + '/users/' + authData.uid + '/vehicles');
        var vehicleRef = myDataRef.child('users').child(authData.uid).child('vehicles')
        var sync = $firebase(ref);
        var id = $routeParams.id;
        var spinner = new Spinner({color: '#ddd'});
        
        console.log("id is " + id);
        //var carlist = ref.$asArray();
        ref.once('value', function(snap) {
            console.log("started ref.once  ");
            var carlist = snap.val();
            console.log("carlist is :" + carlist);
        });
        console.log("carlist is " + carlist);
        //console.log("carlist[routeparam] is " + carlist[$routeParams.id]);
        $scope.vehicle = carlist.$getRecord($routeParams.id);
        console.log($scope.vehicle);
        
        $scope.handleFileSelectAdd = function(evt) {
            var f = evt.target.files[0];
            var reader = new FileReader();
            reader.onload = (function(theFile) {
                return function(e) {
                    var filePayload = e.target.result;
                    spinner.spin(document.getElementById('spin'));
                    $scope.picture = e.target.result;
                    document.getElementById('pano').src = $scope.picture;
                    spinner.stop();
                };
            })(f);
            reader.readAsDataURL(f);
        };
        document.getElementById('file-upload').addEventListener('change', $scope.handleFileSelectAdd, false);
        
        
        $scope.editCar = function(year, make, model) {
            console.log("start editcar function");
            console.log($scope.vehicle);
            vehicleRef.child(id).update({year: year, make: make, model: model, picture: $scope.picture});
            $location.path('/cars');
        };
		
        $scope.addRepair = function(work, cost, mileage) {
            console.log("Starting addRepair");
            console.log("scope.id: " + $scope.id);
            console.log("scope.id without $ on id:" + $scope.id);
            vehicleRef.child(id).child('repairs').push({
                work: $scope.work,
                cost: $scope.cost,
                mileage: $scope.mileage
            });
            console.log("End of addRepair function");
            $location.path('/cars');
        };
        
        
    }]);

}())
