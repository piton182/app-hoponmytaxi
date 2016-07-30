import React, { Component } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import ReactDOM from 'react-dom';

import AccountsUIWrapper from './AccountsUIWrapper.jsx';
import MyRidesList from './MyRidesList.jsx';
import RideList from './RideList.jsx';
import RideDetails from './RideDetails.jsx';
import GoogleMap from './GoogleMap.jsx';

import { Rides } from '../api/rides/rides.js';

class App extends Component {

  _mapOptions() {
    return {
      center: new google.maps.LatLng(59.3293, 18.0686),
      zoom: 12
    };
  }

  renderMap() {
    if (this.props.googleMapsLoaded) {
      return (
        <div>
          { this.props.openRides.length === 0
            ? <span style={{color: "orange"}}>No open rides at the moment within 1km from you</span>
            : <span style={{color: "green"}}>Open rides within 1km from you</span>
          }
          <GoogleMap
            name="mymap"
            options={this._mapOptions()}
          />
        </div>
      )
    }

    return <div>Loading map...</div>;
  }

  render() {
    return (
      <div>
        <div>
          <table>
          <tbody>
            <tr>
              <td>
                <h1>hop-on-my-taxi</h1>
              </td>
              <td>
                <AccountsUIWrapper />
              </td>
            </tr>
          </tbody>
          </table>
        </div>
        <div>
          { this.renderMap() }
        </div>
        <div>
          <table>
          <tbody>
            <tr>
              <td></td>
              <td>
                <MyRidesList />
              </td>
            </tr>
            <tr>
              <td style={{border: "5px solid pink"}}><RideList /></td>
              <td style={{border: "5px solid green"}}><RideDetails /></td>
            </tr>
          </tbody>
          </table>
        </div>
      </div>
    )
  }
}

export default createContainer(() => {
  Meteor.subscribe('open.rides.withinRadius', Geolocation.latLng(), 1000);

  return {
    googleMapsLoaded: GoogleMaps.loaded(),
    openRides: Rides.find( { $or: [
      { corider: { $exists: false } },
      { corider: '' }
    ] } ).fetch(),
  }
}, App);
