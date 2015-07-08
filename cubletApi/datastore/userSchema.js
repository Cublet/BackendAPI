(function () {
	'use strict';
	
	var mongoose = require('mongoose'),
		Schema = mongoose.Schema,
		userFeedSchema = require('cubletApi/datastore/userFeedSchema'),
		userActivitySchema = require('cubletApi/datastore/userActivitySchema'),
		
		userSchema = new Schema({
			name: {
				type: String,
				required: true
			},
			username: {
				type: String,
				unique: true,
				required: true
			},
			email: {
				type: String,
				unique: true,
				required: true
			},
			password: String,
			facebookId: {
				type: String,
				unique: true,
				sparse: true,
			},
			googleId: {
				type: String,
				unique: true,
				sparse: true
			},
			createdAt: Date,
			updatedAt: Date,
			following: [{
				type: Schema.Types.ObjectId, 
				ref: 'User'
			}],
			followers: [{
				type: Schema.Types.ObjectId,
				ref: 'User'
			}],
			feed: [userFeedSchema],
			activity: [userActivitySchema],
			repos: [{
				type: Schema.Types.ObjectId,
				ref: 'Repo'
			}]
		});
	
	userSchema.pre('save', function(next){
		var now = new Date();
		this.updatedAt = now;
		if ( !this.createdAt ) {
			this.createdAt = now;
		}
		next();
	});
	userSchema.pre('update', function() {
		this.update({
			updatedAt: Date.now()
		});
	});
	
	module.exports = userSchema;
	
}());