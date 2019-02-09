// import Highcharts from 'highcharts/highstock';
// import goldData from '../Data/goldFutures.js';
// import moment from 'moment-timezone';
//
// const finalData = goldData.map( bar => {
//   const dateTime = parseInt(moment(bar["Date"] + " " + bar["Time"]).tz('America/New_York').format('x'))
//
//     return {"x": dateTime,
//     "open": bar["Open"],
//     "high": bar["High"],
//     "low": bar["Low"],
//     "close": bar["Close"]}
//   })
//
//
//    const TestChart =   Highcharts.stockChart('container', {
//         rangeSelector: {
//             selected: 1
//         },
//
//         title: {
//             text: 'MVF Backtesting App'
//         },
//
//         yAxis: [{
//             labels: {
//                 align: 'right',
//                 x: 1545030000000
//             },
//             title: {
//                 text: 'OHLC'
//             },
//             height: '60%',
//             lineWidth: 2,
//             resize: {
//                 enabled: true
//             }
//         }, {
//             labels: {
//                 align: 'right',
//                 x: 1545030000000
//             },
//             title: {
//                 text: 'Volume'
//             },
//             top: '65%',
//             height: '35%',
//             offset: 0,
//             lineWidth: 2
//         }],
//
//         tooltip: {
//             split: true
//         },
//
//         series: [{
//             type: 'candlestick',
//             name: 'AAPL',
//             data: finalData
//         }]
//     });
//
//     export default TestChart;
