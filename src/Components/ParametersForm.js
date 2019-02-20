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
          <Grid.Column width={10}>
           <label>
             Base: {'  '}
             <input
               name='base'
               type='text'
               className='number-input'
               placeholder='40'
               // onChange={this.handleInputChange}
               />
               <label className='right-label'>% of the Range</label>
            </label>
            <br/>
            <br/>
            <label>
              Shared Leg: {'  '}
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
             </label>
             <br/>
             <br/>
            <label>
              Unused Zone:{'  '}
                <input
                 name='unusedZone'
                 type='text'
                 className='number-input'
                 placeholder='6'
                 // value={this.state.numberOfGuests}
                 // onChange={this.handleInputChange}
                 />
              <label className='right-label'>minimum number of Bases</label>
            </label>
            </Grid.Column>
            <Grid.Column width={1}>
            <br/>
            <button type='submit' className='save-parameter-btn'>Save</button>
            </Grid.Column>
          </Grid>
         </form>
      </div>
      </>
    )
  }
}

    export default ParametersForm;
