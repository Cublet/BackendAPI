(function () {
	'use strict';
	
	var apiView = require('cubletApi/apiView');
	
	/**
	* Middleware for allowing CORS
	* @param {Object} req - Express Request Object
	* @param {Object} res - Express Response Object
	* @param {Function} next - Express callback to continue running 
	*	post-middleware
	*/
	function cors(req, res, next) {
		res.setHeader('Access-Control-Allow-Origin', '*');
		res.setHeader('Access-Control-Allow-Methods',
					  'GET, POST, PUT, PATCH, DELETE, OPTIONS');
    	res.setHeader('Access-Control-Allow-Headers',
					  'X-Requested-With, content-type, authorization, accept, origin');
		res.setHeader('Access-Control-Allow-Credentials', 'true');
		
		if (req.method === "OPTIONS") {
			return apiView(res, {
				status: 200
			});
		} else {
			next();	
		}
	}
	
	module.exports = cors;
	
}());