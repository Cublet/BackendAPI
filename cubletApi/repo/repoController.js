(function () {
	'use strict';

	var lodash = require('lodash'),

		repoModel = require('cubletApi/datastore/repoModel'), 
		apiView = require('cubletApi/apiView'),
		pushUserActivity = require('cubletApi/pushUserActivity');

	/**
	* Returns a repoDoc given a repoId. Stops API execution otherwise
	* @private
	* @param {string|number} repoId - ID of repository
	* @param {Object} res - Express Request Object
	* @param {Function} callback - Function to call when repoDoc is retrieved
	*/
	function _getRepoDoc(repoId, res, callback) {
		repoModel.findOne({_id: repoId}, function (err, repoDoc) {
			if (err) {
				return apiView(res, {
					status: 400,
					message: err.message
				});
			}
			if (!repoDoc) {
				return apiView(res, {
					status: 400,
					message: "That repository does not exist."
				});
			}

			callback(repoDoc);
		});
	}

	/**
	* Gets the information about a specific repository
	* @param {Object} req - Express Request Object
	* @param {Object} res - Express Response Object
	*/
	function getRepo(req, res) {
		var repoId = req.params.repoid,
			loggedInUser = req && req.authToken;

		_getRepoDoc(repoId, res, function (repoDoc) {
			if (repoDoc.public === false && 
				repoDoc.createdBy !== loggedInUser) {
				return apiView(res, {
					status: 400,
					message: "This repository is private.",
				});
			}

			repoDoc.upvotes = repoDoc.upvotes.length;

			apiView(res, {
				message: "Repository succesfully retrieved.",
				data: repoDoc.toObject()
			});
		});
	}

	/**
	* Edits the information of a specific repository
	* @param {Object} req - Express Request Object
	* @param {Object} res - Express Response Object
	*/
	function updateRepo(req, res) {
		var repoId = req.params.repoid, 
			updatedRepoInfo = req && req.body,
			loggedInUser = req.authToken;

		if (!updatedRepoInfo) {
			return apiView(res, {
				status: 400,
				message: "No information to update the repository was sent."
			});
		}

		_getRepoDoc(repoId, res, function (repoDoc) {
			if (repoDoc.createdBy !== loggedInUser._id) {
				return apiView(res, {
					status: 400,
					message: "Unauthorized to change repository information."
				});
			}

			updatedRepoInfo = lodash.pick(updatedRepoInfo,
										  ['title', 
										   'description', 
										   'code', 
										   'public']);
			lodash.merge(repoDoc, updatedRepoInfo);
			repoDoc.save();

			pushUserActivity(loggedInUser._id, loggedInUser.followers, {
				reference: repoDoc._id,
				action: "updated_repo"
			});

			apiView(res, {
				message: "Succesfully updated repository."
			});
		});
	}

	/**
	* Upvotes a specific repository
	* @param {Object} req - Express Request Object
	* @param {Object} res - Express Response Object
	*/
	function addUpvote(req, res) {
		var repoId = req.params.repoid,
			loggedInUser = req.authToken;

		_getRepoDoc(repoId, res, function (repoDoc) {
			var loggedInUserInUpvotes = 
				repoDoc.upvotes.indexOf(loggedInUser._id);
			if (loggedInUserInUpvotes > -1) {
				repoDoc.upvotes.splice(loggedInUserInUpvotes, 1);
				repoDoc.save();

				return apiView(res, {
					message: "Succesfully removed upvote on this repository."
				});
			}

			repoDoc.upvotes.push(loggedInUser._id);
			repoDoc.save();

			pushUserActivity(loggedInUser._id, loggedInUser.followers, {
				reference: repoDoc._id,
				action: "upvoted_repo"
			});

			return apiView(res, {
				message: "Succesfully upvoted on this repository."
			});
		});
	}

	/**
	* Add a comment to a specific repository
	* @param {Object} req - Express Request Object
	* @param {Object} res - Express Response Object
	*/
	function addComment(req, res) {
		var repoId = req.params.repoid, 
			newComment = req && req.body, 
			loggedInUser = req.authToken;

		if (!newComment) {
			return apiView(res, {
				status: 400,
				message: "No new comment to be added"
			});
		}

		_getRepoDoc(repoId, res, function (repoDoc) {
			newComment = lodash.pick('message');
			if (loggedInUser) {
				newComment.createdBy = loggedInUser._id;
			}

			newComment.under = repoDoc._id;
			repoDoc.comments.push(newComment);
			repoDoc.save();

			pushUserActivity(loggedInUser._id, loggedInUser.followers, {
				reference: repoDoc._id,
				action: "commented_repo"
			});

			return apiView(res, {
				status: 400,
				message: "Commented succesfully"
			});
		});
	}

	/**
	* Updates a specific comment on a specific repository
	* @param {Object} req - Express Request Object
	* @param {Object} res - Express Response Object
	*/
	function updateComment(req, res) {
		var repoId = req.params.repoid,
			repoCommentId = req.params.commentid,
			loggedInUser = req.authToken;

		_getRepoDoc(repoId, res, function (repoDoc) {
			var repoCommentDoc = repoDoc.comments.id(repoCommentId),
				updatedComment;

			if (!repoCommentDoc) {
				return apiView(res, {
					status: 400,
					message: "That repository comment does not exist."
				});
			}

			updatedComment = lodash.pick("message");
			lodash.merge(repoCommentDoc, updatedComment);
			repoDoc.save();

			pushUserActivity(loggedInUser._id, loggedInUser.followers, {
				reference: repoDoc._id,
				action: "updated_repoComment"
			});

			apiView(res, {
				message: "Repository comment succesfully updated."
			});
		});
	}

	/**
	* Upvote a specific comment on a specific repository
	* @param {Object} req - Express Request Object
	* @param {Object} res - Express Response Object
	*/
	function addCommentUpvote(req, res) {
		var repoId = req.params.repoid,
			repoCommentId = req.params.commentid,
			loggedInUser = req.authToken;

		_getRepoDoc(repoId, res, function (repoDoc) {
			var repoCommentDoc = repoDoc.comments.id(repoCommentId),
				loggedInUserInUpvotes = 
				repoCommentDoc.upvotes.indexOf(loggedInUser._id);

			if (!repoCommentDoc) {
				return apiView(res, {
					status: 400,
					message: "That repository comment does not exist."
				});
			}

			if (loggedInUserInUpvotes > -1) {
				repoCommentDoc.upvotes.splice(loggedInUserInUpvotes, 1);
				repoDoc.save();
				
				return apiView(res, {
					status: 400,
					message: "You already upvoted this comment."
				});
			}

			repoCommentDoc.upvotes.push(loggedInUser._id);
			repoDoc.save();

			pushUserActivity(loggedInUser._id, loggedInUser.followers, {
				reference: repoDoc._id,
				action: "upvoted_repoComment"
			});

			return apiView(res, {
				message: "Succesfully upvoted comment."
			});
		});
	}

	module.exports = {
		getRepo: getRepo,
		updateRepo: updateRepo,
		addUpvote: addUpvote,
		addComment: addComment,
		updateComment: updateComment,
		addCommentUpvote: addCommentUpvote
	};

}());