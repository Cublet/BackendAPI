(function () {
	'use strict';
	
	var apiView = require('cubletApi/apiView');
	
	function repoIdMiddleware(req, res, next) {
		if (!req || !req.body || !req.body.repoid) {
			apiView(res, {
				status: 400,
				message: "Repo ID is a required request parameter"
			});
		}
	}
	
	module.exports = repoIdMiddleware;
	
}());