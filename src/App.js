import React, { Component } from 'react';
import Highcharts from 'highcharts/highstock';
import goldData from './Data/goldFutures.js';
import moment from 'moment-timezone';

import HighchartsReact from './HighchartsReact.js'

require('highcharts/indicators/indicators')(Highcharts)
require('highcharts/indicators/pivot-points')(Highcharts)
require('highcharts/indicators/macd')(Highcharts)
require('highcharts/modules/exporting')(Highcharts)
require('highcharts/modules/map')(Highcharts)

const finalData = goldData.map( bar => {
  const dateTime = parseInt(moment(bar["Date"] + " " + bar["Time"]).tz('America/New_York').format('x'))

    return {"x": dateTime,
    "open": bar["Open"],
    "high": bar["High"],
    "low": bar["Low"],
    "close": bar["Close"]}
  })

const options = {
        plotOptions: {
           candlestick: {
                      color: 'red',
                      upColor: 'green'
                  }
        },

        rangeSelector: {
            selected: 1
        },

        title: {
            text: 'MVF Backtesting App'
        },

       time: {
            timezone: 'America/New_York'
       },

      series: [{
            type: 'candlestick',
            name: 'Gold',
            data: finalData
        },
        {
        type: 'flags',
        data: [{
            x: 1545058800000,
            title: 'A',
            text: 'Shape: "squarepin"'
        }, {
            x: 1545030000000,
            title: 'A',
            text: 'Shape: "squarepin"'
        }],
        onSeries: 'dataseries',
        shape: 'squarepin',
        width: 16
    }, {
        type: 'flags',
        data: [{
            x: 1545037200000,
            y: 1261,
            title: 'b',
            text: 'Shape: "circlepin"'
        }, {
            x: 1545044400000,
            title: 'B',
            text: 'Shape: "circlepin"'
        }],
        onSeries: 'dataseries',
        shape: 'circlepin',
        width: 15}],

        annotations: [{
       labelOptions: {
           backgroundColor: 'rgba(255,255,255,0.5)',
           verticalAlign: 'top',
           y: 15
       },

       labels: [{
           point: {
               xAxis: 1545058800000,
               yAxis: 1245
           },
           text: 'Arbois'
       }, {
           point: {
               xAxis: 0,
               yAxis: 0,
               x: 45.5,
               y: 611
           },
           text: 'Montrond'
       }]
     }],

        yAxis: {
            title: {
                text: 'Price'
            },
            plotBands: [{
                from: 1240,
                to: 1250,
                color: 'rgba(68, 170, 213, 0.2)',
                label: {
                    text: 'A Good Zone'
                }
            }]
        }
    }




class App extends Component {

  
    render() {
      return (
         <div>
          <HighchartsReact
            highcharts={Highcharts}
            constructorType={'stockChart'}
            options={options}
          />
        </div>
      )
    }
}

export default App;
