import React, { Component } from 'react';
// import { createContainer } from 'meteor/react-meteor-data';

export default class Ride extends Component {

    handleClose() {
        Session.set('selectedRideId', null);
    }

    formatDate(unix) {
        return moment.unix(unix).calendar();
    }

    render() {
        if (this.props.ride) {
            return <div id="map-ride-info" className="input-container">
                <div>
                    <span id="map-ride-address" className="header">{ this.props.ride.from.streetAddress }</span>
                    <span id="map-ride-close" className="cross" onClick={ this.handleClose.bind(this) }></span>
                </div>
                <div>
                    <span className="msg">Destination:&nbsp;</span>
                    <span id="map-ride-destination" className="destination">{ this.props.ride.to.name }</span>
                </div>
                <div>
                    <span id="map-ride-date" className="date">{ this.formatDate(this.props.ride.datetime.unix) }</span>
                    <span id="map-ride-price" className="price">200 kr</span>
                </div>
            </div>;
        } else {
            return null;
        }
    }
}