(function () {
	'use strict';

	var mongoose = require('mongoose'),
		Schema = mongoose.Schema,

		forumCommentSchema = new Schema({
			message: String,
			createdBy: {
				type: Schema.Types.ObjectId, 
				ref: 'User'
			},
			createdAt: Date,
			updatedAt: Date,
			under: {
				type: Schema.Types.ObjectId,
				ref: 'Forum'
			}
		});

	forumCommentSchema.pre('save', function(next){
		now = new Date();
		this.updatedAt = now;
		if ( !this.createdAt ) {
			this.createdAt = now;
		}
		next();
	});
	forumCommentSchema.pre('update', function(next) {
		this.update({
			updatedAt: Date.now()
		});
		next();
	});

	module.exports = forumCommentSchema;

}());