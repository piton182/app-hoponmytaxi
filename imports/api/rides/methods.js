import { Meteor } from 'meteor/meteor';

import { Rides } from './rides.js';


Meteor.methods(
	{
		'rides.update'(ride){
			if (!this.userId){
				throw new Meteor.Error('not-authorized');
			}else{
				Rides.update({_id: ride._id}, ride);		
			}
		}
	}
)