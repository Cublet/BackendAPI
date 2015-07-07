(function () {
	'use strict';
	
	var mongoose = require('mongoose'),
		forumSchema = require('cubletApi/datastore/forumSchema'),
		
		forumModel = mongoose.model('Forum', forumSchema);
	
	module.exports = forumModel;
	
}());