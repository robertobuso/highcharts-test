import React, { Component } from 'react'
import Highcharts from 'highcharts/highstock'
import HighchartsReact from 'highcharts-react-official'
import goldData from './Data/goldFutures.js'

const finalData = goldData.map( bar => {
    return {"x": Date.parse(bar["Date"] + " " + bar["Time"]),
    "open": bar["Open"],
    "high": bar["High"],
    "low": bar["Low"],
    "close": bar["Close"]}
  })

const plotOptions = {
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
        }]
    }

class App extends Component {
    render() {
      return (
         <div>
          <HighchartsReact
            highcharts={Highcharts}
            constructorType={'stockChart'}
            options={plotOptions}
          />
        </div>
      )
    }
}

export default App;
