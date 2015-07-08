(function () {
	'use strict';

	var validator = require('validator'),
		async = require('async'),

		passwordHash = require('cubletApi/auth/passwordHash'),
		authToken = require('cubletApi/auth/authToken'),
		apiView = require('cubletApi/apiView'),
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
			apiView(res, {
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
				userSearch.then(function (userInfo) {
					callback(null, userInfo);
				}, function (err) {
					callback(err);	
				});
			},
			function (userInfo, callback) {
				if (!userInfo) {
					callback(new Error("Incorrect login. Try again."));
				} else if (
					!passwordHash.compare(userPassword, userInfo.password)) {
					callback(new Error("Incorrect login. Try again."));	
				}

				var userInfoPublic = userInfo.toObject();
				delete userInfoPublic.password;
				userInfoPublic.authToken = authToken.generate({
					_id: userInfoPublic._id,
					username: userInfoPublic.name,
					email: userInfoPublic.email,
					createdAt: userInfoPublic.createdAt,
					updatedAt: userInfoPublic.updatedAt
				});
				
				callback(null, userInfoPublic);
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