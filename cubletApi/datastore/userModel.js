(function () {
	'use strict';
	
	var userSchema = require('cubletApi/datastore/userSchema'),
		
		userModel = mongoose.model('User', userSchema);
	
	module.exports = userModel;
	
}());