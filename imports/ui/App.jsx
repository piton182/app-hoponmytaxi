import React, { Component } from 'react';

import AccountsUIWrapper from './AccountsUIWrapper.jsx';
import MyRidesList from './MyRidesList.jsx';
import RideList from './RideList.jsx';
import RideDetails from './RideDetails.jsx';

export default class App extends Component {
  render() {
    return (
      <div>
        <table>
        <tbody>
          <tr>
            <td><h1>hop-on-my-taxi</h1></td>
            <td style={{textAlign: "right"}}><AccountsUIWrapper /></td>
          </tr>
        </tbody>
        </table>
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
    )
  }
}
