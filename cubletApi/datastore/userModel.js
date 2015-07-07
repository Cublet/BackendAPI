(function () {
	'use strict';
	
	var mongoose = require('mongoose'),
		userSchema = require('cubletApi/datastore/userSchema'),
		
		userModel = mongoose.model('User', userSchema);
	
	module.exports = userModel;
	
}());