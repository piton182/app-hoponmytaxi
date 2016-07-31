import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { createContainer } from 'meteor/react-meteor-data';

import { Rides } from '../api/rides/rides.js';

class GoogleMap extends Component {

    constructor(props) {
        super(props);

        this.state = {
            markers: [],
        };
    }

    refreshRides(userLocation) {
        const self = this;
        Meteor.call('rides.get.open.withinRadius', userLocation, 1000,
            (err, rides) => {
                if (!err) {
                    self.refreshMarkers(rides);
                }
            }
        );
    }

    componentDidMount() {
        GoogleMaps.create({
            name: this.props.name,
            element: ReactDOM.findDOMNode(this),
            options: {
                center: this.getMapCenter(),
                zoom: 12,
            },
        });

        GoogleMaps.ready(this.props.name, (map) => {
            this.infowindow = new google.maps.InfoWindow();

            this.centerMap(this.getMapCenter());
            this.refreshRides(this.props.userLocation);

            if (this.props.userLocation) {
                this.refreshYouAreHereMarker(this.props.userLocation);
            }
        });
    }

    getMapCenter() {
        return this.props.userLocation ? this.props.userLocation : this.props.defaultCenter;
    }

    centerMap(latLng) {
        GoogleMaps.maps[this.props.name].instance.setCenter(latLng);
    }

    refreshMarkers(rides) {
        this.removeMarkers();
        this.placeMarkers(rides);
    }

    componentWillUnmount() {
        if (GoogleMaps.maps[this.props.name]) {
            google.maps.event.clearInstanceListeners(GoogleMaps.maps[this.props.name].instance);
            delete GoogleMaps.maps[this.props.name];
        }
    }

    componentWillReceiveProps(nextProps) {
        this.refreshRides(nextProps.userLocation);
        if (nextProps.userLocation) {
            this.refreshYouAreHereMarker(nextProps.userLocation);
            this.centerMap(nextProps.userLocation);
        }

    }

    refreshYouAreHereMarker(userLocation) {
        this.removeYouAreHereMarker();
        this.placeYouAreHereMarker(userLocation)
    }

    removeYouAreHereMarker() {
        if (this.state.youAreHereMarker) {
            this.state.youAreHereMarker.setMap(null);
            this.setState({
                youAreHereMarker: null,
            })
        }
    }

    placeYouAreHereMarker(userLocation) {
        const youAreHereMarker = new google.maps.Marker({
            position: userLocation,
            map: GoogleMaps.maps[this.props.name].instance,
            icon: {
                url: 'images/youarehere.png',
                scaledSize: new google.maps.Size(32, 32),
            },
        });
        this.setState({
            youAreHereMarker
        })
    }

    placeMarkers(rides) {
        // console.log('placing markers', rides.length);
        const markers = [];
        rides.forEach((ride) => {
            const marker = new google.maps.Marker({
                position: new google.maps.LatLng(
                    ride.from.location.coordinates[0], ride.from.location.coordinates[1]
                ),
                draggable: true,
                map: GoogleMaps.maps[this.props.name].instance,
                title: ride.bkn_ref,
            });
            marker.addListener('click', () => {
                // TODO:
                Session.set('selectedRide', ride);
                this.infowindow.setContent(ride.bkn_ref);
                this.infowindow.open(GoogleMaps.maps[this.props.name].instance, marker);
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
        userLocation: Session.get('currentLocation'),
        selectedRide: Session.get('selectedRide'),
    }
}, GoogleMap);
