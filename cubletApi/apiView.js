(function () {
	'use strict';

	/**
	* Constructs the response view of the Cublet API
	* @module cubletApi
	* @name apiView
	* @param {Object} responseStream - Express Response Object
	* @param {Object=} responseOptions - Configuration for response view.
	*	Can include `message`, `data` and `status` properties.
	* @returns {Object} Configured Express Response
	*/
	function apiView(responseStream, responseOptions) {

		var status = responseOptions && Number(responseOptions.status),
			data = responseOptions.data || {},
			message = responseOptions.message || '';

		if (status < 200 || status > 499 || isNaN(status)) {
			switch (message.toLowerCase()) {
				case "error":
				case "failure":
					status = 400;
					break;
				default:
					status = 200;
			}
		}
		
		if (message.length === 0) {
			if (status < 200 || status > 499) {
				message = "Error";
			}
		}
		
		responseStream
			.status(status)
			.json({
				status: status,
				message: message,
				data: data
			});

	}

	module.exports = apiView;

}());