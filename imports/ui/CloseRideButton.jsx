import React, { Component } from 'react';
import { createContainer } from 'meteor/react-meteor-data';

export default class JoinButton extends Component {
    handleClick() {
        Meteor.setTimeout(this.props.callback, 300);
    }

    render() {
        return <img
            src="/images/close.svg"
            style={{width: '24px', height: '24px', cursor: 'pointer'}}
            onClick={ this.handleClick.bind(this) }
        />;
    }
}