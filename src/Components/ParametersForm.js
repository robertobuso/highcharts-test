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
          <Grid columns={2}>
          <Grid.Column>
           <label>
             Base:
             <input
               name="isGoing"
               type="checkbox"
               // checked={this.state.isGoing}
               // onChange={this.handleInputChange}
               />
            </label>
            <br/>
            <br/>
            <label>
              Number of guests:
                <input
                 name="numberOfGuests"
                 type="number"
                 // value={this.state.numberOfGuests}
                 // onChange={this.handleInputChange}
                 />
            </label>
            </Grid.Column>
            <Grid.Column>
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
