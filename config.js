(function (global) {
	'use strict';
	
	/**
	* Configuration File for Cublet's API Backend
	* The following must be setup by you, manually, in any environment you 
	* choose to deploy Cublet/BackendAPI in. This file manages holding secrets
	* like app keys, customizable welcome messages and other sorts of settings.
	*
	* It is important that you try to keep this file as private as possible.
	*/

	var packageInfo = require('./package.json'),

		config = {
			versionNumber: packageInfo.version.split('.')[0],
			portNumber: 8000,
			greeterMessage: 'Welcome to Cublet\'s API. For more ' + 
				'information, check out https://github.com/Cublet/BackendAPI',
			Mongoose: {
				debug: true,
				connectionUri: ''
			},
			jwtSecret: '',
			staticFileLocation: 'public',
			facebook: {
				appId: '',
				appSecret: ''
			}
		};

	module.exports = config;

}(global));