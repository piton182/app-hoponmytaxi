import { Meteor } from 'meteor/meteor';

import { Rides } from './rides.js';

Meteor.methods({
	'rides.join'(rideId) {
		console.log('rides.join', rideId);
		if (!Meteor.user()) {
			throw new Meteor.Error('not-authorized');
		}

		// TODO: handle error here
		Rides.update(
			{_id: rideId, $or: [{corider: {$exists: false}}, {corider: ''}, {corider: null}]},
			{$set: {corider: Meteor.user().username}}
		);

		console.log(Rides.findOne(rideId));

		return Rides.findOne(rideId);
	},
});