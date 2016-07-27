import { Meteor } from 'meteor/meteor';

import { Rides } from '../rides.js';

Meteor.publish('rides', function() {
  return Rides.find();
});
