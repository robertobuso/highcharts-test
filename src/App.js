import React, { Component } from 'react';
import Highcharts from 'highcharts/highstock';

import HighchartsReact from './HighchartsReact.js'

import CylinderChart from './Components/CylinderChart.js'
import TestChart from './Components/TestChart.js'

class App extends Component {
    render() {
      return (
        <TestChart />
      )
    }
}

export default App;
