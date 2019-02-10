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
    // this.renderRectangle()
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

  // renderRectangle() {
  //   const xAxis = this.chart.xAxis[0];
  //   const yAxis = this.chart.yAxis[0];
  //   const rectangle = this.chart.renderer.rect(xAxis.toPixels(1545058800000), yAxis.toPixels(1250), 50, 20, 5)
  //       .attr({
  //           'stroke-width': 2,
  //           stroke: 'red',
  //           fill: 'yellow',
  //           opacity: 0.4,
  //           zIndex: -0
  //       }).on('click', () => {
  //           rectangle.animate({
  //               x: 50,
  //               y: 100,
  //               width: 200,
  //               height: 200,
  //               'stroke-width': 2
  //           })}).add();
  //   }

  render() {
    // Create container for the chart
    return React.createElement("div", { ref: this.container });
  }
}
