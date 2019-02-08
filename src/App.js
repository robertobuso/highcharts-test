import React, { Component } from 'react'
import Highcharts from 'highcharts/highstock'
import HighchartsReact from 'highcharts-react-official'
import goldData from './Data/goldFutures.js'

var moment = require('moment-timezone');
moment().tz("America/New_York").format();

const finalData = goldData.map( bar => {

    const dateTime = moment((bar["Date"] + " " + bar["Time"])).tz('America/New_York').format('x').to_i

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

        series: [{
            type: 'candlestick',
            name: 'Gold',
            data: finalData
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
