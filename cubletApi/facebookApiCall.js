(function () {
	'use strict';

	var request = require('request');

	/**
	* Constructs and sends Facebook API calls
	* @param {string} urlPath - URL relative to the base Facebook API 
	*	endpoint, that is being called.
	* @param {string=} method - GET, POST, DELETE
	* @returns {Object} Promise, resolved when Facebook API returns a 200, 
	*	rejected otherwise.
	*/
	function facebookApiCall(urlPath, method) {
		if (!method) {
			method = "GET";	
		}

		function promiseExecutor(resolve, reject) {
			request({
				method: method,
				uri: "https://graph.facebook.com/v2.3" + urlPath,
			}, function (err, res, body) {
				var responseBody = body && JSON.parse(body);

				if (err) {
					return reject(err);
				}

				if (res.statusCode !== 200) {
					if (responseBody && 
						responseBody.error && 
						responseBody.error.message &&
						responseBody.error.type) {
						return reject(new Error(responseBody.error.type + 
												' ' + 
												responseBody.error.message));
					} else {
						return reject(
							new Error("Non-200 Facebook API status error")
						);
					}
				}
				
				resolve(responseBody);
			});
		}

		return new Promise(promiseExecutor);
	}

	module.exports = facebookApiCall;

}());