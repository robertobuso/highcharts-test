import React, { Component } from 'react';
import Highcharts from 'highcharts/highstock';

import { Grid } from 'semantic-ui-react'
import {options, finalPotentialZones, finalPositions, notFresh, badIncomingLeg, badLegBases, foundAttractor, unused,  createOptions} from '../Adapters'

import HighchartsReact from '../HighchartsReact.js'
import OptionsComponent from './OptionsComponent.js'

require('highcharts/indicators/indicators')(Highcharts)
require('highcharts/indicators/pivot-points')(Highcharts)
require('highcharts/indicators/macd')(Highcharts)
require('highcharts/modules/exporting')(Highcharts)
require('highcharts/modules/xrange')(Highcharts)
require('highcharts/highcharts-more.src.js')(Highcharts)

export default class LogicElement extends Component {

  constructor(props) {
    super(props);
    this.state = { options: [],
                    formParameters: {},
                    finalPotentialZones: [],
                    finalPositions: [],
                    notFresh: [],
                    badIncomingLeg: [],
                    badLegBases: [],
                    foundAttractor: [],
                    unused: []
                  }
    }

  componentDidMount() {
    console.log(this)
  }

  handleChartData = (chartData) => {
console.log('Inside Chart Data')
debugger
    this.setState( {
      finalPotentialZones: chartData.finalPotentialZones,
      finalPositions: chartData.finalPositions,
      notFresh: chartData.notFresh,
      badIncomingLeg: chartData.badIncomingLeg,
      badLegBases: chartData.badLegBases,
      foundAttractor: chartData.foundAttractor,
      unused: chartData.unused,
      options: {
       chart: {
         zoomType: 'x',

         xAxis: {
           minRange: 3600000
         },
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
                 data: chartData.finalData,
                 id: 'candlestick'
               },
               {
             type: 'flags',
             data: chartData.baseMarkers,
             onSeries: 'candlestick',
            shape: 'circlepin',
            width: 1,
            fillColor: 'blue'
           },
           {
         type: 'flags',
         data: chartData.priceReturnedMarker,
         onSeries: 'candlestick',
        shape: 'circlepin',
        width: 2,
        fillColor: 'yellow'
       },
       {
      type: 'flags',
      data: chartData.stopMarker,
      onSeries: 'candlestick',
      shape: 'circlepin',
      width: 8,
      fillColor: 'red'
      },
      {
      type: 'flags',
      data: chartData.positionClosedMarker,
      onSeries: 'candlestick',
      shape: 'circlepin',
      width: 8,
      fillColor: 'green'
      },
      {
      type: 'flags',
      data: chartData.breakEvenMarker,
      onSeries: 'candlestick',
      shape: 'circlepin',
      width: 8,
      fillColor: 'white'
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
      data: chartData.zoneData.flat(),
      pointRange: 3600000
      },
                 {
       type: 'columnrange',
       name: '',
       id: 'not_fresh_zone',
       grouping: false,
       groupPadding: true,
       pointPadding: 1,
       borderRadius: 0,
       showInLegend: false,
       borderColor: '',
       borderWidth: 2,
       color: 'purple',
       opacity: 0.3,
       zIndex: -1,
       data: chartData.notFreshZoneData.flat(),
       pointRange: 3600000
      }
       ],
       yAxis: {
           tickInterval: 0.01,
           title: {
               text: 'Price'
           },
           plotLines: chartData.zoneLineMarkers
       }
      }
    }, () => console.log('OPTIONS IN STATE: ', this.state.options))
  }

  render() {
    console.log('Fresh Zones: ', this.state.finalPotentialZones)
    console.log('NOT Fresh Zones: ', this.state.notFresh)
    console.log('Unused Zones: ', this.state.unused)
    console.log('Invalid Because of Incoming Leg: ', this.state.badIncomingLeg)
    console.log('Invalid Because of Leg Bases: ', this.state.badLegBases)
    console.log('Invalid Because of Attractor Zone: ', this.state.foundAttractor)
    console.log('Positions: ', this.state.finalPositions)
    return (
      <>
      <OptionsComponent
        parameters={this.props.formParameters}
        handleChartData={this.handleChartData}
        />
      <div onClick={this.props.handleChartClick}>
       <HighchartsReact
         highcharts={Highcharts}
         constructorType={'stockChart'}
         options={this.state.options}
       />
     </div>
     </>
    )
  }
}
