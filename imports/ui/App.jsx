import React, { Component } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import { Mongo } from 'meteor/mongo';

import { Rides } from '../api/rides/rides.js';

import Avatar from './Avatar';
import Ride from './Ride';
import Filter from './Filter';
import InfoBox from './InfoBox';
import JoinButton from './JoinButton';

class App extends Component {
    componentDidMount() {
        console.log('componentDidMount');

        const self = this;
        Tracker.autorun(function () {
            // console.log(Mapbox.loaded());
            if (Mapbox.loaded()) {
                mapboxgl.accessToken = 'pk.eyJ1IjoicGl0b24xODIiLCJhIjoiY2lyZGJ5Nnp4MDA4Y2lrbWdqbzgwdXo1NiJ9.QdZjXpszY-iYWloTm82vWw';
                self.map = new mapboxgl.Map({
                    container: 'map',
                    style: 'mapbox://styles/mapbox/light-v9',
                    center: [18.0686, 59.3293], // Stockholm center
                    zoom: 12.5
                });
                self.map.addControl(new mapboxgl.Navigation());

                self.map.on('load', function() {
                    self.map.on('click', self.clickOnMarker.bind(self));
                    self.map.on('tap', self.clickOnMarker.bind(self));

                    self.map.on('mousemove', function (e) {
                        var features = self.map.queryRenderedFeatures(e.point, { layers: ['points'] });
                        self.map.getCanvas().style.cursor = (features.length) ? 'pointer' : '';
                    });

                    Meteor.setTimeout(() => {
                        Session.set('mapReady', true);
                    }, 500);
                });
            }
        });
    }

    clickOnMarker(event) {
        var features = this.map.queryRenderedFeatures(event.point, { layers: ['points'] });
        if (!features.length) {
            return;
        }
        var feature = features[0];
        this.handleSelectRide(feature.properties);
    }

    handleSelectRide({ rideId }) {
        console.log(rideId);
        Session.set('selectedRideId', rideId);
    }

    refreshPoints() {
        if (this.map.getLayer("points")) {
            this.map.removeLayer("points");
        }
        if (this.map.getSource("points")) {
            this.map.removeSource("points");
        }

        this.map.addSource("points", {
            type: "geojson",
            data: {
                type: "FeatureCollection",
                features: this.props.rides.map((ride) => {
                    return this.ride2point(ride)
                }),
            }
        });
        this.map.addLayer({
            id: "points",
            type: "symbol",
            source: "points",
            layout: {
                "icon-image": "{icon}-15",
                "text-field": "{date}",
                "icon-allow-overlap": true,
                "text-allow-overlap": true,
                "text-font": ["Open Sans Semibold", "Arial Unicode MS Bold"],
                "text-size": 10,
                "text-letter-spacing": 0.05,
                "text-offset": [0, 1.5]
            },
            paint: {
                "text-color": "#202",
                "text-halo-color": "#fff",
                "text-halo-width": 3
            }
        });
    }

    componentDidUpdate() {
        if (this.props.mapReady) {
            console.log('placing markers');
            this.refreshPoints();
        }
    }

    formatDate(unix) {
        return moment.unix(unix).calendar();
    }

    ride2point(ride) {
        return {
            type: "Feature",
            geometry: {
                type: "Point",
                coordinates: [ride.from.location.coordinates[1], ride.from.location.coordinates[0]]
            },
            properties: {
                date: this.formatDate(ride.datetime.unix),
                icon: "car",
                address: ride.from.streetAddress,
                destination: ride.to,
                comment: "",
                price: "200",
                rideId: ride._id.valueOf(),
            }
        }
    }

    render() {
        return (
            <div id="map-page">
                <div id="map"></div>
                <Avatar />
                {/*<div id="map-logo">*/}
                    {/*Taxi Hop-On*/}
                {/*</div>*/}
                <Ride ride={ this.props.selectedRide }/>
                <Filter visible={ !this.props.selectedRide }/>
                <InfoBox visible={ !this.props.selectedRide }/>
                <JoinButton visible={ !!this.props.selectedRide }/>
            </div>
        );
    }
}

export default createContainer(() => {
    Meteor.subscribe('all.rides');
    return {
        rides: Rides.find().fetch(),
        mapReady: Session.get('mapReady'),
        selectedRide: Session.get('selectedRideId') && Rides.findOne(new Mongo.ObjectID(Session.get('selectedRideId'))),
    }
}, App);