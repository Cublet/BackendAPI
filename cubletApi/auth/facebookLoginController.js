(function () {
	'use strict';

	var async = require('async'),
		
		config = require('config'),
		facebookApiCall = require('cubletApi/facebookApiCall'),
		userModel = require('cubletApi/datastore/userModel'),
		apiView = require('cubletApi/apiView'),
		loginDataView = require('cubletApi/auth/loginDataView');

	/**
	* Controller for handling Facebook logins
	* @module cubletApi/auth
	* @name facebookLoginController
	* @param {Object} req - Express Request Object
	* @param {Object} res - Express Response Object
	*/
	function facebookLoginController(req, res) {
		var username = req.body.username,
			usertoken = req.body.usertoken;

		if (!usertoken) {
			apiView(res, {
				status: 400,
				message: 'Facebook Access Token not provided'
			});
		}

		async.waterfall([
			function (callback) {
				// Get information of the FB profile that was used to login.
				var userTokenInfoApiPath = "/me?access_token=" + usertoken;

				facebookApiCall(userTokenInfoApiPath).then(
					function (userFbInfo) {
						callback(null, userFbInfo);
					}, function (err) {
						callback(err);
					});
			},
			function (userFbInfo, callback) {
				/*
					Return the Mongoose Document of a User with a matching 
					ID of the FB profile that was used to login.
				*/
				userModel.findOne({
					facebookId: userFbInfo.id
				}, function (err, userDoc) {
					if (err) {
						return callback(err);	
					}
					callback(null, userFbInfo, userDoc);
				});
			},
			function (userFbInfo, userDoc, callback) {
				/*
					If a Mongoose Document of a User with a matching ID 
					of an FB profile that was used to login, exists, 
					proceed to next step.
					
					If not, see if a Mongoose Document of a user with a matching
					email of the FB profile that was used to login, exists.
				*/
				if (userDoc) {
					callback(null, userFbInfo, userDoc);	
				}
				
				userModel.findOne({
					email: userFbInfo.email
				}, function (err, userDoc) {
					if (err) {
						return callback(err);	
					}
					if (!userDoc && !username) {
						return callback(new Error("User with that Facebook " + 
												  "account does not exist " + 
												  "in Cublet"));
					}
					
					if (userDoc && !userDoc.facebookId) {
						userDoc.facebookId = userFbInfo.id;
						userDoc.save(function (err) {
							if (err) {
								return callback(err);	
							}		
						});
					}
					
					callback(null, userFbInfo, userDoc);
				});
			},
			function (userFbInfo, userDoc, callback) {
				/*
					If Facebook user exists in Cublet, whether by matching 
					Facebook ID or email, proceed to next step.
					
					If not, add the Facebook user in Cublet
				*/
				if (userDoc) {
					return callback(null, userDoc);	
				}
				
				var fullname = userFbInfo.first_name + " " + 
					userFbInfo.last_name;

				userModel.create({
					name: fullname,
					email: userFbInfo.email,
					username: username,
					facebookId: userFbInfo.id
				}, function (err, userDoc) {
					if (err) {
						return callback(err);
					}
					
					callback(null, userDoc);
				});
			},
			function (userDoc, callback) {
				/*
					Generate a long access Facebook token and finalize
					an API response back to client.
				*/
				var longAccessTokenApiPath = "/oauth/access_token" + 
					"?grant_type=fb_exchange_token" + 
					"&client_id=" + config.facebook.appId + 
					"&client_secret=" + config.facebook.appSecret + 
					"&fb_exchange_token=" + usertoken;

				facebookApiCall(longAccessTokenApiPath).then(
					function (response) {
						if (!response.access_token) {
							return callback(
								new Error("No access token obtained")
							);
						}
						
						callback(null, loginDataView(userDoc, {
							fbToken: response.access_token	
						}));
					}, function (err) {
						callback(err);
					});	
			}
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

	module.exports = facebookLoginController;

}());