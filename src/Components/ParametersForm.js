import React, { Component } from 'react';
import { Grid } from 'semantic-ui-react'

class ParametersForm extends Component {

  handleSubmit = (event) => {
    event.preventDefault()
    console.log(event)
  }

    render() {
      return (
<>
<div className='parameter-form'>
<form onSubmit={this.handleSubmit}>
<Grid columns={2} >

<Grid.Row className='row-parameter'>
<Grid.Column width={5} textAlign='right' style={ {fontWeight: 'bold'} }>
Scenario ID:
</Grid.Column>
<Grid.Column width={11}>
<input
name='scenarioId'
type='text'
className='text-input'
placeholder='Gold 6 Bases'
floated='left'
// onChange={this.handleInputChange}
/>
</Grid.Column>
</Grid.Row>

<Grid.Row className='row-parameter'>
<Grid.Column width={4} textAlign='right' style={ {fontWeight: 'bold'} }>
Base:
</Grid.Column>
<Grid.Column width={11}>
<input
name='base'
type='text'
className='number-input'
placeholder='40'
floated='left'
// onChange={this.handleInputChange}
/>
{' % of the Range'}
</Grid.Column>
</Grid.Row>

<Grid.Row className='row-parameter'>
<Grid.Column width={4} textAlign='right' style={ {fontWeight: 'bold'} }>
Incoming Leg:
</Grid.Column>
<Grid.Column width={11}>
<input
name='base'
type='text'
className='number-input'
placeholder='75'
floated='left'
// onChange={this.handleInputChange}
/>
{' % bigger than the longest Base in the Potential Zone'}
</Grid.Column>
</Grid.Row>

<Grid.Row className='row-parameter'>
<Grid.Column width={4} textAlign='right' style={ {fontWeight: 'bold'} }>
Unused Zone:
</Grid.Column>
<Grid.Column width={11}>
<input
name='unusedZone'
type='text'
className='number-input'
placeholder='6'
// value={this.state.numberOfGuests}
// onChange={this.handleInputChange}
/>
  <label className='right-label'>minimum number of Bases</label>
</Grid.Column>
</Grid.Row>

<Grid.Row className='row-parameter'>
<Grid.Column width={4} textAlign='right' style={ {fontWeight: 'bold'} }>
 Fresh Zone:
</Grid.Column>
<Grid.Column width={11}>
<input
name='freshZoneBars'
type='text'
className='number-input'
placeholder='5'
// value={this.state.numberOfGuests}
// onChange={this.handleInputChange}
/>
<label className='right-label'>Bars minimum</label>
<br className='second-parameter'/>
<input
name='freshZoneBars'
type='text'
className='number-input'
placeholder='1'
// value={this.state.numberOfGuests}
// onChange={this.handleInputChange}
/>
<label className='right-label'>Bars can penetrate Zone</label>
<br className='second-parameter'/>
<input
name='freshZonePenetration'
type='text'
className='number-input'
placeholder='25'
// value={this.state.numberOfGuests}
// onChange={this.handleInputChange}
/>
<label className='right-label'>% or less penetration into Zone</label>
</Grid.Column>
</Grid.Row>
<Grid.Row className='row-parameter'>
<Grid.Column width={4} textAlign='right' style={ {fontWeight: 'bold'} }>
Explosive Bar:
</Grid.Column>
<Grid.Column width={11}>
<input
name='explosiveBarOutgoingLeg'
type='text'
className='number-input'
placeholder='1'
// value={this.state.numberOfGuests}
// onChange={this.handleInputChange}
/>
<label className='right-label'>times or more the vertical length of Zone</label>
<br className='second-parameter'/>
<input
name='explosiveBarPenetration'
type='text'
className='number-input'
placeholder='40'
// value={this.state.numberOfGuests}
// onChange={this.handleInputChange}
/>
<label className='right-label'>% or less penetration into Zone</label>
</Grid.Column>
</Grid.Row>

<Grid.Row className='row-parameter'>
<Grid.Column width={4} textAlign='right' style={ {fontWeight: 'bold'} }>
Explosive Group:
</Grid.Column>
<Grid.Column width={11}>
<input
name='explosiveGroupNumberOfBars'
type='text'
className='number-input'
placeholder='3'
// value={this.state.numberOfGuests}
// onChange={this.handleInputChange}
/>
<label className='right-label'>maximum number of bars, including the Outgoing Leg</label>
<br className='second-parameter'/>
<input
name='minimumLength'
type='text'
className='number-input'
placeholder='2'
// value={this.state.numberOfGuests}
// onChange={this.handleInputChange}
/>
<label className='right-label'>times or more the height of the Current Zone</label>
<br className='second-parameter'/>
<input
name='explosiveGroupPenetration'
type='text'
className='number-input'
placeholder='40'
// value={this.state.numberOfGuests}
// onChange={this.handleInputChange}
/>
<label className='right-label'>% or less penetration into Zone by Outgoing Bar</label>

</Grid.Column>
</Grid.Row>

<Grid.Row className='row-parameter'>
<Grid.Column width={4} textAlign='right' style={ {fontWeight: 'bold'} }>
 Bar Attractors:
</Grid.Column>
<Grid.Column width={11}>
<input
name='barAttractorsNumber'
type='text'
className='number-input'
placeholder='4'
// value={this.state.numberOfGuests}
// onChange={this.handleInputChange}
/>
<label className='right-label'>maximum number of Bars before Incoming Leg</label>
<br className='second-parameter'/>
<input
name='barAttractorsDistance'
type='text'
className='number-input'
placeholder='1.5'
// value={this.state.numberOfGuests}
// onChange={this.handleInputChange}
/>
<label className='right-label'>times or less the height of the Current Zone</label>
</Grid.Column>
</Grid.Row>

<Grid.Row className='row-parameter'>
<Grid.Column width={4} textAlign='right' style={ {fontWeight: 'bold'} }>
 Zone Attractors:
</Grid.Column>
<Grid.Column width={11}>
<input
name='zoneAttractorsDistance'
type='text'
className='number-input'
placeholder='2'
// value={this.state.numberOfGuests}
// onChange={this.handleInputChange}
/>
<label className='right-label'>times or less the height of the Current Zone: distance between Zones</label>
</Grid.Column>
</Grid.Row><Grid.Row className='row-parameter'>
<Grid.Column width={4} textAlign='right' style={ {fontWeight: 'bold'} }>
Target Price:
</Grid.Column>
<Grid.Column width={11}>
<input
name='base'
type='text'
className='number-input'
placeholder='3'
floated='left'
// onChange={this.handleInputChange}
/>
<label>{' times the vertical length of the Zone'}</label>
</Grid.Column>
</Grid.Row>

<Grid.Row className='row-parameter'>
<Grid.Column width={4} textAlign='right' style={ {fontWeight: 'bold'} }>
 Entry Price:
</Grid.Column>
<Grid.Column width={11}>
<label>Ceiling of Zone plus </label>
<input
name='zoneAttractorsDistance'
type='text'
className='number-input'
placeholder='1'
// value={this.state.numberOfGuests}
// onChange={this.handleInputChange}
/>
<label className='right-label'>percent of the Average True Range - Demand Zone</label>
<br className='second-parameter'/>
<label>Floor of Zone minus </label>
<input
name='zoneAttractorsDistance'
type='text'
className='number-input'
placeholder='1'
// value={this.state.numberOfGuests}
// onChange={this.handleInputChange}
/>
<label className='right-label'>percent of the Average True Range - Supply Zone</label>
</Grid.Column>
</Grid.Row>

<Grid.Row className='row-parameter'>
<Grid.Column width={4} textAlign='right' style={ {fontWeight: 'bold'} }>
 Stop Loss Price:
</Grid.Column>
<Grid.Column width={11}>
<label>Floor of Zone minus </label>
<input
name='zoneAttractorsDistance'
type='text'
className='number-input'
placeholder='2'
// value={this.state.numberOfGuests}
// onChange={this.handleInputChange}
/>
<label className='right-label'>percent of the Average True Range - Demand Zone</label>
<br className='second-parameter'/>
<label>Ceiling of Zone plus </label>
<input
name='zoneAttractorsDistance'
type='text'
className='number-input'
placeholder='2'
// value={this.state.numberOfGuests}
// onChange={this.handleInputChange}
/>
<label className='right-label'>percent of the Average True Range - Supply Zone</label>
</Grid.Column>
</Grid.Row>

<Grid.Row className='row-parameter'>
<Grid.Column width={4}>
</Grid.Column>
<Grid.Column width={11}>
</Grid.Column>
</Grid.Row>

<Grid.Row >
<Grid.Column width={4}>
<button type='submit' className='default-parameter-btn'>Make Default</button>
</Grid.Column>
<Grid.Column width={11}>
<button type='submit' className='save-parameter-btn'>Save Scenario</button>
</Grid.Column>
</Grid.Row>
</Grid>
</form>
</div>
</>
    )
  }
}

    export default ParametersForm;
