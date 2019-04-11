import React, { Component } from 'react';
import Highcharts from 'highcharts/highstock';

import {options, finalPotentialZones, finalPositions, notFresh, badIncomingLeg, badLegBases, foundAttractor, unused} from '../Adapters'

import HighchartsReact from '../HighchartsReact.js'

require('highcharts/indicators/indicators')(Highcharts)
require('highcharts/indicators/pivot-points')(Highcharts)
require('highcharts/indicators/macd')(Highcharts)
require('highcharts/modules/exporting')(Highcharts)
require('highcharts/modules/xrange')(Highcharts)
require('highcharts/highcharts-more.src.js')(Highcharts)


class EsChart extends Component {

    render() {
      console.log('Fresh Zones: ', finalPotentialZones)
      console.log('NOT Fresh Zones: ', notFresh)
      console.log('Unused Zones: ', unused)
      console.log('Invalid Because of Incoming Leg: ', badIncomingLeg)
      console.log('Invalid Because of Leg Bases: ', badLegBases)
      console.log('Invalid Because of Attractor Zone: ', foundAttractor)
      console.log('Positions: ', finalPositions)

      return (
         <div onClick={this.props.handleChartClick}>
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
