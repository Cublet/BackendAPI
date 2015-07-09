(function () {
	'use strict';
	
	var apiView = require('cubletApi/apiView');
	
	function userIdMiddleware(req, res, next) {
		if (!req || !req.params || !req.params.userid || 
			req.params.userid.length === 0) {
			return apiView(res, {
				status: 400,
				message: "User ID is a required request parameter"
			});
		}
		next();
	}
	
	module.exports = userIdMiddleware;
	
}());