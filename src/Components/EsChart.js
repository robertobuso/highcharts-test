import React, { Component } from 'react';
import Highcharts from 'highcharts/highstock';

import {options, finalPotentialZones, finalPositions, notFresh, badIncomingLeg, badLegBases, foundAttractor, unused} from '../Adapters'

import HighchartsReact from '../HighchartsReact.js'
import LogicElement from './LogicElement.js'

require('highcharts/indicators/indicators')(Highcharts)
require('highcharts/indicators/pivot-points')(Highcharts)
require('highcharts/indicators/macd')(Highcharts)
require('highcharts/modules/exporting')(Highcharts)
require('highcharts/modules/xrange')(Highcharts)
require('highcharts/highcharts-more.src.js')(Highcharts)


class EsChart extends Component {

    state = {test: 'IT WORKS DUDE'}

    manageData = (data) => {
       console.log('THE DATA IS: ', data)
       debugger
       return data
    }

    render() {
      console.log('Fresh Zones: ', finalPotentialZones)
      console.log('NOT Fresh Zones: ', notFresh)
      console.log('Unused Zones: ', unused)
      console.log('Invalid Because of Incoming Leg: ', badIncomingLeg)
      console.log('Invalid Because of Leg Bases: ', badLegBases)
      console.log('Invalid Because of Attractor Zone: ', foundAttractor)
      console.log('Positions: ', finalPositions)

      return (
        <>
        <LogicElement
          testData={this.state.test}
          manageData={this.manageData}
          />

         <div onClick={this.props.handleChartClick}>
          <HighchartsReact
            highcharts={Highcharts}
            constructorType={'stockChart'}
            options={options}
          />
        </div>
        </>
      )
    }
}

export default EsChart;
