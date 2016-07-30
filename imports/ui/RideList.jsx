import React, { Component } from 'react';

import { createContainer } from 'meteor/react-meteor-data';

import { Rides } from '../api/rides/rides.js';

class RideList extends Component {

  handleSelectRide(ride) {
    this.setState({
      selectedRide: ride,
    })

    Session.set('selectedRide', ride);
  }

  renderRides(rides) {
    return rides.map((ride) => {
      const style = this.props.selectedRide && this.props.selectedRide._id.valueOf() === ride._id.valueOf() ? {backgroundColor: "yellow"} : {};
      return <p key={ride._id.valueOf()}>
        <a href="#"
          onClick={this.handleSelectRide.bind(this, ride)}
          style={style}>
          {ride.bkn_ref}
        </a>
      </p>
    });
  }

  render() {
    return (
      <div>
        { this.props.openRides.length === 0
          ? <span style={{color: "orange"}}>No available rides for given params...</span>
          : <div>
              <span>Rides:</span>
              { this.renderRides(this.props.openRides) }
            </div> }
      </div>
    )
  }
}

export default createContainer(() => {
  Meteor.subscribe('open.rides.withinRadius', Geolocation.latLng(), 1000);

  return {
    selectedRide: Session.get('selectedRide'),
    openRides: Rides.find( { $or: [
      { corider: { $exists: false } },
      { corider: '' }
    ] } ).fetch(),
  }
}, RideList);
