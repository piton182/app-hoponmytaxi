import React, { Component } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import ReactDOM from 'react-dom';

import AccountsUIWrapper from '../AccountsUIWrapper.jsx';
import MyRidesList from './MyRidesList.jsx';
import RideList from './RideList.jsx';
import RideDetails from './RideDetails.jsx';
import GoogleMap from './GoogleMap.jsx';
import UserCurrentLocation from './UserCurrentLocation.jsx';

import { Rides } from '../../api/rides/rides.js';

class App extends Component {

  constructor(props) {
    super(props);


  }

  componentWillReceiveProps(nextProps) {

  }

  renderMap() {
    if (this.props.googleMapsLoaded) {
      return (
        <div>
          {/*{ this.props.rides.length === 0*/}
            {/*? (this.props.userLocation*/}
                {/*? <span style={{color: "orange"}}>No open rides at the moment within 1km from you</span>*/}
                {/*: <span style={{color: "orange"}}>No open rides at the moment within 1km from city center</span>)*/}
            {/*: <span style={{color: "green"}}>Open rides within 1km from you</span>*/}
          {/*}*/}
          <GoogleMap
            name="mymap"
            defaultCenter={new google.maps.LatLng(59.3293, 18.0686)}
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
          <UserCurrentLocation />
        </div>
        <div>
          <table>
          <tbody>
            <tr>
              {/*<td></td>*/}
              <td>
                <MyRidesList />
              </td>
            </tr>
            <tr>
              {/*<td style={{border: "5px solid pink"}}><RideList /></td>*/}
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
  return {
    googleMapsLoaded: GoogleMaps.loaded(),
    userLocation: Session.get('currentLocation'),
    rides: [],
  }
}, App);
