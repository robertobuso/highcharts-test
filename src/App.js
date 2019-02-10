import React, { Component } from 'react';
import Highcharts from 'highcharts/highstock';
import goldData from './Data/goldFutures.js';
import moment from 'moment-timezone';

import HighchartsReact from './HighchartsReact.js'

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
        type: 'candlestick'
      }
,        plotOptions: {
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

      series: [
              { type: 'candlestick',
                name: 'Gold',
                data: finalData
              },

              {
  	type: 'columnrange',
    name: '',
    grouping: true,
    groupPadding: true,
    pointPadding: 1,
    borderRadius: 10,
    showInLegend: false,
    borderColor: 'red',
    borderWidth: 2,
    color: 'orange',
    opacity: 0.3,
    zIndex: -1,
    data: [{
      x: 1545044400000,
      low: 1240,
      high: 1250,
    }],
    pointRange: 3600000
  }
            ],
        yAxis: {
            min: 1225,
            title: {
                text: 'Price'
            }
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
