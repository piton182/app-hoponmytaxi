import React, { Component } from 'react';
// import { createContainer } from 'meteor/react-meteor-data';

export default class Filter extends Component {
    render() {
        if (this.props.visible) {
            return <div id="map-filter" className="input-container">
                <div id="map-source">
                    <label for="field-destination">Destination</label>
                    <select id="field-destination">
                        <option>to Arlanda</option>
                        <option>from Arlanda</option>
                    </select>
                    <i className="bar"></i>
                </div>
                <div id="map-datetime">
                    <label for="field-datetime">When</label>
                    <input id="field-datetime" type="datetime-local" placeholder="Anytime"/>
                    <i className="bar"></i>
                </div>
            </div>
        } else {
            return null;
        }
    }
}