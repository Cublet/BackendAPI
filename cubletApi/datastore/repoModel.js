(function () {
	'use strict';

	var mongoose = require('mongoose'),
		repoSchema = require('cubletApi/datastore/repoSchema'),
		
		repoModel = mongoose.model('Repo', repoSchema);

	module.exports = repoModel;

}());