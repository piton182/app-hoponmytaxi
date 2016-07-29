import React, { Component } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import ReactDOM from 'react-dom';

import AccountsUIWrapper from './AccountsUIWrapper.jsx';
import MyRidesList from './MyRidesList.jsx';
import RideList from './RideList.jsx';
import RideDetails from './RideDetails.jsx';

class App extends Component {

  _mapOptions() {
    return {
      center: new google.maps.LatLng(59.3293, 18.0686),
      zoom: 13
    };
  }

  renderMap() {
    if (this.props.googleMapsLoaded) {
      return (
        <GoogleMap
          name="mymap"
          options={this._mapOptions()}
        />
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
  return {
    googleMapsLoaded: GoogleMaps.loaded(),
  }
}, App);

GoogleMap = React.createClass({
  // propTypes: {
  //   name: React.PropTypes.string.isRequired,
  //   options: React.PropTypes.object.isRequired
  // },
  getInitialState() {
    return {
      marker: null,
    }
  },
  componentDidMount() {
    GoogleMaps.create({
      name: this.props.name,
      element: ReactDOM.findDOMNode(this),
      options: this.props.options
    });

    // GoogleMaps.ready(this.props.name, function(map) {
    //   var marker = new google.maps.Marker({
    //     position: map.options.center,
    //     map: map.instance
    //   });
    // });
  },
  componentWillUnmount() {
    if (GoogleMaps.maps[this.props.name]) {
      google.maps.event.clearInstanceListeners(GoogleMaps.maps[this.props.name].instance);
      delete GoogleMaps.maps[this.props.name];
    }
  },
  componentWillReceiveProps(nextProps) {
    // console.log('googlemap.componentWillReceiveProps')
    const map = GoogleMaps.maps[this.props.name];
    if (map && nextProps.marker.lat && nextProps.marker.lng) {
      if (this.state.marker) {
        this.state.marker.setMap(null);
      }
      const marker = new google.maps.Marker({
        position: {...nextProps.marker},
        map: map.instance,
      });
      this.setState({
        marker
      });
    }
  },
  render() {
    return <div className="map-container"></div>;
  }
});
