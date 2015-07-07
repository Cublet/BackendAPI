(function () {
	'use strict';
	
	var validator = require('validator'),
		
		passwordHash = require('cubletApi/auth/passwordHash'),
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
			apiView(req, {
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
		
		userSearch.then(function (err, userInfo) {
			if (err) {
				throw err;	
			}
			if (!userInfo) {
				throw new Error("Incorrect login. Try again.");
			}
			
			if (!passwordHash.compare(userPassword, userInfo.password)) {
				throw new Error("Incorrect login. Try again.");	
			}
			
			var userInfoPublic = userInfo.toObject();
			delete userInfoPublic.password;
			delete userInfoPublic._id;
			
			apiView(res, {
				message: "Succesfully authenticated",
				data: userInfoPublic
			});
		}).catch(function (err) {
			apiView(res, {
				status: 400,
				message: err.message
			});
		});
	}
	
	module.exports = legacyLoginController;
	
}());