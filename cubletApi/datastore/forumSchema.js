(function () {
	'use strict';
	
	var mongoose = require('mongoose'),
		forumCommentSchema = 
			require('cubletApi/datastore/forumCommentSchema'),
		Schema = mongoose.Schema,
		
		forumSchema = new Schema({
			title: {
				type: String,
				required: true
			},
			message: {
				type: String,
				required: true
			},
			createdBy: {
				type: Schema.Types.ObjectId, 
				ref: 'User'
			},
			createdAt: Date,
			updatedAt: Date,
			comments: [forumCommentSchema]
		});
	
	forumSchema.pre('save', function(next){
		var now = new Date();
		this.updatedAt = now;
		if ( !this.createdAt ) {
			this.createdAt = now;
		}
		next();
	});
	forumSchema.pre('update', function() {
		this.update({
			updatedAt: Date.now()
		});
	});
	
	module.exports = forumSchema;
	
}());