import React from 'react';
import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';

import './main.html';

import App from '../../ui/App.jsx';

Meteor.startup(() => {
    // loading Google Maps API
    // GoogleMaps.load({
    //     key: 'AIzaSyAMUsNldKIjKx7FDU_NwrGYi9BXwxN-DLY',
    //     libraries: 'places'  // also accepts an array if you need more than one
    // });

    Mapbox.load({
        gl: true,
        // plugins: ['minimap', 'markercluster']
    });

    render(<App />, document.getElementById('render-target'));

    // Tracker.autorun(() => {
    //     Session.set('autoDetectedCurrentLocation', Geolocation.latLng());
    // });
});
