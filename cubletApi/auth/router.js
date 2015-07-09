(function () {
	'use strict';
	
	var router = require('express').Router(),
		signupController = 
			require('cubletApi/auth/signupController'),
		legacyLoginController = 
			require('cubletApi/auth/legacyLoginController'),
		facebookLoginController = 
			require('cubletApi/auth/facebookLoginController');
	
	router.post('/signup', signupController);
	router.post('/login/legacy', legacyLoginController);
	router.post('/login/facebook', facebookLoginController);
	
	module.exports = router;
	
}());