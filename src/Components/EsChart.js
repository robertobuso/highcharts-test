import React, { Component } from 'react';
import Highcharts from 'highcharts/highstock';

import {actualBases, finalData, baseMarkers, options } from '../Adapters'

import HighchartsReact from '../HighchartsReact.js'

require('highcharts/indicators/indicators')(Highcharts)
require('highcharts/indicators/pivot-points')(Highcharts)
require('highcharts/indicators/macd')(Highcharts)
require('highcharts/modules/exporting')(Highcharts)
require('highcharts/modules/xrange')(Highcharts)
require('highcharts/highcharts-more.src.js')(Highcharts)


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
