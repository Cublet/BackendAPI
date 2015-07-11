(function () {
	'use strict';

	var mongoose = require('mongoose'),
		Schema = mongoose.Schema,

		userActivitySchema = new Schema({
			action: String,
			reference: Schema.Types.ObjectId,
			createdAt: Date
		});

	module.exports = userActivitySchema;

}());