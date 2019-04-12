import React, { Component } from 'react';
import './App.css';

import { Grid, Menu } from 'semantic-ui-react'

import CylinderChart from './Components/CylinderChart.js'
import EsChart from './Components/EsChart.js'
import ChartNewWindow from './Components/ChartNewWindow.js'
import ParametersForm from './Components/ParametersForm.js'
import ResultsTable from './Components/ResultsTable.js'

class App extends Component {

    state = {
      newWindow: false,
      renderChart: false
    }

    handleChartClick = () => {
      // this.setState( {
      //   newWindow: true
      // })
      console.log('Disabled to test click on zones and modals.')
    }

    reRenderChart = (data) => {
      console.log('Re-rendering chart')
      this.setState( { renderChart: !this.state.renderChart})
    }

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

     {this.state.newWindow === true ?
       <ChartNewWindow />
      : null}

     <div>
        <Grid style={{height: '100%'}}>
          <Grid.Row>
            <Grid columns={2}>
            <Grid.Column width={14} >
              <EsChart
                handleChartClick={this.handleChartClick}
                reRenderChart={this.reRenderChart}/>
            </Grid.Column>

            <Grid.Column  width={2}>
              <Grid.Row>
              <CylinderChart />
              </Grid.Row>
              <Grid.Row>
                <ResultsTable />
              </Grid.Row>
            </Grid.Column>
          </Grid>
          </Grid.Row>

          <Grid.Row>
            <Grid.Column className='input-scroll' style={{height: '240px'}}>
              <ParametersForm
                reRenderChart={this.reRenderChart}/>
            </Grid.Column>
          </Grid.Row>
        </Grid>
        </div>
        </>
      )
    }
}

export default App;
