(function () {
	'use strict';
	
	var router = require('express').Router(),
		
		authMiddleware = 
			require('cubletApi/middleware/auth'),
		forumIdMiddleware = 
			require('cubletApi/middleware/forumId'),
		forumCommentIdMiddleware = 
			require('cubletApi/middleware/forumCommentId'),
		
		forumsController = 
			require('cubletApi/forum/forumsController'),
		forumController = 
			require('cubletApi/forum/forumController');
	
	router
		.route('/forums')
		.post(forumsController.addForum)
		.get(forumsController.getForums);
	router
		.route('/forums/:forumid')
		.put(authMiddleware)
		.put(forumIdMiddleware)
		.put(forumController.updateForum)
		.get(forumIdMiddleware)
		.get(forumController.getForum);
	router
		.route('/forums/:forumid/upvote')
		.post(authMiddleware)
		.post(forumIdMiddleware)
		.post(forumController.addUpvote);
	router
		.route('/forums/:forumid/comments')
		.post(authMiddleware)
		.post(forumIdMiddleware)
		.post(forumController.addComment);
	router
		.route('/forums/:forumid/comments/:commentid')
		.post(authMiddleware)
		.post(forumIdMiddleware)
		.post(forumCommentIdMiddleware)
		.post(forumController.addCommentUpvote);
	
	module.exports = router;
		
}());