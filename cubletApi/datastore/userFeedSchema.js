(function () {
	'use strict';
	
	/**
	* userFeedSchema is an atomic structure of a user activity 
	*	(and as such, follows the userActivitySchema)
	* 	done by a user who the owner of this feed is following.
	*
	* This is done for performance - there will be more reads 
	*	than writes. Check out the VMWare Article on "How Instagram 
	*	Feeds Work: Celery and RabbitMQ" for more information
	*/
	var mongoose = require('mongoose'),
		Schema = mongoose.Schema,
		
		userFeedSchema = new Schema({
			from: Schema.Types.ObjectId,
			action: String,
			reference: Schema.Types.ObjectId,
			createdAt: Date
		});

	module.exports = userFeedSchema;

}());