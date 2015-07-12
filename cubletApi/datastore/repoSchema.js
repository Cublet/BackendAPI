(function () {
	'use strict';
	
	var mongoose = require('mongoose'),
		Schema = mongoose.Schema,
		repoCommentSchema = require('cubletApi/datastore/repoCommentSchema'),
		
		repoSchema = new Schema({
			title: {
				type: String,
				required: true
			},
			description: String,
			code: {
				type: String,
				required: true
			},
			comments: [repoCommentSchema],
			createdBy: {
				type: Schema.Types.ObjectId,
				ref: 'User'
			},
			upvotes: [{
				type: Schema.Types.ObjectId,
				ref: 'User'
			}],
			public: {
				type: Boolean,
				default: true
			},
			createdAt: Date,
			updatedAt: Date
		});
	
	repoSchema.pre('save', function(next){
		var now = new Date();
		this.updatedAt = now;
		if ( !this.createdAt ) {
			this.createdAt = now;
		}
		next();
	});
	repoSchema.pre('update', function() {
		this.update({
			updatedAt: Date.now()
		});
	});
	
	module.exports = repoSchema;
	
}());