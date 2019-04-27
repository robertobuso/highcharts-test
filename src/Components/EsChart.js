import React, { Component } from 'react';
import Highcharts from 'highcharts/highstock';

import HighchartsReact from '../HighchartsReact.js'
import LogicElement from './LogicElement.js'


class EsChart extends Component {
  constructor(props) {
    super(props);
    this.state = { formData: {},
                    options: {} }
    }

    componentDidMount() {
      this.setState( { formData: this.props.formData} )
    }

    componentDidUpdate() {
      if (this.props.formData !== this.state.formData) {
        this.setState( { formData: this.props.formData} )
      }
    }

    manageData = (data) => {
       this.setState({options: data,
                      formData: this.props.formData})
    }

    render() {

      return (
        <LogicElement
          formParameters={this.state.formData}
          manageData={this.manageData}
          />
      )
    }
}

export default EsChart;
