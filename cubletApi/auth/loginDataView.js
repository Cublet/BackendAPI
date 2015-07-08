(function () {
	'use strict';

	var authToken = require('cubletApi/auth/authToken'),
		lodash = require('lodash');

	/**
	* Format an objectified user Mongo doc for outputting as `data`
	* @module cubletApi/auth
	* @name loginDataView
	* @param {Object} userDoc - User Mongo Document to format
	* @param {Object=} optionalProps - Additional key/values to add to userDoc
	* @returns {Object} Formatted User Mongo Document for output
	*/
	function loginDataView(userDoc, optionalProps) {
		var userDocFormatted = lodash.clone(userDoc.toObject()), 
			authTokenPayload = {
				_id: userDocFormatted._id,
				username: userDocFormatted.name,
				email: userDocFormatted.email,
				createdAt: userDocFormatted.createdAt
			};
		
		if (optionalProps && lodash.isPlainObject(optionalProps)) {
			lodash.assign(userDocFormatted, optionalProps);	
			lodash.assign(authTokenPayload, optionalProps);
		}
		userDocFormatted.authToken = authToken.generate(authTokenPayload);

		delete userDocFormatted.password;
		return userDocFormatted;
	}

	module.exports = loginDataView;

}());