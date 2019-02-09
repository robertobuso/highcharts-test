import React from "react";

export default class HighchartsReact extends React.PureComponent {
  constructor(props) {
    super(props);
    this.container = React.createRef();
  }

  componentDidMount() {
    const props = this.props;
    const highcharts = props.highcharts || window.Highcharts;
    // Create chart
    this.chart = highcharts[props.constructorType || "chart"](
      this.container.current,
      props.options,
      props.callback ? props.callback : undefined
    );
    this.rectangle()
  }

  componentDidUpdate() {
    if (this.props.allowChartUpdate !== false) {
      this.chart.update(
        this.props.options,
        ...(this.props.updateArgs || [true, true])
      );
    }
  }

  componentWillUnmount() {
    // Destroy chart
    if (this.chart) {
      this.chart.destroy();
      this.chart = null;
    }
  }

  rectangle() { // on complete
    this.chart.renderer.rect(100, 100, 100, 100, 5)
        .attr({
            'stroke-width': 2,
            stroke: 'red',
            fill: 'yellow',
            zIndex: 3
        }).add();

}

  render() {
    // Create container for the chart
    return React.createElement("div", { ref: this.container });
  }
}
