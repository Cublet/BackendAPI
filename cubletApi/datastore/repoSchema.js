(function () {
	'use strict';
	
	var mongoose = require('mongoose'),
		Schema = mongoose.Schema,
		repoCommentSchema = require('cubletApi/datastore/repoCommentSchema'),
		
		repoSchema = new Schema({
			title: String,
			code: String,
			comments: [repoCommentSchema],
			followedBy: [{
				type: Schema.Types.ObjectId,
				ref: 'User'
			}],
			createdBy: {
				type: Schema.Types.ObjectId,
				ref: 'User'
			},
			createdAt: {
				type: Date	
			},
			editedAt: {
				type: Date,
				default: Date.now
			}
		});
	
	module.exports = repoSchema;
	
}());