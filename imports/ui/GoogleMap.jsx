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
            this.placeMarkers(map.instance, this.props.rides);

        });
    }

    componentWillUnmount() {
        if (GoogleMaps.maps[this.props.name]) {
            google.maps.event.clearInstanceListeners(GoogleMaps.maps[this.props.name].instance);
            delete GoogleMaps.maps[this.props.name];
        }
    }

    componentWillReceiveProps(nextProps) {
        this.removeMarkers();
        this.placeMarkers(GoogleMaps.maps[this.props.name].instance, nextProps.rides);
        if (nextProps.currentLocation) {
            new google.maps.Marker({
                position: this.props.currentLocation,
                map: GoogleMaps.maps[this.props.name].instance,
                icon: {
                    url: 'images/youarehere.png',
                    scaledSize: new google.maps.Size(32, 32),
                    // origin: new google.maps.Point(0, 0),
                },
            });
        }
    }

    placeMarkers(map, rides) {
        const markers = [];
        rides.forEach((ride) => {
            const marker = new google.maps.Marker({
                position: new google.maps.LatLng(
                    ride.from.location.coordinates[0], ride.from.location.coordinates[1]
                ),
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
    return {
        googleMapsLoaded: GoogleMaps.loaded(),
        rides: Rides.find().fetch(),
        currentLocation: Geolocation.latLng(),
    }
}, GoogleMap);