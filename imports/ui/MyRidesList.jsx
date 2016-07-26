import React, { Component } from 'react';

import { createContainer } from 'meteor/react-meteor-data';

import { Rides } from '../api/rides.js';

class MyRidesList extends Component {

  handleSelectRide(ride) {
    Session.set('selectedRide', ride);
  }

  renderMyRides() {
    return (this.props.myRides.map((ride) => {
      const style = this.props.selectedRide && this.props.selectedRide._id.valueOf() === ride._id.valueOf() ? {backgroundColor: 'yellow'} : {};
      return <span key={ride._id.valueOf()} style={style}>
        <a href="#" onClick={this.handleSelectRide.bind(this, ride)}>{ride.bkn_ref}</a>
        &nbsp;|&nbsp;
      </span>;
    }));
  }

  render() {
    return (
      <div>
        { this.props.currentUser
          ? <div>
              { this.props.myRides.length === 0
                ? <span style={{color: "orange"}}>You have no active rides at the moment</span>
                : <div>
                    <span>My rides:&nbsp;</span>
                    { this.renderMyRides() }
                  </div>
              }
            </div>
          : ''}
      </div>
    )
  }
}

export default createContainer(() => {
  return {
    selectedRide: Session.get('selectedRide'),
    currentUser: Meteor.user(),
    myRides: Meteor.user() ? Rides.find({corider: Meteor.user().username}).fetch() : [],
  }
}, MyRidesList);
