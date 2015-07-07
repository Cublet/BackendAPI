(function () {
	'use strict';

	var validator = require('validator'),
		async = require('async'),
		
		apiView = require('cubletApi/apiView'),
		userModel = require('cubletApi/datastore/userModel'),
		passwordHash = require('cubletApi/auth/passwordHash');

	/**
	* Controller for handling the signup process
	* @module cubletApi/auth
	* @name signupController
	* @param {Object} req - Express Request Object
	* @param {Object} res - Express Response Object
	* @returns Configured apiView
	*/
	function signupController(req, res) {

		var name = req.body.name,
			username = req.body.username,
			password = req.body.password,
			email = req.body.email,
			mistakesData = {};

		if (!name) {
			mistakesData.name = 'No name provided';
		}
		if (!username) {
			mistakesData.username = 'No username provided';	
		}
		if (!password) {
			mistakesData.password = 'No password provided';	
		}
		if (!email) {
			mistakesData.email = 'No email provided';	
		}

		if (!mistakesData.email && 
			!(validator.isEmail(email))) {
			mistakesData.email = 'Invalid email provided';
		}

		if (!mistakesData.name && 
			!(name.split(" ").length >= 2 &&
			  validator.isAlpha(name.replace(/\s+/g, '')))) {
			mistakesData.name = 'Name must be a full name and alphabetic';	
		}

		if (!mistakesData.username && 
			!(validator.isAlphanumeric(username))) {
			mistakesData.username = 'Username must be alphanumeric';
		}

		if (!mistakesData.password && 
			!(validator.isAlphanumeric(password) && 
			  password.length >= 8)) {
			mistakesData.password = 'Password must be alphanumeric and ' + 
				'at least 8 characters long';
		}

		// There is a mistake present and that at least one of such mistakes
		// is a username mistake.
		if (mistakesData.username && 
			Object.getOwnPropertyNames(mistakesData).length > 0) {
			return apiView(res, {
				status: 400,
				message: 'Incorrect signup details',
				data: mistakesData
			});	
		}

		async.waterfall([
			function (callback) {
				userModel.count({username: username}, callback);
			},
			function (sameUsernames, callback) {
				if (sameUsernames > 0) {
					callback(new Error());
					mistakesData.username = "Someone already has that username";
				}

				callback(null);
			},
			function (callback) {
				userModel
					.create({
					name: name,
					username: username,
					email: email,
					password: passwordHash(password)
				}).then(function () {
					callback(null);
				}, function (error) {
					callback(error);
				});
			}
		], function (err, result) {
			if (err) {
				return apiView(res, {
					status: 400,
					message: 'Incorrect signup details',
					data: mistakesData
				});
			}

			return apiView(res, {
				status: 200,
				message: 'Succesfully signed the user up'
			});
		});

	}

	module.exports = signupController;

}());