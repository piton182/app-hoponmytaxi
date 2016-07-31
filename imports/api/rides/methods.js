import { Meteor } from 'meteor/meteor';

import { Rides } from './rides.js';

Meteor.methods({
	'rides.join'(rideId) {
		if (!Meteor.user()) {
			throw new Meteor.Error('not-authorized');
		}

		// TODO: handle error here
		Rides.update(
			{_id: rideId, $or: [{corider: {$exists: false}}, {corider: ''}]},
			{$set: {corider: Meteor.user().username}}
		);

		return Rides.findOne(rideId);
	},
});