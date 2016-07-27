Meteor.publish('rides', function() {
  return Rides.find();
});
