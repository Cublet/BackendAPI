(function () {
	'use strict';
	
	var bcrypt = require('bcrypt-nodejs');
	
	/**
	* @module cubletApi/auth
	* @function hash
	* @param {string} passwordString - String to hash
	* @returns {string} Hashed string
	*/
	function hash(passwordString) {
		return bcrypt.hashSync(passwordString, bcrypt.genSaltSync(12));
	}
	
	/**
	* @module cubletApi/auth
	* @function compare
	* @param {string} passwordString - Password string
	* @param {string} hashedString - Hashed string to compare password against
	* @returns {boolean} TRUE on match, FALSE otherwise
	*/
	function compare(passwordString, hashedString) {
		return bcrypt.compareSync(passwordString, hashedString);
	}
	
	module.exports = {
		hash: hash,
		compare: compare
	};
	
}());