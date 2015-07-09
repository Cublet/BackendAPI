(function () {
	'use strict';

	var infoController = require('cubletApi/user/infoController');

	/**
	* Controller for /me PUT requests
	* @module cubletApi/user
	* @function put
	* @param {Object} req - Express Request Object
	* @param {Object} res - Express Response Object
	*/
	function put(req, res) {
		infoController.put(req, res, req.authToken._id);
	}

	/**
	* Controller for /me GET requests
	* @module cubletApi/user
	* @function get
	* @param {Object} req - Express Request Object
	* @param {Object} res - Express Response Object
	*/
	function get(req, res) {
		infoController.get(req, res, req.authToken._id);
	}


	module.exports = {
		put: put,
		get: get
	};

}());