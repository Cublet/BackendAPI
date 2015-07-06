(function (global) {
	'use strict';
	
	require('app-module-path').addPath(__dirname);

	var express = require('express'),
		config = require('config'),
		app = express(),
		
		cubletApiRouter = require('cubletApi/router'),
		apiEndpointUrl = '/api/v' + config.versionNumber;
	
	app.use(apiEndpointUrl, cubletApiRouter);
	
	app.listen(config.portNumber, function () {
		global.console.log('Listening at port ' + config.portNumber);
		global.console.log('API accessible at ' + apiEndpointUrl);
	});
	
}(global));