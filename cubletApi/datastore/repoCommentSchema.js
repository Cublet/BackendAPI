(function () {
	'use strict';
	
	var mongoose = require('mongoose'),
		Schema = mongoose.Schema,

		repoCommentSchema = new Schema({
			message: String,
			createdBy: {
				type: Schema.Types.ObjectId,
				ref: 'User'
			},
			createdAt: Date,
			editedAt: {
				type: Date,
				default: Date.now
			},
			under: {
				type: Schema.Types.ObjectId,
				ref: 'Repo'
			}
		});
	
	module.exports = repoCommentSchema;
	
}());