import React, { Component } from 'react';
import { createContainer } from 'meteor/react-meteor-data';

import AccountsUIWrapper from './AccountsUIWrapper.jsx';

class Me extends Component {
    render() {
        return <div>
            <table style={{width: '100%'}}>
                <tbody>
                <tr>
                    <td style={{verticalAlign: 'middle'}}>
                        <img src="/images/user.png" style={{width: '48px', height: '48px'}} />
                    </td>
                    <td style={{verticalAlign: 'middle', width: '100%', paddingLeft: '6px'}}>
                        <div><AccountsUIWrapper /></div>
                        { this.props.currentUser
                            ? <div>
                                <img
                                    src="/images/phone.png"
                                    style={{width: '16px', height: '16px', verticalAlign: 'middle', margin: '0 5px 0 0'}}
                                />
                                <span>0701234567</span>
                            </div>
                            : null }
                    </td>
                </tr>
                </tbody>
            </table>
        </div>;
    }
}

export default createContainer(() => {
    return {
        currentUser: Meteor.user(),
    }
}, Me);