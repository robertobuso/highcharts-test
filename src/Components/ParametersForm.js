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
          <Grid columns={3} >

          <Grid.Row>
          <Grid.Column width={4} textAlign='right' style={ {fontWeight: 'bold'} }>
           Base:
          </Grid.Column>
          <Grid.Column width={8}>
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
            <br/>
            <br/>
            <Grid.Row>
            <Grid.Column width={4} textAlign='right' style={ {fontWeight: 'bold'} }>
             Target Price:
            </Grid.Column>
            <Grid.Column width={8}>
               <input
                 name='base'
                 type='text'
                 className='number-input'
                 placeholder='3'
                 floated='left'
                 // onChange={this.handleInputChange}
                 />
                 {' times the vertical length of the Zone'}
            </Grid.Column>
            </Grid.Row>
            <br/>
            <br/>
            <Grid.Row>
            <Grid.Column width={4} textAlign='right' style={ {fontWeight: 'bold'} }>
              Shared Leg:
            </Grid.Column>
            <Grid.Column width={8}>
              <input
                name='sharedLeg'
                type='radio'
                value='Yes'
                // onChange={this.handleInputChange}
                />
                <label className='radio-btn'>{' Yes'}</label>
                <input
                  name='sharedLeg'
                  type='radio'
                  value='No'
                  // onChange={this.handleInputChange}
                  />
                  <label>{' No'}</label>
            </Grid.Column>
            </Grid.Row>
             <br/>
             <br/>
            <Grid.Row>
            <Grid.Column width={4} textAlign='right' style={ {fontWeight: 'bold'} }>
              Unused Zone:
            </Grid.Column>
            <Grid.Column width={8}>
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
            <br/>
            <br/>
            <Grid.Row>
            <Grid.Column width={4} textAlign='right' style={ {fontWeight: 'bold'} }>
             Fresh Zone:
            </Grid.Column>
            <Grid.Column width={8}>
               <input
                name='freshZoneBars'
                type='text'
                className='number-input'
                placeholder='5'
                // value={this.state.numberOfGuests}
                // onChange={this.handleInputChange}
                />
             <label className='right-label'>maximum number of Bars</label>
             <br/><br/>
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
           <Grid.Row>
            <Grid.Column width={4}>
            </Grid.Column>
            <Grid.Column width={8}>
            </Grid.Column>
            <Grid.Column width={1}>
            <br/>
            <button type='submit' className='save-parameter-btn'>Save</button>
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
