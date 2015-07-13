(function () {
	'use strict';
	
	var lodash = require('lodash'),
		
		forumModel = require('cubletApi/datastore/forumModel'),
		apiView = require('cubletApi/apiView'),
		pushUserActivity = require('cubletApi/pushUserActivity');
	
	/**
	* Gets a list of all the forums.
	* @param {Object} req - Express Request Object
	* @param {Object} res - Express Response Object
	*/
	function getForums(req, res) {
		forumModel.find({}).lean().exec(function (err, forums) {
			if (err) {
				return apiView(res, {
					status: 400,
					message: err.message
				});
			}
			
			forums.upvotes = forums.upvotes.length;
			apiView(res, {
				status: 200,
				message: "Succesfully retrieved forums",
				data: forums
			});
		});
	}
	
	/**
	* Creates a new forum.
	* @param {Object} req - Express Request Object
	* @param {Object} res - Express Response Object
	*/
	function addForum(req, res) {
		var newForumInfo = req && req.body,
			loggedInUser = req && req.authToken;
		
		if (!newForumInfo) {
			return apiView(res, {
				message: "No new forum information submitted"
			});
		}
		
		newForumInfo = lodash.pick(newForumInfo, 
								  ['title', 'message']);
		if (loggedInUser && lodash.isObject(loggedInUser)) {
			newForumInfo.createdBy = loggedInUser._id;	
		}
		
		forumModel.create(newForumInfo, function (err, newForumDoc) {
			if (err) {
				return apiView(res, {
					status: 400,
					message: err.message
				});
			}
			
			pushUserActivity(loggedInUser._id, loggedInUser.followers, {
				reference: newForumDoc._id,
				action: "created_forum"
			});
			
			apiView(res, {
				message: "Succesfully created new forum",
				data: newForumDoc.toObject()
			});
		});
	}
	
	module.exports = {
		getForums: getForums,
		addForum: addForum
	};
	
}());