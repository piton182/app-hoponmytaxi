import { Meteor } from 'meteor/meteor';

import { Rides } from '../rides.js';

Meteor.methods({
    'rides.get.open.withinRadius'(location, radiusInMeters) {
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
            }).fetch();
        } else {
            return [];
        }
    },
});