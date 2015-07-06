(function () {
	'use strict';

	var repoSchema = require('cubletApi/datastore/repoSchema'),
		
		repoModel = mongoose.model('Repo', repoSchema);

	module.exports = repoModel;

}());