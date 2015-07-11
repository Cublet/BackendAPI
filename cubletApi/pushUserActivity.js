(function () {
	'use strict';

	var async = require('async'),
		lodash = require('lodash'),

		userModel = require('cubletApi/datastore/userModel');

	/**
	* Stores a user activity done by a user <publisherId> and notifies 
	*	user/s with <subscriber-id/s>.
	* @param {number} publisherId - ID of User who committed the activity
	* @param {number|array} subscriberId - ID/s of User/s who should be 
	*	notified of the activity
	* @param {Object} activity - Must follow the userActivitySchema.
	*	action: past-tense verb 
	*		e.g. followed, upvoted, created, wrote, commented
	*	reference: _id of Model the activity has targeted 
	*		e.g. 1923f, f12esds
	* @param {Function} callable - Function to call back when activity 
	*	has succesfully been pushed.
	*/
	function pushUserActivity(publisherId, subscriberId, activity, callable) {
		var subscribers = [],
			callablePresent = lodash.isFunction(callable),
			activityObject;

		if (lodash.isArray(subscriberId)) {
			subscribers = lodash.clone(subscriberId);
		} else {
			subscribers.push(subscriberId);
		}

		if (!lodash.isObject(activity) || 
			!activity.title || 
			!activity.reference || 
			!activity.referenceTitle) {
			if (callablePresent) {
				return callable(new Error("Invalid activity object"));
			}

			activityObject = lodash.clone(activity);
			activityObject.createdAt = new Date();
		}

		async.parallel({

			/*
				Publish the activity in the publisher's own activity timeline
			*/
			publisherTask: function (callback) {
				userModel.findOne({_id: publisherId}, function (err, userDoc) {
					if (err) {
						return callback(err);	
					}
					if (!userDoc) {
						return callback(new Error("Cannot find publisher"));	
					}
					
					userDoc.activity.push(activityObject);
					userDoc.save();
					callback(null, userDoc);
				});
			},

			/*
				Iterate through all the users subscribing to the publisher 
				and push the activity on their feeds.
			*/
			subscriberTask: function (callback) {
				var feedObject = lodash.clone(activityObject);
				feedObject.from = publisherId;
				
				async.forEachOf(subscribers, 
								function (subscriber, index, callback) {
					userModel.findOne({_id: subscriber}, 
									  function (err, userDoc) {
						if (err) {
							return callback(err);
						}
						if (!userDoc) {
							return callback(new Error("Cannot find user - " + 
													  subscriber));
						}
						
						userDoc.feed.push(feedObject);
						userDoc.save();
						callback();
					});
				}, function (err) {
					if (err) {
						return callback(err);	
					}

					callback();
				});
			}

		}, function (err, results) {
			if (!callablePresent) {
				return;
			}

			if (err) {
				return callable(err);	
			}
			callable();
		});
	}

	module.exports = pushUserActivity;

}());