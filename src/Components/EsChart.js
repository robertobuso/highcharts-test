import React, { Component } from 'react';
import Highcharts from 'highcharts/highstock';
import esPrices from '../Data/esPrices.js';
import moment from 'moment-timezone';

import HighchartsReact from '../HighchartsReact.js'

require('highcharts/indicators/indicators')(Highcharts)
require('highcharts/indicators/pivot-points')(Highcharts)
require('highcharts/indicators/macd')(Highcharts)
require('highcharts/modules/exporting')(Highcharts)
require('highcharts/modules/xrange')(Highcharts)
require('highcharts/highcharts-more.src.js')(Highcharts)

let newArray =  []

while (esPrices.length > 1) {
    const bar = esPrices.splice(0, 9)
    newArray.push(bar)
  }

const finalData = newArray.map( bar => {
  // data to moment object
  const stringDateTime = moment.utc(bar[0] + " " + bar[1])
  //moment object to local time zone
  const localDate = moment(stringDateTime).local()
  //moment object to iso format in local time zone
  const formatDate = localDate.format("x")
  //iso string to integer
  const dateTime = parseInt(formatDate)

    return {"x": dateTime,
    "open": bar[2],
    "high": bar[3],
    "low": bar[4],
    "close": bar[5]}
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
                name: 'E-Mini S&P 500',
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
          min: 2445,
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

      class EsChart extends Component {
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

      export default EsChart;
