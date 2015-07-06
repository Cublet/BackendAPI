(function () {
	'use strict';
	
	var mongoose = require('mongoose'),
		forumCommentSchema = 
			require('cubletApi/datastore/forumCommentSchema'),
		Schema = mongoose.Schema,
		
		forumSchema = new Schema({
			title: String,
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
			comments: [forumCommentSchema]
		});
	
	module.exports = forumSchema;
	
}());