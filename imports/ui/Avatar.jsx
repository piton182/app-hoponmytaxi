import React, { Component } from 'react';
// import { createContainer } from 'meteor/react-meteor-data';

import AccountsUIWrapper from './AccountsUIWrapper';

export default class Avatar extends Component {
    render() {
        return <div style={{padding: '0 0 100px 0'}}>
            { this.props.user
                ? <div id="map-profile"></div>
                : null }
            <AccountsUIWrapper />
        </div>;
    }
}
