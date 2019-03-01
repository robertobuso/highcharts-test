import React, { Component } from 'react';
import Highcharts from 'highcharts/highstock';
import goldData from '../Data/goldFutures.js';
import moment from 'moment-timezone';

import HighchartsReact from '../HighchartsReact.js'

require('highcharts/indicators/indicators')(Highcharts)
require('highcharts/indicators/pivot-points')(Highcharts)
require('highcharts/indicators/macd')(Highcharts)
require('highcharts/modules/exporting')(Highcharts)
require('highcharts/modules/xrange')(Highcharts)
require('highcharts/highcharts-more.src.js')(Highcharts)

const finalData = goldData.map( bar => {
  const dateTime = parseInt(moment(bar["Date"] + " " + bar["Time"]).tz('America/New_York').format('x'))

    return {"x": dateTime,
    "open": bar["Open"],
    "high": bar["High"],
    "low": bar["Low"],
    "close": bar["Close"]}
  })

const options = {
      chart: {
        zoomType: 'xy',

        type: 'candlestick'
      }
,        plotOptions: {
           candlestick: {
                      color: 'red',
                      upColor: 'green'
                  }
        },

        rangeSelector: {
            enabled: false
        },

        title: {
            text: 'Envoy LLC Backtesting App'
        },

       time: {
            timezone: 'America/New_York'
       },

       exporting: {
         enabled: false
       },

      series: [
              { type: 'candlestick',
                name: 'Gold',
                data: finalData,
                id: 'candlestick'
              },
              {
            type: 'flags',
            data: [{
                x: 1545123600000,
                title: 'B'
            }, {
                x: 1545127200000,
                title: 'B'
            }, {
                x: 1545130800000,
                title: 'B'
            }, {
                x: 1545134400000,
                title: 'B'
            }],
            onSeries: 'candlestick',
           shape: 'circlepin',
           width: 12,
           fillColor: '#ADD8E6'
          },
              {
  	type: 'columnrange',
    name: '',
    id: 'zone',
    grouping: false,
    groupPadding: true,
    pointPadding: 1,
    borderRadius: 0,
    showInLegend: false,
    borderColor: '',
    borderWidth: 2,
    color: 'orange',
    opacity: 0.3,
    zIndex: -1,
    data: [{
      x: 1545120000000,
      low: 1249,
      high: 1255,
    },
    {
      x: 1545123600000,
      low: 1249,
      high: 1255,
    },
    {
      x: 1545127200000,
      low: 1249,
      high: 1255,
    },
    {
      x: 1545130800000,
      low: 1249,
      high: 1255,
    },
    {
      x: 1545134400000,
      low: 1249,
      high: 1255,
    },
    {
      x: 1545138000000,
      low: 1249,
      high: 1255,
    }],
    pointRange: 3600000
  }
      ],
      yAxis: {
          min: 1240,
          title: {
              text: 'Price'
          },
          plotLines: [{
            color: 'blue',
            width: 1,
            value: 1255
          }, {
            color: 'blue',
            width: 1,
            value: 1249
          }
        ]
      }
      }

      class TestChart extends Component {
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

      export default TestChart;
