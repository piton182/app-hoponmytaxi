import React, { Component } from 'react';

import { createContainer } from 'meteor/react-meteor-data';

import { Rides } from '../api/rides.js';

class RideList extends Component {

  handleSelectRide(ride) {
    this.setState({
      selectedRide: ride,
    })

    Session.set('selectedRide', ride);
  }

  renderRides() {
    return this.props.rides.map((ride) => {
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
        { this.props.rides.length === 0
          ? <span style={{color: "orange"}}>No available rides for given params...</span>
          : <div>
              <span>Rides:</span>
              { this.renderRides() }
            </div> }
      </div>
    )
  }
}

export default createContainer(() => {
  return {
    selectedRide: Session.get('selectedRide'),
    rides: Rides.find({}).fetch(),
  }
}, RideList);
