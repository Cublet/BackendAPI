(function () {
	'use strict';

	var lodash = require('lodash'), 
		
		repoModel = require('cubletApi/datastore/repoModel'), 
		apiView = require('cubletApi/apiView'),
		pushUserActivity = require('cubletApi/pushUserActivity');
	
	/**
	* Gets a list of all the public repos.
	* @param {Object} req - Express Request Object
	* @param {Object} res - Express Response Object
	*/
	function getRepos(req, res) {
		repoModel
			.find({public: true}, 
				  '_id title code createdBy createdAt updatedAt upvotes')
			.lean()
			.exec(function (err, repos) {
			if (err) {
				return apiView(res, {
					status: 400,
					message: err.message
				});
			}
			
			repos.upvotes = repos.upvotes.length;
			apiView(res, {
				status: 200,
				message: "Succesfully retrieved user repositories",
				data: repos
			});
		});
	}

	/**
	* Creates a new repository.
	* @param {Object} req - Express Request Object
	* @param {Object} res - Express Response Object
	*/
	function addRepo(req, res) {
		var newRepoInfo = req && req.body,
			loggedInUser = req && req.authToken;
		
		if (!newRepoInfo) {
			return apiView(res, {
				message: "No new repo information submitted"
			});
		}
		
		newRepoInfo = lodash.pick(newRepoInfo, 
							  ['title', 'description', 'code', 'public']);
		if (loggedInUser && lodash.isObject(loggedInUser)) {
			newRepoInfo.createdBy = loggedInUser._id;
		}

		repoModel.create(newRepoInfo, function (err, newRepoDoc) {
			if (err) {
				return apiView(res, {
					status: 400,
					message: err.message
				});
			}
			
			pushUserActivity(loggedInUser._id, loggedInUser.followers, {
				reference: newRepoDoc._id,
				action: "created_repo"
			});

			apiView(res, {
				message: "Succesfully created new repository",
				data: newRepoDoc.toObject()
			});
		});
	}

	module.exports = {
		getRepos: getRepos,
		addRepo: addRepo
	};

}());