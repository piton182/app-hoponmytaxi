import React, { Component } from 'react';

import { createContainer } from 'meteor/react-meteor-data';

import { Rides } from '../api/rides/rides.js';

class RideDetails extends Component {
  isMyRide(ride) {
    return ride.corider === Meteor.user().username;
  }

  handleJoinRide() {
    if (this.props.currentUser) {
      const ride = this.props.selectedRide;
      ride.corider = this.props.currentUser.username;
      Meteor.call('rides.update', ride,
        (err, res) => {
          if(err){
          }else{
            Session.set('selectedRide', ride)
          }
        })
    }
  }

  formatDatetime(unix) {
    return moment.unix(unix).format('MM/DD/YYYY HH:mm');
  }

  render() {
    const ride = this.props.selectedRide;
    return (
      <div>
        { ride
          ? <div>
              <h3>Ride #{ride.bkn_ref}</h3>
              <table>
              <tbody>
                <tr>
                  <td>Name</td><td>{ride.name}</td>
                </tr>
                <tr>
                  <td>Phone</td><td>{ride.phone}</td>
                </tr>
                <tr>
                  <td>Date/time</td><td>{this.formatDatetime(ride.datetime.unix)}</td>
                </tr>
                <tr>
                  <td>From</td><td>{ride.from}</td>
                </tr>
                <tr>
                  <td>To</td><td>{ride.to.name}</td>
                </tr>
                <tr>
                  <td>Co-rider</td>
                  <td>{ride.corider}</td>
                </tr>
                <tr>
                  <td colSpan="2" style={{textAlign: "right"}}>
                    { this.props.currentUser
                      ? <div>
                          { this.isMyRide(ride)
                            ? <span style={{color: "lightgreen"}}>Joined</span>
                          : <button onClick={this.handleJoinRide.bind(this)}>Join</button> }
                        </div>
                      : <div>
                          <span>(Sign in to join)</span>
                          <button disabled="true">Join</button>
                        </div> }
                  </td>
                </tr>
              </tbody>
              </table>
            </div>
          : <div>
              <span>Select a ride</span>
            </div>}
      </div>
    )
  }
}

export default createContainer(() => {
  return {
    selectedRide: Session.get('selectedRide'),
    currentUser: Meteor.user(),
  }
}, RideDetails);
