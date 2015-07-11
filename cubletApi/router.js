(function (global) {
	'use strict';
	
	var express = require('express'),
		bodyParser = require('body-parser'),
		mongoose = require('mongoose'),
		router = express.Router(),
		missingMiddleware = require('cubletApi/middleware/missing'),
		corsMiddleware = require('cubletApi/middleware/cors'),
		authRouter = require('cubletApi/auth/router'),
		userRouter = require('cubletApi/user/router'),
		repoRouter = require('cubletApi/repo/router'),
		apiView = require('cubletApi/apiView'),
		config = require('config');
	
	mongoose.connect(config.Mongoose.connectionUri);
	mongoose.set('debug', config.Mongoose.debug);
	
	router.use(bodyParser.urlencoded({extended: false}));
	router.use(bodyParser.json());
	router.use(corsMiddleware);
	
	router.use('/auth', authRouter);
	router.use('/users', userRouter);
	router.use('/repos', repoRouter);
	
	router.all(express().mountpath, function (req, res) {
		apiView(res, {
			message: config.greeterMessage
		});
	});
	
	router.use(missingMiddleware);
	
	module.exports = router;
	
}(global));