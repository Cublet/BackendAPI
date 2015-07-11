(function () {
	'use strict';

	var validator = require('validator'),
		async = require('async'),

		passwordHash = require('cubletApi/auth/passwordHash'),
		apiView = require('cubletApi/apiView'),
		loginDataView = require('cubletApi/auth/loginDataView'),
		userModel = require('cubletApi/datastore/userModel');

	/**
	* Controller for handling legacy logins
	* @module cubletApi/auth
	* @name legacyLoginController
	* @param {Object} req - Express Request Object
	* @param {Object} res - Express Response Object
	*/
	function legacyLoginController(req, res) {
		var userIdentifier = req.body.useridentifier,
			userPassword = req.body.userpassword,
			userSearch;

		if (!(userIdentifier && userPassword)) {
			return apiView(res, {
				status: 403,
				message:  'User Email/Username and Password must' + 
				' be both provided'
			});
		}

		if (validator.isEmail(userIdentifier)) {
			userSearch = userModel.findOne({
				email: userIdentifier
			}).exec();
		} else {
			userSearch = userModel.findOne({
				username: userIdentifier
			}).exec();
		}

		async.waterfall([
			function (callback) {
				// Check if user exists on Cublet
				userSearch.then(function (userDoc) {
					callback(null, userDoc);
				}, function (err) {
					callback(err);	
				});
			},
			function (userDoc, callback) {
				// Check if user's password matches the stored hashed password
				if (!userDoc) {
					return callback(new Error("Incorrect login. Try again."));
				} else if (!userDoc.password) {
					return callback(new Error("Sign in with your " + 
											  "Facebook/Google account."));
				} else if (
					userDoc.password.length > 0 && 
					!passwordHash.compare(userPassword, userDoc.password)) {
					return callback(new Error("Incorrect login. Try again."));
				}
				
				callback(null, loginDataView(userDoc));
			},
		], function (err, userInfoPublic) {
			if (err) {
				return apiView(res, {
					status: 400,
					message: err.message
				});	
			}
			
			return apiView(res, {
				status: 200,
				message: "Succesfully authenticated",
				data: userInfoPublic
			});
		});
	}

	module.exports = legacyLoginController;

}());