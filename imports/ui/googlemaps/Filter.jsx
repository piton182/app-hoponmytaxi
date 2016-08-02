import React, { Component } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import ReactDOM from 'react-dom';

export default class Filter extends Component {

    constructor(props) {
        super(props);

        this.geocoder = props.geocoder;
    }

    componentDidMount() {
        this.tryToFixFromLocation(this.props);
    }

    componentDidUpdate() {
        if (this.refs.streetAddress && GoogleMaps.loaded()) {
            $(ReactDOM.findDOMNode(this.refs.streetAddress)).geocomplete()
                .bind("geocode:result", function (event, result) {
                    const location = { lat: result.geometry.location.lat(), lng: result.geometry.location.lng() };
                    Session.set('fromLocation', {
                        location,
                        streetAddress: result.formatted_address,
                        editing: false,
                    });
                    Session.set('selectedRideLoading', true);
                    Session.set('mapCenter', location);
                });
        }

        $(ReactDOM.findDOMNode(this.refs.d)).datepicker();
    }

    componentWillReceiveProps(nextProps) {
        if (!this.geocoder && nextProps.geocoder) {
            this.geocoder = nextProps.geocoder
        }
        this.tryToFixFromLocation(nextProps);

        if (this.geocoder && !nextProps.from.streetAddress) {
            // if there is location to geocode...
            if (nextProps.from.location && nextProps.from.location.lat && nextProps.from.location.lng) {
                this.geocoder.geocode({location: nextProps.from.location}, (results, status) => {
                    if (status === google.maps.GeocoderStatus.OK) {
                        if (results[1]) {
                            Session.set('fromLocation', {
                                ...nextProps.from,
                                streetAddress: results[1].formatted_address
                            });
                        } else {
                            // alert('No results found');
                        }
                    } else {
                        // alert('Geocoder failed due to: ' + status);
                    }
                })
            } else {
                Session.set('fromLocation', {
                    ...nextProps.from,
                    streetAddress: results[1].formatted_address
                });
            }
        }
    }

    tryToFixFromLocation(props) {
        if (!Session.get('fromLocation') && props.from.location && props.from.location.lat && props.from.location.lng) {
            Session.set('fromLocation', props.from);
            Session.set('mapCenter', props.from.location);
        }
    }

    handleChangeFrom() {
        Session.set('fromLocation', {
            ...this.props.from,
            editing: true
        });
    }

    handleSelectAirport(event) {
        console.log('handleSelectAirport');
        Session.set('toLocation', { airport: event.target.value, editing: false });
    }

    handleChangeTo() {
        Session.set('toLocation', { ...this.props.to, editing: true });
    }

    handleChangeWhen() {
        Session.set('when', { ...this.props.when, editing: true });
    }

    formatDate(unix) {
        return moment.unix(unix).calendar();
    }

    composeWhen(d, h, m) {
        return moment(`${d}.${h}.${m}`, 'MM/DD/YYYY.HH.mm').unix();
    }

    decomposeWhen(unix) {
        const m = moment.unix(unix);
        return {
            d: m.format('MM/DD/YYYY'),
            h: s.pad(m.hours(), 2, '0'),
            m: s.pad(m.minutes(), 2, '0'),
        }
    }

    handleWhenOK() {
        const d = this.refs.d.value, h = this.refs.h.value, m = this.refs.m.value;
        Session.set('when', { unix: this.composeWhen(d, h, m), editing: false })
    }

    handleWhenCancel() {
        Session.set('when', { ...this.props.when, editing: false });
    }

    render() {
        return <div>
            <table style={{width: '100%'}}>
            <tbody>
                <tr>
                    <td style={{height: '35px'}}>
                        {/*<a href="#" className="filterLink">Alviksvägen 3</a>*/}
                        { this.props.from.editing
                            ? <input
                                type="text"
                                ref="streetAddress"
                                style={{width: '50%'}}
                                placeholder="From"
                                defaultValue={ this.props.from.streetAddress }
                            />
                            : ( this.props.from.streetAddress
                                ? <span>{ this.props.from.streetAddress }
                                    &nbsp;<a href="#" className="changeLink" onClick={ this.handleChangeFrom.bind(this) }>Change</a>
                                </span>
                                : <img src="/images/spinner.gif" style={{width: '16px', height: '16px'}}/>) }
                    </td>
                </tr>
                <tr>
                    <td style={{height: '35px'}}>
                        { this.props.to.editing
                            ? <select
                                style={{width: '50%'}}
                                value={ this.props.filter.to.airport }
                                onChange={ this.handleSelectAirport.bind(this) }
                            >
                                <option value={ "Arlanda" }>Arlanda</option>
                            </select>
                            : <span>{ this.props.to.airport }
                                {/*&nbsp;<a href="#" className="changeLink" onClick={ this.handleChangeTo.bind(this) }>Change</a>*/}
                            </span> }
                    </td>
                </tr>
                <tr>
                    <td style={{height: '35px'}}>
                        { this.props.when.editing
                            ? <span>
                                <input
                                    type="text"
                                    ref="d"
                                    style={{width: '30%'}}
                                    placeholder="mm/dd/yyyy"
                                    defaultValue={ this.decomposeWhen(this.props.when.unix).d }
                                />
                                <input
                                    type="text"
                                    ref="h"
                                    style={{width: '10%'}}
                                    placeholder="hh"
                                    defaultValue={ this.decomposeWhen(this.props.when.unix).h }
                                />
                                <input
                                    type="text"
                                    ref="m"
                                    style={{width: '10%'}}
                                    placeholder="mm"
                                    defaultValue={ this.decomposeWhen(this.props.when.unix).m }
                                />
                                &nbsp;<a href="#" className="changeLink" onClick={ this.handleWhenOK.bind(this) }>OK</a>
                                &nbsp;|&nbsp;
                                <a href="#" className="changeLink" onClick={ this.handleWhenCancel.bind(this) }>Cancel</a>
                            </span>
                            : <span>{ this.formatDate(this.props.when.unix) }
                                &nbsp;<a href="#" className="changeLink" onClick={ this.handleChangeWhen.bind(this) }>Change</a>
                            </span> }
                    </td>
                </tr>
            </tbody>
            </table>
        </div>;
    }
}