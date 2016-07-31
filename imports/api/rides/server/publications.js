import { Meteor } from 'meteor/meteor';

import { Rides } from '../rides.js';

Meteor.publish('my.rides', function() {
  const currentUser = Meteor.users.findOne(this.userId);
  if (currentUser) {
    return Rides.find({
      corider: currentUser.username
    })
  } else {
    return [];
  }
});