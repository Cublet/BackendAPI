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

		// There is a mistake present and that at least two of such mistakes
		// are a username and email-based mistake.
		if (mistakesData.username && mistakesData.email &&
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
					mistakesData.username = "Someone already has that username";
				}
				userModel.count({email: email}, callback);
			},
			function (sameEmails, callback) {
				if (sameEmails > 0) {
					mistakesData.email = "Someone already has that email";
				}
				
				if (Object.getOwnPropertyNames(mistakesData).length > 0) {
					callback(new Error());	
				} else {
					callback(null);
				}
			},
			function (callback) {
				userModel.create({
					name: name,
					username: username,
					email: email,
					password: passwordHash.hash(password)
				}).then(function () {
					callback(null);
				}, function (error) {
					callback(error);
				});
			}
		], function (err) {
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