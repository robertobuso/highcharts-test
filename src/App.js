import React, { Component } from 'react';

import { Grid } from 'semantic-ui-react'

import CylinderChart from './Components/CylinderChart.js'
import TestChart from './Components/TestChart.js'
import ParametersForm from './Components/ParametersForm.js'

class App extends Component {
    render() {
      return (
        <>
        <Grid columns={2}>
        <Grid.Row>

        <Grid.Column>
        </Grid.Column>

        <Grid.Column>
        <ParametersForm />
        </Grid.Column>
        </Grid.Row>

        <Grid.Row>

        <Grid.Column>
        <TestChart width={2} />
        </Grid.Column>

        <Grid.Column floated='right'>
        <CylinderChart />
        </Grid.Column>

        </Grid.Row>
        </Grid>
        </>
      )
    }
}

export default App;
