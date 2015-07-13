(function () {
	'use strict';

	var lodash = require('lodash'),

		forumModel = require('cubletApi/datastore/forumModel'),
		apiView = require('cubletApi/apiView'),
		pushUserActivity = require('cubletApi/pushUserActivity');

	/**
	* Returns a forumDoc given a forumId, Stops API execution otherwise
	* @private
	* @param {string|number} forumId - ID of forum
	* @param {Object} res - Express Request Object
	* @param {Function} callback - Function to call when forumDoc is retrieved
	*/
	function _getForumDoc(forumId, res, callback) {
		forumModel.findOne({_id: forumId}, function (err, forumDoc) {
			if (err) {
				return apiView(res, {
					status: 400,
					message: err.message
				});
			}
			if (!forumDoc) {
				return apiView(res, {
					status: 400,
					message: "That forum does not exist."
				});
			}

			callback(forumDoc);
		});
	}

	/**
	* Gets the information about a specific forum
	* @private
	* @param {Object} req - Express Request Object
	* @param {Object} res - Express Response Object
	*/
	function getForum(req, res) {
		var forumId = req.params.forumid,
			loggedInUser = req && req.authToken;

		_getForumDoc(forumId, res, function (forumDoc) {
			forumDoc.upvotes = forumDoc.upvotes.length;

			apiView(res, {
				message: "Forum succesfully retrieved.",
				data: forumDoc.toObject()
			});
		});
	}

	/**
	* Updates the information about a specific forum
	* @param {Object} req - Express Request Object
	* @param {Object} res - Express Response Object
	*/
	function updateForum(req, res) {
		var forumId = req.params.forumid,
			updatedForumInfo = req && req.body,
			loggedInUser = req.authToken;

		if (!updatedForumInfo) {
			return apiView(res, {
				status: 400,
				message: "No information to update the forum was sent."
			});
		}

		_getForumDoc(forumId, res, function (forumDoc) {
			if (forumDoc.createdBy !== loggedInUser._id) {
				return apiView(res, {
					status: 400,
					message: "Unauthorized to change forum information."
				});
			}

			updatedForumInfo = lodash.pick(updatedForumInfo, 
										   ['title', 'message']);

			lodash.merge(forumDoc, updatedForumInfo);
			forumDoc.save();

			pushUserActivity(loggedInUser._id, loggedInUser.followers, {
				reference: forumDoc._id,
				action: "updated_forum"
			});

			apiView(res, {
				message: "Succesfully updated forum."
			});
		});
	}

	/**
	* Upvotes a specific forum
	* @param {Object} req - Express Request Object
	* @param {Object} res - Express Response Object
	*/
	function addUpvote(req, res) {
		var forumId = req.params.forumid,
			loggedInUser = req.authToken;

		_getForumDoc(forumId, res, function (forumDoc) {
			var loggedInUserInUpvotes = 
				forumDoc.upvotes.indexOf(loggedInUser._id);
			if (loggedInUserInUpvotes > -1) {
				forumDoc.upvotes.splice(loggedInUserInUpvotes, 1);
				forumDoc.save();

				return apiView(res, {
					message: "Succesfully removed upvote on this forum."
				});
			}

			forumDoc.upvotes.push(loggedInUser._id);
			forumDoc.save();

			pushUserActivity(loggedInUser._id, loggedInUser.followers, {
				reference: forumDoc._id,
				action: "upvoted_forum"
			});

			return apiView(res, {
				message: "Succesfully upvoted on this forum."
			});
		});
	}

	/**
	* Adds a comment to a specific forum
	* @param {Object} req - Express Request Object
	* @param {Object} res - Express Response Object
	*/
	function addComment(req, res) {
		var forumId = req.params.forumid,
			newComment = req && req.body,
			loggedInUser = req.authToken;

		if (!newComment) {
			return apiView(res, {
				status: 400,
				message: "No new comment to be added"
			});
		}

		_getForumDoc(forumId, res, function (forumDoc) {
			newComment = lodash.pick('message');
			if (loggedInUser) {
				newComment.createdBy = loggedInUser._id;	
			}

			newComment.under = forumDoc._id;
			forumDoc.comments.push(newComment);
			forumDoc.save();

			pushUserActivity(loggedInUser._id, loggedInUser.followers, {
				reference: forumDoc._id,
				action: "commented_forum"
			});
		});
	}

	/**
	* Updates a specific comment on a specific forum
	* @param {Object} req - Express Request Object
	* @param {Object} res - Express Response Object
	*/
	function updateComment(req, res) {
		var forumId = req.params.forumid,
			forumCommentId = req.params.commentid,
			loggedInUser = req.authToken;

		_getForumDoc(forumId, res, function (forumDoc) {
			var forumCommentDoc = forumDoc.comments.id(forumCommentId),
				updatedComment;

			if (!forumCommentDoc) {
				return apiView(res, {
					status: 400,
					message: "That forum comment does not exist."
				});
			}

			updatedComment = lodash.pick("message");
			lodash.merge(forumCommentDoc, updatedComment);
			forumDoc.save();

			pushUserActivity(loggedInUser._id, loggedInUser.followers, {
				reference: forumDoc._id,
				action: "updated_forumComment"
			});

			apiView(res, {
				message: "Forum comment succesfully updated."
			});
		});
	}

	/**
	* Updates a specific comment on a specific forum
	* @param {Object} req - Express Request Object
	* @param {Object} res - Express Response Object
	*/
	function addCommentUpvote(req, res) {
		var forumId = req.params.forumid,
			forumCommentId = req.params.commentid,
			loggedInUser = req.authToke;

		_getForumDoc(forumId, res, function (forumDoc) {
			var forumCommentDoc = forumDoc.comments.id(forumCommentId),
				loggedInUserInUpvotes = 
				forumCommentDoc.upvotes.indexOf(loggedInUser._id);

			if (!forumCommentDoc) {
				return apiView(res, {
					status: 400,
					message: "That forum comment does not exist."
				});
			}
			
			if (loggedInUserInUpvotes > -1) {
				forumCommentDoc.upvotes.splice(loggedInUserInUpvotes, 1);
				forumDoc.save();
				
				return apiView(res, {
					message: "Succesfully removed upvote on this forum."
				});
			}
			
			forumCommentDoc.upvotes.push(loggedInUser._id);
			forumDoc.save();
			
			pushUserActivity(loggedInUser._id, loggedInUser.followers, {
				reference: forumDoc._id,
				action: "upvoted_forumComment"
			});
			
			return apiView(res, {
				message: "Succesfully upvoted comment."
			});
		});
	}

	module.exports = {
		getForum: getForum,
		updateForum: updateForum,
		addUpvote: addUpvote,
		addComment: addComment,
		updateComment: updateComment,
		addCommentUpvote: addCommentUpvote
	};

}());