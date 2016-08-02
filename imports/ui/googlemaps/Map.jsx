import React, { Component } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import ReactDOM from 'react-dom';

export default class Map extends Component {

    constructor(props) {
        super(props);

        this.state = {
            fromMarker: null,
            rideMarkers: [],
        }
    }

    componentDidMount() {
        GoogleMaps.create({
            name: "map",
            element: ReactDOM.findDOMNode(this),
            options: {
                center: this.props.center,
                zoom: 12,
            },
        });

        GoogleMaps.ready("map", (map) => {
            this.map = map.instance;
            this.refreshFromMarker(this.props.fromLocation);
            this.refreshRideMarkers(this.props.fromLocation);
        });
    }

    refreshFromMarker(location) {
        this.removeFromMarker();
        if (location) {
            this.placeFromMarker(location)
        }
    }

    removeFromMarker() {
        if (this.state.fromMarker) {
            this.state.fromMarker.setMap(null);
            this.setState({
                fromMarker: null,
            })
        }
    }

    placeFromMarker(location) {
        const fromMarker = new google.maps.Marker({
            position: location,
            map: this.map,
            icon: {
                url: 'images/youarehere.png',
                scaledSize: new google.maps.Size(32, 32),
            },
        });
        this.setState({
            fromMarker
        })
    }

    refreshRideMarkers(location) {
        this.removeRideMarkers();
        if (location) {
            const self = this;
            Meteor.call('rides.get.open.withinRadius', location, 10000,
                (err, rides) => {
                    if (!err) {
                        self.placeRideMarkers(rides);
                        if (rides.length > 0) {
                            Session.set('selectedRideLoading', true);
                            // select nearest ride to suggest
                            Meteor.setTimeout(() => {
                                Session.set('selectedRide', self._ride2model(rides[0]));
                                Session.set('selectedRideLoading', false);
                            }, 1000);
                        } else {
                            Meteor.setTimeout(() => {
                                Session.set('selectedRide', {});
                                Session.set('selectedRideLoading', false);
                            }, 1000);
                        }
                    }
                }
            );
        }
    }

    removeRideMarkers() {
        this.state.rideMarkers.forEach((marker) => {
            marker.setMap(null);
        });
        this.setState({
            markers: [],
        })
    }

    _ride2model(ride) {
        return {
            _id: ride._id,
            owner: {
                name: ride.name,
                phone: ride.phone,
            },
            from: ride.from.streetAddress,
            to: ride.to.name,
            when: ride.datetime,
            corider: ride.corider,
        }
    }

    placeRideMarkers(rides) {
        const rideMarkers = [];
        rides.forEach((ride) => {
            const marker = new google.maps.Marker({
                position: new google.maps.LatLng(
                    ride.from.location.coordinates[0], ride.from.location.coordinates[1]
                ),
                draggable: true,
                map: this.map,
                title: ride.bkn_ref,
            });
            marker.addListener('click', () => {
                Session.set('selectedRide', this._ride2model(ride));
                // this.infowindow.setContent(ride.bkn_ref);
                // this.infowindow.open(GoogleMaps.maps[this.props.name].instance, marker);
            });
            rideMarkers.push(marker);
        });
        this.setState({
            rideMarkers
        });
    }

    componentWillReceiveProps(nextProps) {
        // console.log('componentWillReceiveProps', nextProps);
        if (this.map) {
            // if (!_.isEqual(this.props.center, nextProps.center)) {
            this.centerMap(nextProps.center);
            // }
            if (!_.isEqual(this.props.fromLocation, nextProps.fromLocation)) {
                this.refreshFromMarker(nextProps.fromLocation);
                this.refreshRideMarkers(nextProps.fromLocation);
            }
        } else {
            Session.set('mapCenter', nextProps.center);
        }
    }

    centerMap(center) {
        this.map.setCenter(center);
    }

    render() {
        return (
            <div className="map-container"/>
        );
    }
}
