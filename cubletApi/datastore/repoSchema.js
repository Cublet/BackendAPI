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
			code: {
				type: String,
				required: true
			},
			comments: [repoCommentSchema],
			followedBy: [{
				type: Schema.Types.ObjectId,
				ref: 'User'
			}],
			createdBy: {
				type: Schema.Types.ObjectId,
				ref: 'User',
				required: true
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