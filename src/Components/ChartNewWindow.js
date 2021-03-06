import React, { Component } from 'react';
import Highcharts from 'highcharts/highstock';

import {optionsTwo} from '../Adapters'

import HighchartsReact from '../HighchartsReact.js'

import NewWindow from 'react-new-window'

require('highcharts/indicators/indicators')(Highcharts)
require('highcharts/indicators/pivot-points')(Highcharts)
require('highcharts/indicators/macd')(Highcharts)
require('highcharts/modules/exporting')(Highcharts)
require('highcharts/modules/xrange')(Highcharts)
require('highcharts/highcharts-more.src.js')(Highcharts)


class ChartNewWindow extends Component {

    render() {
      return (
        <NewWindow>
         <div>
          <HighchartsReact
            highcharts={Highcharts}
            constructorType={'stockChart'}
            options={optionsTwo}
          />
        </div>
        </NewWindow>
      )
    }
}

export default ChartNewWindow;
