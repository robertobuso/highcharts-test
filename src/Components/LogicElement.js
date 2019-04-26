import React, { Component } from 'react';
import { Grid } from 'semantic-ui-react'
import { finalIncomingLegPercentage } from '../Adapters'


class LogicElement extends Component {

  state = { receivingData: 'HELLO DOLLY'}

  componentDidMount() {
    this.setState({ receivingData: this.state.receivingData + this.props.testData})
  }

  render() {
    return (
      this.props.manageData(this.state.receivingData)
    )
  }

}

    export default LogicElement;
