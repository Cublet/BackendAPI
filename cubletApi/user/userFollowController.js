(function () {
	'use strict';

	var async = require('async'), 

		userModel = require('cubletApi/datastore/userModel'),
		apiView = require('cubletApi/apiView'),
		pushUserActivity = require('cubletApi/pushUserActivity');

	/**
	* Handles User Follows
	* @param {Object} req - Express Request Object
	* @param {Object} res - Express Response Object
	*/
	function post(req, res) {
		var userId = req.authToken._id,
			followingUserId = req.params.userid;

		if (userId === followingUserId) {
			return apiView(res, {
				status: 400,
				message: "You cannot follow yourself."
			});
		}

		async.waterfall([
			function (callback) {
				// Get Mongo Doc of current logged-in user
				userModel
					.findOne({_id: userId}, function (err, userDoc) {
					if (err) {
						return callback(err);	
					}
					if (!userDoc) {
						return callback(new Error("Logged-in user not found"));
					}

					callback(null, userDoc);
				});
			},
			function (userDoc, callback) {
				/*
					Get Mongo Doc of user that the current logged-in user
					wants to follow
				*/
				userModel
					.findOne({_id: followingUserId}, 
							 function (err, followingUserDoc) {
					if (err) {
						return callback(err);	
					}
					if (!userDoc) {
						return callback(new Error("User to follow, not found"));
					}

					callback(null, userDoc, followingUserDoc);
				});
			},
			function (userDoc, followingUserDoc, callback) {
				// Toggle Follow/Unfollow
				var currentUserArray = userDoc.following,
					followingUserArray = followingUserDoc.followers,
					
					currentUserFollowers = userDoc.toObject().followers;

				if (currentUserArray.indexOf(followingUserDoc._id) === -1 && 
					followingUserArray.indexOf(userDoc._id) === -1) {
					currentUserArray.push(followingUserDoc._id);
					followingUserArray.push(userDoc._id);
					
					pushUserActivity(userDoc._id, currentUserFollowers, {
						action: "followed_user",
						reference: followingUserDoc._id
					});
					callback(null, "Succesfully followed " + 
							 followingUserDoc.username);
				} else {
					currentUserArray.splice(
						currentUserArray.indexOf(followingUserDoc._id), 1
					);
					followingUserArray.splice(
						followingUserArray.indexOf(userDoc._id), 1
					);
					
					pushUserActivity(userDoc._id, currentUserFollowers, {
						action: "unfollowed_user",
						reference: followingUserDoc._id
					});
					callback(null, "Succesfully unfollowed " + 
							 followingUserDoc.username);
				}
				
				userDoc.save();
				followingUserDoc.save();
			}
		], function (err, message) {
			if (err) {
				return apiView(res, {
					status: 400,
					message: err.message
				});
			}

			apiView(res, {
				status: 200,
				message: message
			});
		});
	}

	module.exports = {
		post: post
	};

}());