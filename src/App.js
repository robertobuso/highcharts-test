import React, { Component } from 'react';
import './App.css';

import { Grid } from 'semantic-ui-react'

import CylinderChart from './Components/CylinderChart.js'
import TestChart from './Components/TestChart.js'
import ParametersForm from './Components/ParametersForm.js'

class App extends Component {
    render() {
      return (
        <Grid>
          <Grid.Row >
            <Grid columns={2}>
            <Grid.Column width={14}>
              <TestChart />
            </Grid.Column>

            <Grid.Column floated='right' width={2}>
              <CylinderChart />
            </Grid.Column>
          </Grid>
          </Grid.Row>

          <Grid.Row>
            <Grid.Column className='input-scroll'>
              <ParametersForm />
            </Grid.Column>
          </Grid.Row>
        </Grid>
      )
    }
}

export default App;
