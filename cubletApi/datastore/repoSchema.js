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
			createdAt: Date,
			updatedAt: Date
		});
	
	repoSchema.pre('save', function(next){
		now = new Date();
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