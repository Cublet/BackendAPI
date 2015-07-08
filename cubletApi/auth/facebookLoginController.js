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
				// Get Facebook information of user
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
					See if Cublet already has the Facebook user.
					If he/she does, set facebookId if not already set.
					If not, we need a username (POST 'username' parameter)
				*/
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
					
					callback(null, userDoc, userFbInfo);
				});
			},
			function (userCubletInfo, userFbInfo, callback) {
				/*
					If Facebook user exists in Cublet, proceed to getting
					a long access token. If not, add the Facebook user
					in the Cublet system.
				*/
				if (userCubletInfo) {
					return callback(null, userCubletInfo);	
				}
				
				var fullname = userFbInfo.first_name + " " + 
					userFbInfo.last_name;

				userModel.create({
					name: fullname,
					email: userFbInfo.email,
					username: username,
					facebookId: userFbInfo.id
				}, function (err, userCubletInfo) {
					if (err) {
						return callback(err);
					}
					
					callback(null, userCubletInfo);
				});
			},
			function (userCubletInfo, callback) {
				/*
					Generate a long access Facebook token and finalize
					a response back to client.
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
						
						callback(null, loginDataView(userCubletInfo, {
							fbToken: response.access_token	
						}));
					}, function (err) {
						console.log("Didn't obtain access token");
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