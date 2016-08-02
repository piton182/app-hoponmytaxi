import React, { Component } from 'react';
// import { createContainer } from 'meteor/react-meteor-data';

export default class JoinButton extends Component {
    render() {
        if (this.props.visible) {
            return <div id="map-btn-join" className="active">
                <span>Join</span>
            </div>;
        } else {
            return null;
        }
    }
}