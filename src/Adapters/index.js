import esPrices from '../Data/esPrices.js';
import moment from 'moment-timezone';

let newArray =  []

while (esPrices.length > 1) {
    const bar = esPrices.splice(0, 9)
    newArray.push(bar)
  }

export const actualBases = []

let firstLeg = false
let potentialZone = []
let zoneCeiling = 0
let zoneFloor = newArray[0][4]
const arrayOfZones =[]
let candlestick = 0
let formation = ''

export const finalData = newArray.map( bar => {
  // data to moment object
  const stringDateTime = moment.utc(bar[0] + " " + bar[1])
  //moment object to local time zone
  const localDate = moment(stringDateTime).local()
  //moment object to iso format in local time zone
  const formatDate = localDate.format("x")
  //iso string to integer
  const dateTime = parseInt(formatDate)

    //Here we see if it's a drop or a rally
    if (bar[5] - bar[2] > 0) {
      candlestick = bar[5] - bar[2]
      formation = 'rally'
    } else {
      candlestick = bar[2] - bar[5]
      formation = 'drop'
    }

    const range = bar[3] - bar[4]

  //Here we see if it's a bar or a leg
    if (candlestick / range < 0.4) {
      actualBases.push(dateTime)
    }

  const idx = newArray.indexOf(bar)

  //If there is no Potential Zone open, is this a first leg?
  if (firstLeg === false && candlestick / range >= 0.4) {
    firstLeg = true
    potentialZone.push(bar)
    console.log('First Leg: ', bar)
  }
  //Here we set ceiling of Zone based on the current bar as Rally
  else if (formation === 'rally' && bar[5] > zoneCeiling) {
    zoneCeiling = bar[5]
  }
  //Here we set ceiling of Zone based on the current bar as Drop
  else if (formation === 'drop' && bar[3] > zoneCeiling) {
    zoneCeiling = bar[3]
  }
  //Here we set floor of Zone based on the current bar as Rally
  else if (formation === 'rally' && bar[4] < zoneFloor) {
    zoneFloor = bar[4]
  }
  //Here we set floor of Zone based on the current bar as Drop
  else if (formation === 'drop' && bar[5] < zoneFloor) {
    zoneFloor = bar[5]
  }

  console.log('sizeOfZone: ', zoneCeiling - zoneFloor)

  //Check to see if bar is explosive



    return {"x": dateTime,
    "open": bar[2],
    "high": bar[3],
    "low": bar[4],
    "close": bar[5]}
  })

  export const finalPotentialZones = arrayOfZones

  export const baseMarkers = actualBases.map( base => {
      return {'x': base,
      'title': ' '}
    })

export const options = {
      chart: {
        zoomType: 'xy',

        xAxis: {
          minRange: 3600000
        },
        type: 'candlestick'
      }
,        plotOptions: {
           candlestick: {
                      color: 'red',
                      upColor: 'green'
                  }
        },

        rangeSelector: {
            enabled: false
        },

        title: {
            text: 'Envoy LLC Backtesting App'
        },

       time: {
            timezone: 'America/New_York'
       },

       exporting: {
         enabled: false
       },

      series: [
              { type: 'candlestick',
                name: 'E-Mini S&P 500',
                data: finalData,
                id: 'candlestick'
              },
              {
            type: 'flags',
            data: baseMarkers,
            onSeries: 'candlestick',
           shape: 'circlepin',
           width: 1,
           fillColor: 'blue'
          },
              {
  	type: 'columnrange',
    name: '',
    id: 'zone',
    grouping: false,
    groupPadding: true,
    pointPadding: 1,
    borderRadius: 0,
    showInLegend: false,
    borderColor: '',
    borderWidth: 2,
    color: 'orange',
    opacity: 0.3,
    zIndex: -1,
    data: [{
      x: 1546405200000,
      low: 2461.5,
      high: 2496.5,
    },
    {
      x: 1546408800000,
      low: 2461.5,
      high: 2496.5,
    },
    {
      x: 1546412400000,
      low: 2461.5,
      high: 2496.5,
    },
    {
      x: 1546416000000,
      low: 2461.5,
      high: 2496.5,
    },
    {
      x: 1546419600000,
      low: 2461.5,
      high: 2496.5,
    },
    {
      x: 1546423200000,
      low: 2461.5,
      high: 2496.5,
    }],
    pointRange: 3600000
  }
      ],
      yAxis: {
          min: 2445,
          title: {
              text: 'Price'
          },
          plotLines: [{
            color: 'blue',
            width: 1,
            value: 2496.5
          }, {
            color: 'blue',
            width: 1,
            value: 2461.5
          }
        ]
      }
      }

      export const optionsTwo = {
            chart: {
              height: '100%',
              zoomType: 'xy',

              xAxis: {
                minRange: 3600000
              },
              type: 'candlestick'
            }
      ,        plotOptions: {
                 candlestick: {
                            color: 'red',
                            upColor: 'green'
                        }
              },

              rangeSelector: {
                  enabled: false
              },

              title: {
                  text: 'Envoy LLC Backtesting App'
              },

             time: {
                  timezone: 'America/New_York'
             },

             exporting: {
               enabled: false
             },

            series: [
                    { type: 'candlestick',
                      name: 'E-Mini S&P 500',
                      data: finalData,
                      id: 'candlestick'
                    },
                    {
                  type: 'flags',
                  data: baseMarkers,
                  onSeries: 'candlestick',
                 shape: 'circlepin',
                 width: 1,
                 fillColor: 'blue'
                },
                    {
        	type: 'columnrange',
          name: '',
          id: 'zone',
          grouping: false,
          groupPadding: true,
          pointPadding: 1,
          borderRadius: 0,
          showInLegend: false,
          borderColor: '',
          borderWidth: 2,
          color: 'orange',
          opacity: 0.3,
          zIndex: -1,
          data: [{
            x: 1546405200000,
            low: 2461.5,
            high: 2496.5,
          },
          {
            x: 1546408800000,
            low: 2461.5,
            high: 2496.5,
          },
          {
            x: 1546412400000,
            low: 2461.5,
            high: 2496.5,
          },
          {
            x: 1546416000000,
            low: 2461.5,
            high: 2496.5,
          },
          {
            x: 1546419600000,
            low: 2461.5,
            high: 2496.5,
          },
          {
            x: 1546423200000,
            low: 2461.5,
            high: 2496.5,
          }],
          pointRange: 3600000
        }
            ],
            yAxis: {
                min: 2445,
                title: {
                    text: 'Price'
                },
                plotLines: [{
                  color: 'blue',
                  width: 1,
                  value: 2496.5
                }, {
                  color: 'blue',
                  width: 1,
                  value: 2461.5
                }
              ]
            }
            }
