import React, { Component } from 'react';
import Highcharts from 'highcharts/highstock';

import HighchartsReact from '../HighchartsReact.js'

require('highcharts/highcharts-3d.js')(Highcharts)
require('highcharts/modules/cylinder')(Highcharts)

const options = {
  chart: {
    type: 'cylinder',
    width: 400,
    options3d: {
        enabled: true,
        alpha: 15,
        beta: 15,
        viewDistance: 100,
        depth: 50
    }
  },

  navigator: {
            enabled: false
        },

  scrollbar: {
    enabled: false
  },

  rangeSelector: {
      enabled: false
  },

    title: {
        text: 'Trade Results'
    },

    xAxis: {
        categories: [],
        labels: {
            skew3d: true,
            style: {
                fontSize: '16px'
            }
        }
    },

    yAxis: {
        allowDecimals: true,
        min: 0,
        title: {
            text: 'Positions Closed',
            skew3d: true
        }
    },

    plotOptions: {
        cylinder: {
            stacking: 'normal',
            depth: 25
        }
    },

    series: [{
        name: 'T3',
        data: [4]
    }, {
        name: 'BE',
        data: [1]
    }, {
        name: 'S',
        data: [2]
    }, {
      colorByPoint: true
    }]
      }

      class CylinderChart extends Component {
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

      export default CylinderChart;
