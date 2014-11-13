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
              when('/login', {
                  templateUrl: 'app/partials/login.html',
                  controller: 'MainController'
              }).
              otherwise({
                  redirectTo: 'app/index.html'
              });
        }]);
    
    app.controller("MainController", ["$scope", "$firebase", "$location", '$firebaseSimpleLogin', function($scope, $firebase, $location, $firebaseSimpleLogin) {
        var sync = $firebase(myDataRef);
        var authClient = $firebaseSimpleLogin(myDataRef);
        
        $scope.addCar = function() {
            //var authData = myDataRef.getAuth();

            myDataRef.child('users').child(authData.uid).child('vehicles').push({
                name: $scope.makeModel,
                type: $scope.carType,
                mileage: $scope.mileage
            });
            sync.child(authData.uid).child('vehicles').$save();
            console.log("End of addCar function reached");
            $location.path('/cars');
        };

        $scope.register = function() {
            console.log("Register function entered");
            console.log("user: " + $scope.emailRegister + " / pw: " + $scope.passwordInput);
            
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
            alert("You are logged out");
            $location.path('/');
        };
        
        myDataRef.onAuth(function(authData) {
            if (authData) {
                $('.login-state').html("Logged In");
                var vehicleRef = myDataRef.child('users').child(authData.uid).child('vehicles');
                var sync = $firebase(vehicleRef);
                carlist = sync.$asArray();
                    
                carlist.$loaded().then(function() {
                    console.log("list has " + carlist.length + " items");
                    console.log(carlist);
                });
                
                $scope.carlist = carlist;
                console.log("cars assigned, carlist scope = " + $scope.carlist);
            } else {
                $('.loginState').html("Logged Out");
            }
        });    
        
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
    $(function() {
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
    });  
}())
