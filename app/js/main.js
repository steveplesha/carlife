(function(jQuery, Firebase, Path) {
    "use strict";
    
    var app = angular.module('myApp', ['firebase']);
    var myDataRef = new Firebase('https://burning-heat-392.firebaseio.com');
    var carRef = myDataRef.child('vehicles');   
    
    app.controller("CarController", ["$scope", function($scope) {
        this.cars = vehicle;
        
        $scope.addCar = function() {
            $scope.makeModel = $('#vehicleInput').val();
            $scope.cartype = $('#vehicleTypeInput').val();
            $scope.mileage = $('#mileageInput').val();

            carRef.push({
                name: $scope.makeModel,
                type: $scope.cartype,
                mileage: $scope.mileage
            });
            alert("clicked");
            $scope.addCarForm.$setPristine();
        };
    }]);
	
    var routeMap = {
        '#/': {
            form: 'frmLogin',
            controller: "login"
        },
        '#/logout': {
            form: 'frmLogout',
            controller: 'logout'
        },
        '#/register': {
            form: 'frmRegister',
            controller: 'register'
        },
    };
    
    var loginController = {};
    
    var activeForm = null;
    
    var alertBox = $('#alert');
    
    function routeTo(route) {
        window.locatoin.href = '#/' + route;
    }
    
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

    function thirdPartyLogin(provider) {
        var deferred = $.Deferred();
        
        myDataRef.authWithOAuthPopup(provider, function(err, user) {
            if (err) {
                deferred.reject(err);
            }
            
            if (user) {
                deferred.resolve(user);
            }
        });
        
        return deferred.promise();            
    };
    
    function authWithPassword(userObj) {
        var deffered = $.Deferred();
        console.log(userObj);
        myDataRef.authWithPassword(userObj, function onAuth(err, user) {
            if (err) {
                deffered.reject(err);
            }
            
            if (user) {
                deffered.resolve(user);
            }
        });
        
        return deferred.promise();
    }
    
    function createUser(userObj) {
        var deferred = $.Deferred();
        rootRef.createUser(userObj, function (err) {

            if (!err) {
                deferred.resolve();
            } else {
                deferred.reject(err);
            }

        });

        return deferred.promise();
    }    
    
    function createUserAndLogin(userObj) {
        return createUser(userObj)
            .then(function () {
            return authWithPassword(userObj);
        });
    }    
    
     function handleAuthResponse(promise, route) {
        $.when(promise)
            .then(function (authData) {

            // route
            routeTo(route);

        }, function (err) {
            console.log(err);
            // pop up error
            showAlert({
                title: err.code,
                detail: err.message,
                className: 'alert-danger'
            });

        });
    }
    
    // options for showing the alert box
    function showAlert(opts) {
        var title = opts.title;
        var detail = opts.detail;
        var className = 'alert ' + opts.className;

        alertBox.removeClass().addClass(className);
        alertBox.children('#alert-title').text(title);
        alertBox.children('#alert-detail').text(detail);
    }
    
    loginController.login = function (form) {
        form.on('submit', function (e) {
            var userAndPass = $(this).seralizeObject();
            var loginPromise = authWithPassword(userAndPass);
            e.preventDefault();
            
            handleAuthResponse(loginPromise, 'profile');
        });
        
        form.children('.bt-social').on('click', function(e) {
            alert("clicked");
            var $currentButton = $(this);
            var provider = $currentButton.data('provider');
            var socialLoginPromise;
            e.preventDefault();
            
            socialLoginPromise = thirdPartyLogin(provider);
            handleAuthResponse(socialLoginPromise, 'profile'); 
        });   
    };
    
    loginController.logout = function (form) {
        myDataRef.unauth();
    };
    
    loginController.profile= function (form) {
        var user = myDataRef.getAuth();
        var userRef;
        
        if (!user) {
            routeto('register');
            return;
        }
        
        userRef = myDataRef.chile('users').child(user.uid);
        userRef.once('value', function (snap) {
            var user = snap.val();
            if (!user) {
                return;
            }
            
            form.find('#txtName').val(user.name);
        });
        
        form.on('submit', function(e) {
            e.preventDefault();
            var userInfo = $(this).serializeObject();
            
            userRef.set(userInfo, function onComplete() {
                showAlert({
                    title: 'Successfully saved',
                    detail: 'You are still logged in',
                    className: 'alert-success'
                });
            });
        });    
    };
    
    function transitionRoute(path) {
        var formRoute = routeMap[path];
        var currentUser = myDataRef.getAuth();
        
        if (formRoute.authRequired && !currentUser) {
            routeTo('register');
            return;
        }
        
        var upcomingForm = $('#' + formRoute.form);
        
        if (!activeForm) {
            activeForm = upcomingForm;
        }
        
        activeForm.hide();
        upcomingForm.show().hide().fadeIn(750);
        
        activeForm.off();
        
        activeForm = upcomingForm;
        
        loginController[formRoute.controller](activeForm);
    }
    
    function prepRoute() {
        transitionRoute(this.path);
    }
    
    Path.map('#/').to(prepRoute);
    Path.map('#/logout').to(prepRoute);
    Path.map('#/register').to(prepRoute);
    Path.map('#/profile').to(prepRoute);
    
    Path.root('#/');
    
    $(function () {

        // Start the router
        Path.listen();

        // whenever authentication happens send a popup
        myDataRef.onAuth(function globalOnAuth(authData) {

            if (authData) {
                showAlert({
                    title: 'Logged in!',
                    detail: 'Using ' + authData.provider,
                    className: 'alert-success'
                });
            } else {
                showAlert({
                    title: 'You are not logged in',
                    detail: '',
                    className: 'alert-info'
                });
            }

        });

    });    
    
        
        
        
}(window.jQuery, window.Firebase, window.Path));
