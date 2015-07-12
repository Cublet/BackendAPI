(function () {
	'use strict';

	var mongoose = require('mongoose'),
		Schema = mongoose.Schema,

		repoCommentSchema = new Schema({
			message: {
				type: String,
				required: true
			},
			createdBy: {
				type: Schema.Types.ObjectId,
				ref: 'User',
				required: true
			},
			upvotes: [{
				type: Schema.Types.ObjectId,
				ref: 'User'
			}],
			createdAt: Date,
			updatedAt: Date,
			under: {
				type: Schema.Types.ObjectId,
				ref: 'Repo',
				required: true
			}
		});

	repoCommentSchema.pre('save', function(next){
		var now = new Date();
		this.updatedAt = now;
		if ( !this.createdAt ) {
			this.createdAt = now;
		}
		next();
	});
	repoCommentSchema.pre('update', function() {
		this.update({
			updatedAt: Date.now()
		});
	});

	module.exports = repoCommentSchema;

}());