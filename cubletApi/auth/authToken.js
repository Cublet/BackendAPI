(function () {
	'use strict';
	
	var jwt = require('jsonwebtoken'),
		config = require('config');
	
	/**
	* @module cubletApi/auth
	* @function generate
	* @param {{Object|Buffer|string}} payload - The information to encrypt
	* @returns {string} Encrypted token
	*/
	function generate(payload) {
		return jwt.sign(payload, config.jwtSecret, {
			algorithm: 'HS256',
			expiresInMinutes: 1440
		});
	}
	
	/**
	* @module cubletApi/auth
	* @function decode
	* @param {string} tokenString - The token to decode
	* @returns {?(Object|Buffer|string)} Decoded information, null if invalid
	*/
	function decode(tokenString) {
		var decoded;
		
		try {
			decoded = jwt.verify(tokenString, config.jwtSecret, {
				algorithms: ['HS256']	
			});
		} catch (err) {
			decoded = null;
		}
		return decoded;
	}
	
	module.exports = {
		generate: generate,
		decode: decode
	};
	
}());