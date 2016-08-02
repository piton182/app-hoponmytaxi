import React, { Component } from 'react';
import { createContainer } from 'meteor/react-meteor-data';

export default class JoinButton extends Component {

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

    handleJoin() {
        const self = this;
        Meteor.call('rides.join', this.props.ride._id,
            (err, res) => {
                if (err) {
                    alert(err.error);
                } else {
                    Session.set('selectedRide', self._ride2model(res));
                }
            }
        );
    }

    render() {
        return <a href="#" onClick={ this.handleJoin.bind(this) }>Join</a>
    }
}