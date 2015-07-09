(function () {
	'use strict';

	var router = require('express').Router(),
		
		authMiddleware = require('cubletApi/middleware/auth'),
		userIdMiddleware = require('cubletApi/middleware/userId'),
		
		meController = require('cubletApi/user/meInfoController'),
		userInfoController = require('cubletApi/user/userInfoController'),
		userFollowController = require('cubletApi/user/userFollowController');

	router
		.route('/me')
		.all(authMiddleware)
		.put(meController.put)
		.get(meController.get);
	router
		.route('/:userid')
		.put(userIdMiddleware)
		.put(authMiddleware)
		.put(userInfoController.put)
		.get(userIdMiddleware)
		.get(userInfoController.get);
	router
		.route('/:userid/follow')
		.put(userIdMiddleware)
		.put(authMiddleware)
		.put(userFollowController.put);



	module.exports = router;

}());