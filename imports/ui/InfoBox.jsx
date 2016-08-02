import React, { Component } from 'react';
// import { createContainer } from 'meteor/react-meteor-data';

export default class InfoBox extends Component {
    render() {
        if (this.props.visible) {
            return <div id="map-info-box">
                <span>Tap on markers to choose a ride</span>
            </div>;
        } else {
            return null;
        }
    }
}
