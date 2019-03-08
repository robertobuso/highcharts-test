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

const actualBases = []

const finalData = newArray.map( bar => {
  // data to moment object
  const stringDateTime = moment.utc(bar[0] + " " + bar[1])
  //moment object to local time zone
  const localDate = moment(stringDateTime).local()
  //moment object to iso format in local time zone
  const formatDate = localDate.format("x")
  //iso string to integer
  const dateTime = parseInt(formatDate)

  //Here we see if it's a bar or a leg
    const candlestick = bar[5] - bar[2] > 0 ?
        bar[5] - bar[2]
    :
      bar[2] - bar[5]


    const range = bar[3] - bar[4]

    if (candlestick / range < 0.4) {
      actualBases.push(dateTime)
    }

    return {"x": dateTime,
    "open": bar[2],
    "high": bar[3],
    "low": bar[4],
    "close": bar[5]}
  })

  const baseMarkers = actualBases.map( base => {
      return {'x': base,
      'title': ' '}
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
            data: baseMarkers,
            onSeries: 'candlestick',
           shape: 'circlepin',
           width: 1,
           fillColor: 'blue'
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
      x: 1546405200000,
      low: 2461.5,
      high: 2496.5,
    },
    {
      x: 1546408800000,
      low: 2461.5,
      high: 2496.5,
    },
    {
      x: 1546412400000,
      low: 2461.5,
      high: 2496.5,
    },
    {
      x: 1546416000000,
      low: 2461.5,
      high: 2496.5,
    },
    {
      x: 1546419600000,
      low: 2461.5,
      high: 2496.5,
    },
    {
      x: 1546423200000,
      low: 2461.5,
      high: 2496.5,
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
            value: 2496.5
          }, {
            color: 'blue',
            width: 1,
            value: 2461.5
          }
        ]
      }
      }

      class EsChart extends Component {

          render() {
            console.log(this.state)
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
