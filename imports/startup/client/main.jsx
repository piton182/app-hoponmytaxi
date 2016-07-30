import React from 'react';
import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';

import './main.html';

import App from '../../../imports/ui/App.jsx';

Meteor.startup(() => {
  render(<App />, document.getElementById('render-target'));

  // loading Google Maps API
  GoogleMaps.load({
    key: 'AIzaSyAMUsNldKIjKx7FDU_NwrGYi9BXwxN-DLY',
    libraries: 'places'  // also accepts an array if you need more than one
  });

  Tracker.autorun(() => {
    if (Geolocation.latLng()) {
      console.log('currentLocation', Geolocation.latLng());
    }
  });
});
