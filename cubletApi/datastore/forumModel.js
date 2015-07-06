(function () {
	'use strict';
	
	var forumSchema = require('cubletApi/datastore/forumSchema'),
		
		forumModel = mongoose.model('Forum', forumSchema);
	
	module.exports = forumModel;
	
}());