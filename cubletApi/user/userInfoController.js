(function () {
	'use strict';

	var infoController = require('cubletApi/user/infoController'),
		apiView = require('cubletApi/apiView');

	/**
	* Controller for /<user-id> GET requests
	* @module cubletApi/user
	* @function put
	* @param {Object} req - Express Request Object
	* @param {Object} res - Express Response Object
	*/
	function get(req, res) {
		infoController.get(req, res, req.params.userid);
	}

	/**
	* Controller for /<user-id> PUT requests
	* @module cubletApi/user
	* @function put
	* @param {Object} req - Express Request Object
	* @param {Object} res - Express Response Object
	*/
	function put(req, res) {
		if (req.params.userid !== req.authToken._id) {
			return apiView(res, {
				status: 403,
				message: "Unauthorized"
			});
		}
		infoController.put(req, res, req.params.userid);
	}

	module.exports = {
		get: get,
		put: put
	};

}());