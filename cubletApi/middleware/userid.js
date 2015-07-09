(function () {
	'use strict';
	
	var apiView = require('cubletApi/apiView');
	
	function useridMiddleware(req, res, next) {
		if (!req || !req.params || !req.params.userid || 
			req.params.userid.length === 0) {
			return apiView(res, {
				status: 400,
				message: "User's ID is a required parameter"
			});
		}
		next();
	}
	
	module.exports = useridMiddleware;
	
}());