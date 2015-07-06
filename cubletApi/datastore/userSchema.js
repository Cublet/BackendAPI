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
			editedAt: {
				type: Date, 
				default: Date.now
			},
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
	
	module.exports = userSchema;
	
}());