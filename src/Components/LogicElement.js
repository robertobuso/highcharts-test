import React, { Component } from 'react';
import { Grid } from 'semantic-ui-react'
import {options, finalPotentialZones, finalPositions, notFresh, badIncomingLeg, badLegBases, foundAttractor, unused, finalIncomingLegPercentage} from '../Adapters'

class LogicElement extends Component {


  constructor(props) {
    super(props);
    this.state = { options: {}}
    }


  componentDidMount() {
    this.setState({ options: options}, () => this.props.manageData(this.state.options))

  }

  render() {
    return (
      <div></div>
    )
  }

}

    export default LogicElement;
