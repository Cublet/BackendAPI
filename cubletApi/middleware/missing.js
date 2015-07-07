(function () {
	'use strict';
	
	var apiView = require('cubletApi/apiView');
	
	/**
	* Middleware for handling missing routes.
	* @module cubletApi
	* @name missing
	* @param {Object} req - Express Request Object
	* @param {Object} res - Express Response Object
	*/
	function missingMiddleware(req, res) {
		apiView(res, {
			status: 404,
			message: 'API endpoint URL or method for such URL does not exist.'
		});
	}
	
	module.exports = missingMiddleware;
	
}());