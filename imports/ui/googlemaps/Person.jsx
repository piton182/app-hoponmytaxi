import React, { Component } from 'react';
import { createContainer } from 'meteor/react-meteor-data';

export default class Person extends Component {
    render() {
        return <div>
            <table style={{width: '100%'}}>
            <tbody>
                <tr>
                    <td style={{verticalAlign: 'middle', width: '100%', paddingRight: '6px'}}>
                        <div>{ this.props.person.name }</div>
                        <div style={{whiteSpace: 'nowrap'}}>
                            <img
                                src="/images/phone.png"
                                style={{width: '16px', height: '16px', verticalAlign: 'middle', margin: '0 5px 0 0'}}
                            />{ this.props.person.phone }</div>
                    </td>
                    <td>
                        <img src="/images/user.png" style={{width: '48px', height: '48px'}} />
                    </td>
                </tr>
            </tbody>
            </table>
        </div>;
    }
}