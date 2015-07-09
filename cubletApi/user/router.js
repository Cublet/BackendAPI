(function () {
	'use strict';

	var router = require('express').Router(),
		
		authMiddleware = require('cubletApi/middleware/auth'),
		useridMiddleware = require('cubletApi/middleware/userid'),
		
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
		.put(useridMiddleware)
		.put(authMiddleware)
		.put(userInfoController.put)
		.get(useridMiddleware)
		.get(userInfoController.get);
	router
		.route('/:userid/follow')
		.put(useridMiddleware)
		.put(authMiddleware)
		.put(userFollowController.put);



	module.exports = router;

}());