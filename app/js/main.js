(function () {
    
    var app = angular.module('myApp', ['firebase', 'ngRoute']);
    var myDataRef = new Firebase('https://burning-heat-392.firebaseio.com');
    var authData = myDataRef.getAuth();
    
    app.config(['$routeProvider', '$locationProvider', 
        function($routeProvider, $locationProvider) {
            $locationProvider.html5Mode(true);
            
            $routeProvider.
              when('/', {
                  templateUrl: 'app/partials/initial.html',
                  controller: 'MainController'
              }).
              when('/cars', {
                  templateUrl: 'app/partials/carinfo.html',
                  controller: 'MainController'
              }).
              when('/register', {
                  templateUrl: 'app/partials/register.html',
                  controller: 'MainController'
              }).
              when('/addcar', {
                  templateUrl: 'app/partials/addcar.html',
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
              when('/repairs/:id', {
                  templateUrl: 'app/partials/repairs.html',
                  controller: 'EditCarController'
              }).
              when('/addrepair/:id', {
                  templateUrl: 'app/partials/addrepair.html',
                  controller: 'EditCarController'
              }).
              otherwise({
                  redirectTo: 'app/index.html'
              });
        }]);
    
    
    app.controller("MainController", ["$scope", "$firebase", "$location", "$routeParams", function($scope, $firebase, $location, $routeParams) {
        $scope.isActive = function(route) {
        return route === $location.path();
    }
        $scope.handleFileSelectAdd = function(evt) {
            console.log("starting main controller handle file select");
            var f = evt.target.files[0];
            var reader = new FileReader();
            reader.onload = (function(theFile) {
                return function(e) {
                    var filePayload = e.target.result;
                    picture = e.target.result;
                    document.getElementById('pano').src = $scope.picture;
                };
            })(f);
        reader.readAsDataURL(f);
        };  

        var uploadEl = document.getElementById('file-upload');
        if(uploadEl) {        
            uploadEl.addEventListener('change', $scope.handleFileSelectAdd, false);
        }
            
        $scope.addCar = function(year, make, model) {
            var authData = myDataRef.getAuth();
            var currentUserRef = myDataRef.child('users').child(authData.uid);
            var spinner = new Spinner({color: '#ddd'});
            picture = "app/img/default-vehicle.png";       

            currentUserRef.child('vehicles').push({
                year: year, 
                make: make, 
                model: model, 
                picture: picture
            });
            console.log("End of addCar function reached");
            $location.path('/cars');
        };
        
        $scope.removeCar = function(car) {
            console.log("Starting removeCar");
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
                if (error) {
                    if (error.code === "TRANSPORT_UNAVAILABLE") {
                        myDataRef.authWithOauthRedirect(provider, function (error, authData) {
                            $location.path('/cars');
                        });
                    }
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
                $scope.authData = authData;
                console.log(authData);
                $('.login-state').html("Logged In");
                var userRef = new Firebase(myDataRef + '/users/' + authData.uid);       
                var userVehicleRef = new Firebase(myDataRef + '/users/' + authData.uid + '/vehicles');
                var sync = $firebase(userVehicleRef);
                carlist = sync.$asArray();

                $scope.carlist = carlist;
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
              
        $scope.isActive = function(route) {
            return route === $location.path();
        }
        var repairRef = new Firebase(myDataRef + '/users/' + authData.uid + '/vehicles/' + id + '/repairs/');
        var sync = $firebase(repairRef);
        repairlist = sync.$asArray();    
        $scope.repairlist = repairlist;
        
        console.log("id is " + id);
        ref.once('value', function(snap) {
            var carlist = snap.val();
        });
        $scope.vehicle = carlist.$getRecord($routeParams.id);
        var picture = $scope.vehicle.picture;
        
        $scope.handleFileSelectAdd = function(evt) {
            console.log("starting edit car controller handle file select");            
            var f = evt.target.files[0];
            var reader = new FileReader();
            reader.onload = (function(theFile) {
                spinner.spin(document.getElementById('spin'));
                return function(e) {
                    var filePayload = e.target.result;
                    picture = e.target.result;
                    document.getElementById('pano').src = picture;
                    spinner.stop();
                };
            })(f);
            reader.readAsDataURL(f);
        };
        
        var uploadEl = document.getElementById('file-upload');
        if(uploadEl) {
            uploadEl.addEventListener('change', $scope.handleFileSelectAdd, false);
        }
        
        $scope.editCar = function(year, make, model) {
            console.log("start editcar function");
            console.log('picture: ' + picture)
            console.log("scope pic: " + $scope.picture);
            vehicleRef.child(id).update({year: year, make: make, model: model, picture: picture});
            $location.path('/cars');
        };
		
        $scope.addRepair = function(work, cost, shop, date, mileage) {
            console.log("Starting addRepair");
            console.log("scope.id: " + $scope.id);
            console.log("scope.id without $ on id:" + $scope.id);
            vehicleRef.child(id).child('repairs').push({
                work: $scope.work,
                cost: $scope.cost,
                shop: $scope.shop,
                date: $scope.date,
                mileage: $scope.mileage,                
            });
            console.log("End of addRepair function");
            $location.path('/repairs/' + id);
        };
        
        $scope.removeRepair = function(repair) {
            console.log("Starting removeRepair");
            $scope.repairlist.$remove(repair);     
        };
        
        
    }]);

}())
