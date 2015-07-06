(function () {
	'use strict';
	
	/**
	* Middleware for allowing CORS
	* @param {Object} req - Express Request Object
	* @param {Object} res - Express Response Object
	* @param {Function} next - Express callback to continue running 
	*	post-middleware
	*/
	function cors(req, res, next) {
		res.set('Access-Control-Allow-Origin', '*');
		res.setHeader('Access-Control-Allow-Methods',
					  'GET, POST, PUT, PATCH, DELETE');
    	res.setHeader('Access-Control-Allow-Headers',
					  'X-Requested-With,content-type, Authorization');
		next();
	}
	
	module.exports = cors;
	
}());