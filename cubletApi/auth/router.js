(function () {
	'use strict';
	
	var router = require('express').Router(),
		signupController = 
			require('cubletApi/auth/signupController'),
		legacyLoginController = 
			require('cubletApi/auth/legacyLoginController'),
		facebookLoginController = 
			require('cubletApi/auth/facebookLoginController'),
		googleLoginController = 
			require('cubletApi/auth/googleLoginController');
	
	router.post('/signup', signupController);
	router.post('/login/legacy', legacyLoginController);
	router.post('/login/facebook', facebookLoginController);
	router.post('/login/google', googleLoginController);
	
	module.exports = router;
	
}());