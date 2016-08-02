import React, { Component } from 'react';
// import { createContainer } from 'meteor/react-meteor-data';

export default class JoinButton extends Component {

    handleClick() {
        Meteor.call('rides.join', this.props.ride._id,
            (err, res) => {
                Session.set('selectedRideId', res._id.valueOf());
            });
    }

    render() {
        console.log(this.props.ride);
        if (this.props.visible) {
            if (this.props.user) {
                if (this.props.ride && this.props.ride.corider === this.props.user.username) {
                    return <div id="map-btn-join">
                        <span>Joined</span>
                    </div>;
                } else {
                    return <div id="map-btn-join" onClick={ this.handleClick.bind(this) }>
                        <span>Join</span>
                    </div>;
                }
            } else {
                return <div id="map-btn-join">
                    <span>Sign in to join</span>
                </div>;
            }
        } else {
            return null;
        }
    }
}