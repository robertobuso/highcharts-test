import React, { Component } from 'react';
import {finalResultsData} from '../Adapters'

const netResult = finalResultsData['t3'] - finalResultsData['stop']

const totalResult = finalResultsData['t3'] + finalResultsData['stop'] + finalResultsData['break even'] + finalResultsData['unfilled']

class ResultsTable extends Component {
    render() {
      return (
        <>
          <br/>
          <table>
          <thead>
          <tr>
            <th style={ {fontSize:'24px', color:'green'} }>NET</th>
            <th></th>
            <th style={ {fontSize:'24px', color:'green'} }>{netResult}</th>
          </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <br/>
              </td>
            </tr>
            <tr style={{textAlign:'center'}}>
              <td>T3</td>
              <td></td>
              <td>{finalResultsData['t3']}</td>
            </tr>
            <tr style={{textAlign:'center'}}>
              <td>Break Even</td>
              <td></td>
              <td>{finalResultsData['break even']}</td>
            </tr>
            <tr style={{textAlign:'center'}}>
              <td>Stop</td>
              <td></td>
              <td>{finalResultsData['stop']}</td>
            </tr>
            <tr style={{textAlign:'center'}}>
              <td>Unfilled</td>
              <td></td>
              <td>{finalResultsData['unfilled']}</td>
            </tr>
            <tr>
              <td>
                <br/>
              </td>
            </tr>
            <tr style={{textAlign:'center'}}>
              <td>Total</td>
              <td></td>
              <td>{totalResult}</td>
            </tr>
            </tbody>
          </table>
          </>
      )
  }
}

  export default ResultsTable;
