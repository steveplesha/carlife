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
              when('/passwordreset', {
                  templateUrl: 'app/partials/pwreset.html',
                  controller: 'MainController'
              }).
              when('/maintenance', {
                  templateUrl: 'app/partials/maintenance.html'
              
              }).
              otherwise({
                  redirectTo: 'app/index.html'
              });
        }]);
    
    
    app.controller("MainController", ["$scope", "$firebase", "$location", "$routeParams", function($scope, $firebase, $location, $routeParams) {
        
        $scope.isActive = function(route) {
            return route === $location.path();
        };
        
        $('.main-nav').mouseenter(function() {
            $('body').addClass("expanded");
        });
        
        $('.main-nav').mouseleave(function() {
            $('body').removeClass("expanded");
        });
        
        var displayMsg = function(msgClass, message) {
            $('.message').addClass(msgClass).show().html(message).fadeOut(5000);
        };
        
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

        var uploadEl = document.getElementById('file-upload');
        if(uploadEl) {        
            uploadEl.addEventListener('change', $scope.handleFileSelectAdd, false);
        }
            
        $scope.addCar = function(year, make, model) {
            var authData = myDataRef.getAuth();
            var currentUserRef = myDataRef.child('users').child(authData.uid);
            var spinner = new Spinner({color: '#ddd'});

            currentUserRef.child('vehicles').push({
                year: year, 
                make: make, 
                model: model, 
                picture: picture
            });
            $location.path('/cars');
            displayMsg("info-message", "Car has been added");
        };
        
        $scope.removeCar = function(car) {
            $scope.carlist.$remove(car);
            displayMsg("info-message","Car has been removed");
        };

        $scope.register = function() {
            if ($scope.passwordRegister === $scope.passwordConfirm) {
                myDataRef.createUser({
                    email    : $scope.emailRegister,
                    password : $scope.passwordRegister
                }, function(error) {
                    if (error === null) {
                        myDataRef.authWithPassword({
                            email   : $scope.emailRegister, 
                            password: $scope.passwordRegister
                        }, function ( error, authData) {
                            console.log("user id: " + authData.uid + ", Provider: " + authData.provider);
                            myDataRef.child('users').child(authData.uid).set(authData);
                            $location.path('/');
                            displayMsg("info-message","You've successfully registered!");
                        })
                    } else { 
                        displayMsg("error-message", error);
                    }
                });
            } else {
                displayMsg("error-message", "The passwords entered don't match");
            }
        }; 
        
        $scope.login = function () {
            myDataRef.authWithPassword({
                email    : $scope.emailLogin,
                password : $scope.passwordLogin
            }, function (error, authData) {
                if (error === null) {
                    $location.path('/cars');
                    displayMsg("info-message","You've successfully logged in!");
                } else {
                    displayMsg("error-message",error);
                }
            });
        };
        
        $('.bt-social').unbind().on('click', function(e) { 
            var $currentButton = $(this);
            var provider = $currentButton.data("provider");
            e.preventDefault();
            
            thirdPartyLogin(provider);
        });
            
        function thirdPartyLogin(provider) {
            console.log("third party login entered");
            myDataRef.authWithOAuthPopup(provider, function (error, authData) {
                if (error) {
                    console.log(error);
                    if (error.code === "TRANSPORT_UNAVAILABLE") {
                        myDataRef.authWithOauthRedirect(provider, function (error, authData) {
                            $location.path('#/cars');
                            displayMsg("info-message","You've successfully logged in");
                        });
                    }
                } else {
                    displayMsg("error-message",error);
                }
                $location.path('/cars');
                displayMsg("info-message","You've successfully logged in!");
            });
        };
        
        $scope.pwreset = function() { 
            myDataRef.resetPassword({
                email: $scope.resetEmail
            }, function(error) {
                if (error === null) {
                    displayMsg("info-message","Password reset email sent successfully");
                } else {
                    displayMsg("error-message",error);
                }
            });
        };
            
                    
        $scope.logout = function() {
            myDataRef.unauth();
            $scope.authData = "";
            $('.login-state').html("Not logged in");
            $location.path('/');
            displayMsg("info-message","You are logged out");
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
        var authData = myDataRef.getAuth();
        var ref = new Firebase(myDataRef + '/users/' + authData.uid + '/vehicles');     
        var vehicleRef = myDataRef.child('users').child(authData.uid).child('vehicles')
        var id = $routeParams.id;
        var spinner = new Spinner({color: '#6a6a6a'});
        
        var displayMsg = function(msgClass, message) {
            $('.message').addClass(msgClass).show().html(message).fadeOut(5000);
        };
              
        $scope.isActive = function(route) {
            return route === $location.path();
        }
        
        ref.once('value', function(snap) {
            var carlist = snap.val();
        });
        
        var repairRef = new Firebase(myDataRef + '/users/' + authData.uid + '/vehicles/' + id + '/repairs/');
        var sync = $firebase(repairRef);
        var repairlist = sync.$asArray();
        var repairSum = 0;
        repairlist.$loaded().then(function(){   
            $scope.repairlist = repairlist;   
            for (var i=0; i < repairlist.length; i += 1) {
                repairSum += Number(repairlist[i].cost);
            }
            $scope.repairSum = repairSum;
        });
        
        $scope.vehicle = carlist.$getRecord(id);
        var picture = $scope.vehicle.picture;
        
        $scope.handleFileSelectAdd = function(evt) {        
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
            displayMsg("info-message","Your vehicle has been updated");
        };
		
        $scope.addRepair = function(work, cost, shop, date, mileage) {
            vehicleRef.child(id).child('repairs').push({
                work: $scope.work,
                cost: $scope.cost,
                shop: $scope.shop,
                date: $scope.date,
                mileage: $scope.mileage,                
            });
            $location.path('/repairs/' + id);
            displayMsg("info-message","Repair has been added");
        };
        
        $scope.removeRepair = function(repair) {
            $scope.repairSum -= repair.cost;
            $scope.repairlist.$remove(repair); 
            displayMsg("info-message","Repair has been deleted");
        };
        
        
    }]);

}())
