(function () {
	'use strict';
	
	var mongoose = require('mongoose'),
		Schema = mongoose.Schema,
		
		userSchema = new Schema({
			name: String,
			username: String,
			email: String,
			password: String,
			facebookId: String,
			googleId: String,
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
			feed: [{
				action: String,
				reference: Schema.Types.ObjectId
			}],
			repos: [{
				type: Schema.Types.ObjectId,
				ref: 'Repo'
			}]
		});
	
	userSchema.pre('save', function(next){
		now = new Date();
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