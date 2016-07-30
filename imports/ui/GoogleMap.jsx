import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { createContainer } from 'meteor/react-meteor-data';

import { Rides } from '../api/rides/rides.js';

class GoogleMap extends Component {

    constructor(props) {
        super(props);

        this.state = {
            markers: [],
        }
    }

    componentDidMount() {
        GoogleMaps.create({
            name: this.props.name,
            element: ReactDOM.findDOMNode(this),
            options: this.props.options,
        });

        GoogleMaps.ready(this.props.name, (map) => {
            this.infowindow = new google.maps.InfoWindow();
            this.removeMarkers();
            this.placeMarkers(map.instance, this.props.openRides);
            if (this.props.currentLocation) {
                map.instance.setCenter(this.props.currentLocation);
                this.placeYouAreHereMarker(map.instance, this.props.currentLocation);
            }
        });
    }

    componentWillUnmount() {
        if (GoogleMaps.maps[this.props.name]) {
            google.maps.event.clearInstanceListeners(GoogleMaps.maps[this.props.name].instance);
            delete GoogleMaps.maps[this.props.name];
        }
    }

    componentWillReceiveProps(nextProps) {
        // console.log('rides', nextProps.openides);
        this.removeMarkers();
        const map = GoogleMaps.maps[this.props.name];
        this.placeMarkers(map.instance, nextProps.openRides);
        if (nextProps.currentLocation) {
            map.instance.setCenter(nextProps.currentLocation);
            this.placeYouAreHereMarker(map.instance, nextProps.currentLocation);
        }
    }

    placeYouAreHereMarker(map, position) {
        new google.maps.Marker({
            position,
            map,
            icon: {
                url: 'images/youarehere.png',
                scaledSize: new google.maps.Size(32, 32),
            },
        });
    }

    placeMarkers(map, rides) {
        // console.log('placing markers', rides.length);
        const markers = [];
        rides.forEach((ride) => {
            const marker = new google.maps.Marker({
                position: new google.maps.LatLng(
                    ride.from.location.coordinates[0], ride.from.location.coordinates[1]
                ),
                draggable: true,
                map,
                title: ride.bkn_ref,
            });
            marker.addListener('click', () => {
                Session.set('selectedRide', ride);
                this.infowindow.setContent(ride.bkn_ref);
                this.infowindow.open(map, marker);
            });
            markers.push(marker);
        });
        this.setState({
            markers
        });
    }

    removeMarkers() {
        console.log('removing markers', this.state.markers);
        this.state.markers.forEach((marker) => {
            marker.setMap(null);
        });
        this.setState({
            markers: [],
        })
    }

    render() {
        return (
            <div className="map-container" />
        );
    }
}

export default createContainer(() => {
    Meteor.subscribe('open.rides.withinRadius', Geolocation.latLng(), 1000);

    return {
        googleMapsLoaded: GoogleMaps.loaded(),
        currentLocation: Geolocation.latLng(),
        openRides: Rides.find( { $or: [
            { corider: { $exists: false } },
            { corider: '' }
        ] } ).fetch(),
    }
}, GoogleMap);
