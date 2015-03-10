
	var HomeCtrl = angular.module('HomeCtrl',[], function config ($httpProvider) {
		
		$httpProvider.interceptors.push('authInterceptor');

	});

	HomeCtrl.constant('API_URL', "http://localhost:3000");

	HomeCtrl.controller('homeCtrl',function(randomUserService,loginService) {
	

		var hc = this;

		hc.hello = "world";

		hc.getRandomUser = function() {
			
			randomUserService.getUser().then(function success(response){
				hc.randomUser = response.data;
				console.log(hc.randomUser)
			})
		}

		hc.user = {}

		hc.login = function(username, password) {

			loginService.login(username,password).then(function success(response) {

				hc.user.username = response.data.username
				
				console.log(response)

				alert(response.data.token);

			}, hc.handleError)

		};

		hc.logout = function() {
			loginService.logout();
		};

		hc.handleError = function(response) {
			alert('Error: ' + response.data);
		};


	});

	HomeCtrl.service('randomUserService', ['$http','API_URL', function($http, API_URL){

		function getUser() {
			return $http.get(API_URL + '/random-data');
		};
		return{
			getUser: getUser
		}
		
	}])
	
	HomeCtrl.service('loginService', ['$http','API_URL', 'authToken', function($http, API_URL, authToken){

		function login(username,password) {
			return $http.post(API_URL + '/login',{
				username: username,
				password: password
			}).then(function success (response) {
				authToken.setToken(response.data.token);
				console.log(response.data.token)
				return response;
			});
		};

		function logout () {
			//set token to nothing
			authToken.setToken();
		}

		return{
			login: login,
			logout: logout
		}
		
	}])

	HomeCtrl.service('authToken', function($window){
		
		var store = $window.localStorage;
		var key = 'sv_token'

		function getToken () {
			return store.getItem(key);
		}

		function setToken (token) {
			
			if(token){
				store.setItem(key,token);
			}else{
				store.removeItem(key);
			}
		}

		return{
			getToken: getToken,
			setToken: setToken
		};
	})

	HomeCtrl.service('authInterceptor', ['authToken', function(authToken){

		function addToken (config) {
			var token = authToken.getToken();
			if (token) {
				config.headers = config.header || {};
				config.headers.Authorization = 'Bearer ' + token;
			}
			return config;
		}

		return{
			request: addToken
		}
		
	}])








