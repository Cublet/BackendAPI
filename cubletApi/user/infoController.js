(function () {
	'use strict';

	var lodash = require('lodash'),
		async = require('async'),

		userModel = require('cubletApi/datastore/userModel'),
		apiView = require('cubletApi/apiView');

	/**
	* Gets the User Mongoose Document provided the ID
	* @param {string|number} userId - ID of User MongoDB Document to retrieve
	* @private
	*/
	function getUserDoc(userId) {
		function promiseExecutor(resolve, reject) {
			userModel.findOne({_id: userId}, function (err, userDoc) {
				if (err) {
					return reject(err);	
				}
				if (!userDoc) {
					return reject(new Error("User does not exist"));	
				}

				resolve(userDoc);
			});
		}

		return new Promise(promiseExecutor);
	}

	/**
	* Formats the provided Mongoose Document for public display
	* @param {Object} userDoc - Mongoose Document to be formatted
	* @private
	*/
	function getUserPublicInfo(userDoc) {
		var userPublicInfo = lodash.clone(userDoc.toObject());
		delete userPublicInfo.password;

		return userPublicInfo;
	}

	/**
	* Controller for user information PUT requests
	* @module cubletApi/user
	* @function put
	* @param {Object} req - Express Request Object
	* @param {Object} res - Express Response Object
	* @param {string} userid - User's ID
	*/
	function put(req, res, userid) {
		async.waterfall([
			function (callback) {
				getUserDoc(userid).then(function (userDoc) {
					callback(null, userDoc);
				}, function (err) {
					callback(err);
				});	
			},
			function (userDoc, callback) {
				if (req && req.body) {
					lodash.forOwn(req.body, function (value, key) {
						userDoc[key] = value;
					});
					return userDoc.save(function (err, userDoc) {
						if (err) {
							return callback(err);	
						}
						
						callback(null, userDoc);	
					});
				}

				callback(null, userDoc);
			}
		], function (err, userDoc) {
			if (err) {
				return apiView(res, {
					status: 400,
					message: err.message
				});
			}

			apiView(res, {
				status: 200,
				message: 'User information succesfully updated',
				data: getUserPublicInfo(userDoc)
			});
		});
	}

	/**
	* Controller for user information GET requests
	* @module cubletApi/user
	* @function get
	* @param {Object} req - Express Request Object
	* @param {Object} res - Express Response Object
	* @param {string} userid - User's ID
	*/
	function get(req, res, userid) {
		getUserDoc(userid).then(function (userDoc) {
			apiView(res, {
				message: 'User information succesfully retrieved',
				data: getUserPublicInfo(userDoc)
			});
		}, function (err) {
			apiView(res, {
				status: 400,
				message: err.message
			});
		});
	}


	module.exports = {
		put: put,
		get: get
	};

}());