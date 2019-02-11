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
        zoomType: 'xy',
//         events: {
//           load: function () {
//             const xAxis = this.xAxis[0];
//             const yAxis = this.yAxis[0];
//             const rectangle = this.renderer.rect(xAxis.toPixels(1545037200000), yAxis.toPixels(1250), 50, 20)
//                 .attr({
//                     'stroke-width': 2,
//                     stroke: 'red',
//                     fill: 'yellow',
//                     opacity: 0.4,
//                     zIndex: -0
//                 }).on('click', () => {
//                     rectangle.animate({
//                         x: 50,
//                         y: 100,
//                         width: 200,
//                         height: 200,
//                         'stroke-width': 2
//                     })}).add();
//           },
//           redraw: function(event) {
//
//             // if(event.target.chartBackground) {
//             //        event.target.chartBackground.destroy();
//             //  }
//
//             const x = this.xAxis[0].toPixels(1545037200000)
//
//             const y = this.yAxis[0].toPixels(1250)
//
//             const width =  this.xAxis[0].toPixels(14400000)
//
//             const height =  this.yAxis[0].toPixels(this.axes[2].dataMin) - this.yAxis[0].toPixels(this.axes[2].dataMax)
//
//             const rectangle = this.renderer.rect(x, y, width, 20)
//               .attr({'stroke-width': 2,
//               stroke: 'red',
//               fill: 'yellow',
//               opacity: 0.4,
//               zIndex: -0
//             }).add();
//             }
//           },
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
                data: finalData,
                id: 'candlestick'
              },
              {
            type: 'flags',
            data: [{
                x: 1545102000000,
                title: 'B'
            }, {
                x: 1545066000000,
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
      x: 1545022800000,
      low: 1240,
      high: 1250,
    },
    {
      x: 1545026400000,
      low: 1240,
      high: 1250,
    }],
    pointRange: 3600000
  }
      ],
      yAxis: {
          min: 1240,
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
