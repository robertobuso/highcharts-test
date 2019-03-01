import React, { Component } from 'react';
import './App.css';

import { Grid, Menu } from 'semantic-ui-react'

import CylinderChart from './Components/CylinderChart.js'
import TestChart from './Components/TestChart.js'
import ParametersForm from './Components/ParametersForm.js'

class App extends Component {
    render() {
      return (
        <>
        <Menu>
       <Menu.Item header>Envoy LLC App</Menu.Item>
       <Menu.Item
         name='Home'
         onClick={() => console.log('Home')}
         active={false}
       />
       <Menu.Item
         name='Parameters'
         onClick={() => console.log('Parameters')}
         active={false}/>
       <Menu.Item
         name='Reports'
         onClick={() => console.log('Reports')}
         active={false}
       />
     </Menu>
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
        </>
      )
    }
}

export default App;
