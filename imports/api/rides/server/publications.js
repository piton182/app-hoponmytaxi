import { Meteor } from 'meteor/meteor';

import { Rides } from '../rides.js';

Meteor.publish('open.rides.withinRadius', function(location, radiusInMeters) {
  if (location && location.lat && location.lng) {
    const center = [location.lat, location.lng];
    return Rides.find({
      $and: [
        {
          $or: [
            {corider: {$exists: false}},
            {corider: null},
            {corider: ''}
          ]
        },
        {
          'from.location': {
            $nearSphere: {
              $geometry: {
                type: 'Point',
                coordinates: center
              },
              $maxDistance: radiusInMeters
            }
          }
        }
      ]
    });
  } else {
    return [];
  }
});

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