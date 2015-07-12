(function () {
	'use strict';
	
	var router = require('express').Router(),
		
		authMiddleware = 
			require('cubletApi/middleware/auth'),
		repoIdMiddleware = 
			require('cubletApi/middleware/repoId'),
		repoCommentIdMiddleware = 
			require('cubletApi/middleware/repoCommentId'),
		
		reposController = 
			require('cubletApi/repo/reposController'),
		repoController = 
			require('cubletApi/repo/repoController');
	
	router
		.route('/repos')
		.post(reposController.addRepo)
		.get(reposController.getRepos);
	router
		.route('/repos/:repoid')
		.put(authMiddleware)
		.put(repoIdMiddleware)
		.put(repoController.updateRepo)
		.get(repoIdMiddleware)
		.get(repoController.getRepo);
	router
		.route('/repos/:repoid/upvote')
		.post(authMiddleware)
		.post(repoIdMiddleware)
		.post(repoController.addUpvote);
	router
		.route('/repos/:repoid/comments')
		.post(authMiddleware)
		.post(repoIdMiddleware)
		.post(repoController.addComment);
	router
		.route('/repos/:repoid/comments/:commentid')
		.put(authMiddleware)
		.put(repoIdMiddleware)
		.put(repoCommentIdMiddleware)
		.put(repoController.updateComment);
	router
		.route('/repos/:repoid/comments/:commentid/upvote')
		.post(authMiddleware)
		.post(repoIdMiddleware)
		.post(repoCommentIdMiddleware)
		.post(repoController.addCommentUpvote);
	
	
	module.exports = router;
	
}());