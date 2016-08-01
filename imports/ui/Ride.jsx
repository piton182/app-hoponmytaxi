import React, { Component } from 'react';
import { createContainer } from 'meteor/react-meteor-data';

import RideDetails from './RideDetails.jsx';
import CloseRideButton from './CloseRideButton.jsx';

export default class Ride extends Component {
    render() {
        if (this.props.ride && !_.isEqual(this.props.ride, {})) {
            return <div>
                <table style={{width: '100%', height: '100%'}}>
                    <tbody>
                    <tr>
                        <td style={{width: '100%', verticalAlign: 'top', padding: '16px 16px 0 0'}}>
                            <CloseRideButton callback={ this.props.closeCallback }/>
                        </td>
                        <td style={{}}>
                            <RideDetails ride={ this.props.ride }/>
                        </td>
                    </tr>
                    </tbody>
                </table>
            </div>;
        } else {
            if (this.props.loading) {
                return <img src="/images/spinner.gif" />
            } else if (this.props.ride) {
                return <span>Feeling lonely <img src="/images/sadface.png" style={{width: '48px', height: '48px'}} /></span>
            } else {
                return null;
            }
        }
    }
}