import React, { Component } from 'react';

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
            <th style={ {fontSize:'24px', color:'green'} }>1</th>
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
              <td>4</td>
            </tr>
            <tr style={{textAlign:'center'}}>
              <td>Break Even</td>
              <td></td>
              <td>1</td>
            </tr>
            <tr style={{textAlign:'center'}}>
              <td>Stop</td>
              <td></td>
              <td>2</td>
            </tr>
            <tr style={{textAlign:'center'}}>
              <td>Unfilled</td>
              <td></td>
              <td>1</td>
            </tr>
            <tr>
              <td>
                <br/>
              </td>
            </tr>
            <tr style={{textAlign:'center'}}>
              <td>Total</td>
              <td></td>
              <td>8</td>
            </tr>
            </tbody>
          </table>
          </>
      )
  }
}

  export default ResultsTable;
