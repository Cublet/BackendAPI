(function (global) {
	'use strict';
	
	require('app-module-path').addPath(__dirname);

	var express = require('express'),
		config = require('config'),
		path = require('path'),
		app = express(),
		
		cubletApiRouter = require('cubletApi/router'),
		apiEndpointUrl = '/api/v' + config.versionNumber,
		staticFileLocation = config.staticFileLocation;
	
	app.use(apiEndpointUrl, cubletApiRouter);
	app.use(express.static(staticFileLocation));
	
	app.all('/*', function (req, res) {
		res.sendFile(path.join(__dirname + '/' + staticFileLocation + 
							   '/index.html'));
	});
	
	app.listen(config.portNumber, function () {
		global.console.log('Listening at port ' + config.portNumber);
		global.console.log('API accessible at ' + apiEndpointUrl);
	});
	
}(global));