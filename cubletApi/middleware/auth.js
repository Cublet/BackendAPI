(function () {
	'use strict';
	
	var apiView = require('cubletApi/apiView'), 
		authToken = require('cubletApi/auth/authToken');
	
	/**
	* Middleware for handling authentication. On verification of token, 
	* the decoded payload is placed upon req.authToken.
	* @param {Object} req - Express Request Object
	* @param {Object} res - Express Response Object
	* @param {Function} next - Express callback to continue running
	*/
	function auth(req, res, next) {
		var authHeaders = req.get('Authorization'),
			tokenString = authHeaders && authHeaders.split(" ")[1],
			decodedAuthToken;
		
		if (!authHeaders || !authToken) {
			return apiView(res, {
				status: 403,
				message: 'Unauthorized. Please login/create an account.'
			});
		}
		
		decodedAuthToken = authToken.decode(tokenString);
		if (!decodedAuthToken) {
			return apiView(res, {
				status: 403,
				message: 'Unauthorized. Invalid Token.'
			});
		}
		
		req.authToken = decodedAuthToken;
		next();
	}
	
	module.exports = auth;
	
}());