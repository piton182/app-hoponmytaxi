import React, { Component } from 'react';
import { createContainer } from 'meteor/react-meteor-data';

import Person from './Person.jsx';

export default class RideDetails extends Component {
    formatDate(datetime) {
        return moment.unix(datetime.unix).calendar();
    }

    render() {
        return <div>
            <Person person={ this.props.ride.owner } />
            <table style={{width: '100%'}}>
            <tbody>
                <tr>
                    <td style={{height: '35px'}}>
                        <span>{ this.props.ride.from }</span>
                    </td>
                </tr>
                <tr>
                    <td style={{height: '35px', whiteSpace: 'nowrap'}}>
                        <span>{ this.props.ride.to }</span>
                    </td>
                </tr>
                <tr>
                    <td style={{height: '35px', whiteSpace: 'nowrap'}}>
                        <span>{ this.formatDate(this.props.ride.when) }</span>
                    </td>
                </tr>
            </tbody>
            </table>
        </div>;
    }
}