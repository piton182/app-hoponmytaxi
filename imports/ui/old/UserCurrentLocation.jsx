import React, { Component } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import ReactDOM from 'react-dom';

class UserCurrentLocation extends Component {
    constructor(props) {
        super(props);

        const self = this;
        GoogleMaps.ready('mymap', (map) => {
            self.geocoder = new google.maps.Geocoder;

            if (self.props.currentLocation) {
                this.geocodeCurrentLocation(self.props.currentLocation);
                Session.set('currentLocation', self.props.currentLocation);
            }

            $(ReactDOM.findDOMNode(this.refs.streetAddress)).geocomplete()
                .bind("geocode:result", function(event, result) {
                    const location = { lat: result.geometry.location.lat(), lng: result.geometry.location.lng() }
                    self.setState({
                        streetAddress: result.formatted_address,
                        streetAddressSetManually: true,
                        location,
                    });
                    Session.set('currentLocation', location);
                });
        });

        Session.set('currentLocation', this.props.currentLocation);

        this.state = {
            streetAddress: null,
            location: this.props.currentLocation,
        };

        // if (this.props.currentLocation) {
        //     this.geocodeCurrentLocation(this.props.currentLocation);
        // }
    }

    componentDidMount() {

    }

    componentWillReceiveProps(nextProps) {
        if (this.geocoder && !this.state.streetAddressSetManually && nextProps.currentLocation) {
            this.geocodeCurrentLocation(nextProps.currentLocation);
            Session.set('currentLocation', nextProps.currentLocation);
        }

    }

    geocodeCurrentLocation(location) {
        this.geocoder.geocode( { location }, (results, status) => {
            if (status === google.maps.GeocoderStatus.OK) {
                if (results[1]) {
                    this.setState({
                        streetAddress: results[1].formatted_address,
                    })
                } else {
                    // alert('No results found');
                }
            } else {
                // alert('Geocoder failed due to: ' + status);
            }
        })
    }

    handleChangeLocation(event) {
        this.setState({
            streetAddress: event.target.value,
        })
    }

    render() {
        return (<div>
            <span>Your location:</span>
            <input
                type="text"
                ref="streetAddress"
                value={this.state.streetAddress ? this.state.streetAddress : ''}
                onChange={this.handleChangeLocation.bind(this)}
            />
        </div>)
    }
}

export default createContainer(() => {
   return {
       currentLocation: Geolocation.latLng(),
   }
}, UserCurrentLocation);