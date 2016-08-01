import React, { Component } from 'react';
import { createContainer } from 'meteor/react-meteor-data';

import Map from './Map.jsx';
import Me from './Me.jsx';
import Filter from './Filter.jsx';
import Ride from './Ride.jsx';
import JoinButton from './JoinButton.jsx';

class App extends Component {

    constructor(props) {
        super(props);

        Session.set('selectedRideLoading', true);

        this.callbacks = {
            closeRideCallback: () => {
                Session.set('selectedRide', {});
            }
        };
    }

    render() {
        return <div style={{width: '100%'}}>
            {/*border: '5px solid red',*/}
            <div style={{height: '400px'}}>
                { this.props.googleMapsLoaded
                    ? <Map
                        center={ this.props.mapCenter }
                        fromLocation={ this.props.fromLocation.location }
                    />
                    : <img src="/images/spinnner.gif" /> }
            </div>
            <table style={{width: '100%', borderCollapse: 'collapse'}}>
            <tbody>
                <tr>
                    {/*border: '5px solid blue',*/}
                    <td style={{padding: '5px', width: '50%', verticalAlign: 'top'}}>
                        <Me />
                        <Filter
                            geocoder={ this.props.geocoder }
                            from={ this.props.fromLocation }
                            to={ this.props.toLocation }
                            when={ this.props.when }
                        />
                        { this.props.currentUser
                            ? <a href="#">Share ride</a>
                            : <span style={{color: 'red'}}>Sign in to share rides</span> }
                    </td>
                    {/*border: '5px solid yellow',*/}
                    <td style={{padding: '5px', textAlign: 'right', verticalAlign: 'top'}}>
                        <Ride
                            ride={ this.props.selectedRide }
                            loading={ this.props.selectedRideLoading }
                            closeCallback={ this.callbacks.closeRideCallback }/>
                        { this.props.currentUser
                            ? ( !this.props.selectedRideLoading && this.props.selectedRide && !_.isEqual(this.props.selectedRide, {})
                                ? ( this.props.selectedRide.corider === this.props.currentUser.username
                                    ? <span style={{color: 'lightgreen'}}>Joined</span>
                                    : <JoinButton ride={ this.props.selectedRide } /> )
                                : null )
                            : ( !this.props.selectedRideLoading && this.props.selectedRide && !_.isEqual(this.props.selectedRide, {})
                                ? <span style={{color: 'red'}}>Sign in to join</span>
                                : null )
                        }
                    </td>
                </tr>
            </tbody>
            </table>
        </div>
    }
}

export default createContainer(() => {
    return {
        googleMapsLoaded: GoogleMaps.loaded(),
        autoDetectedCurrentLocation: Session.get('autoDetectedCurrentLocation'),
        fromLocation: Session.get('fromLocation') || { location: Session.get('autoDetectedCurrentLocation') || '', editing: false },
        toLocation: Session.get('toLocation') || { airport: 'Arlanda', editing: false },
        when: Session.get('when') || { unix: moment().unix(), editing: false },
        mapCenter: Session.get('mapCenter') || Session.get('autoDetectedCurrentLocation') || {lat: 59.3293, lng: 18.0686},
        selectedRide: Session.get('selectedRide'),
        selectedRideLoading: Session.get('selectedRideLoading'),
        geocoder: GoogleMaps.loaded() && new google.maps.Geocoder,
        currentUser: Meteor.user(),
    }
}, App);