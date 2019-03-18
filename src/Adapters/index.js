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
let distinctPotentialZone = []
const arrayOfZones =[]
let candlestick = 0
let formation = ''
let numberOfBasesAfterLeg = 0
let zoneCeiling
let zoneFloor
let range
let distanceFromDemandZone
let distanceFromSupplyZone
let firstBarIsLeg = false

//Set initial ceiling and floor based on direction of first bar
  if (newArray[0][5] - newArray[0][2] >= 0) {
    zoneCeiling = newArray[0][5]
    zoneFloor = newArray[0][4]
  } else {
    zoneCeiling = newArray[0][3]
    zoneFloor = newArray[0][5]
  }

export const finalData = newArray.map( bar => {
  // data to moment object
  const stringDateTime = moment.utc(bar[0] + " " + bar[1])
  //moment object to local time zone
  const localDate = moment(stringDateTime).local()
  //moment object to iso format in local time zone
  const formatDate = localDate.format("x")
  //iso string to integer
  const dateTime = parseInt(formatDate)
  //set index of bar inside data array
  const idx = newArray.indexOf(bar)

    //Here we see if it's a drop or a rally
    if (bar[5] - bar[2] > 0) {
      candlestick = bar[5] - bar[2]
      formation = 'rally'
    } else {
      candlestick = bar[2] - bar[5]
      formation = 'drop'
    }

    range = bar[3] - bar[4]

  //Here we see if it's a bar or a leg
    if (candlestick / range < 0.4) {
      actualBases.push(dateTime)
    }

  //Check first three bars
  if (idx < 3) {
  //Set candlestick and range of first Bar
  if (newArray[0][5] - newArray[0][2] > 0) {
    candlestick = newArray[0][5] - newArray[0][2]
    formation = 'rally'
  } else {
    candlestick = newArray[0][2] - newArray[0][5]
    formation = 'drop'
  }

  range = newArray[0][3] - newArray[0][4]

//Here we see if first Bar is a Base or a Leg
  if ((candlestick / range) >= 0.4) {
    firstBarIsLeg = true
  }

  //Set rally or drop, ceiling and floor based on third bar
  if (newArray[2][5] - newArray[2][2] > 0) {
    candlestick = newArray[2][5] - newArray[2][2]
    formation = 'rally'
    zoneCeiling = newArray[1][5]
    zoneFloor = newArray[1][4]
  } else {
    candlestick = newArray[2][2] - newArray[2][5]
    formation = 'drop'
    zoneCeiling = newArray[1][3]
    zoneFloor = newArray[1][5]
  }

  //Is the third bar explosive in a Rally and the first bar is a Leg?
  distanceFromDemandZone = newArray[2][5] - zoneCeiling
  if (formation === 'rally' && distanceFromDemandZone >= zoneCeiling-zoneFloor && firstBarIsLeg === true ) {
    potentialZone.push(bar)
    distinctPotentialZone = [...new Set(potentialZone)]
    arrayOfZones.push(distinctPotentialZone)
    firstLeg = false
    potentialZone = []
    console.log('This is a Potential Demand Zone', distanceFromDemandZone)
    console.log('Explosive Leg: ', bar)
  }

  //Is the third bar explosive in a Drop and the first bar is a Leg?
  distanceFromSupplyZone = zoneFloor - newArray[2][5]
  if (formation === 'drop' && distanceFromSupplyZone >= zoneCeiling-zoneFloor && firstBarIsLeg === true) {
    potentialZone.push(bar)
    arrayOfZones.push(potentialZone)
    firstLeg = false
    potentialZone = []
    console.log('This is a Potential Supply Zone', distanceFromSupplyZone)
    console.log('Explosive Leg: ', bar)
  }
} else {

  //After the third Bar, start looking back in time

  //Here we set ceiling of Zone based on the current bar as Rally
  if (formation === 'rally' && bar[5] > zoneCeiling) {
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

  //Check to see if bar is explosive in a Rally
  distanceFromDemandZone = bar[5] - zoneCeiling
  if (formation === 'rally' && distanceFromDemandZone >= zoneCeiling-zoneFloor) {
    potentialZone.push(bar)
    distinctPotentialZone = [...new Set(potentialZone)]
    arrayOfZones.push(distinctPotentialZone)
    firstLeg = false
    potentialZone = []
    zoneCeiling = undefined
    zoneFloor = undefined
    console.log('This is a Potential Demand Zone', distanceFromDemandZone)
    console.log('Explosive Leg: ', bar)
  }

  //Check to see if bar is explosive in a Drop
  distanceFromSupplyZone = zoneFloor - bar[5]
  if (formation === 'drop' && distanceFromSupplyZone >= zoneCeiling-zoneFloor) {
    potentialZone.push(bar)
    arrayOfZones.push(potentialZone)
    firstLeg = false
    potentialZone = []
    zoneCeiling = undefined
    zoneFloor = undefined
    console.log('This is a Potential Supply Zone', distanceFromSupplyZone)
    console.log('Explosive Leg: ', bar)
  }

  //If the bar is a base after an Initial Leg, include it in the Potential Zone
  else if (firstLeg === true && candlestick / range < 0.4){
    potentialZone.push(bar)
    console.log('This is a base: ', candlestick / range)
  }
  //If the bar is a leg-base after an Initial Leg, include it in the Potential Zone
  else if (firstLeg === true && candlestick / range >= 0.4){
    potentialZone.push(bar)
    console.log('This is a leg-base: ', candlestick / range)
  }

  //Check to see if there are more than 6 bars in a row after Initial Leg
  if (potentialZone.length > 5) {
    firstLeg = false
    potentialZone = []
    console.log('More than 5 bars after leg without an explosive leg. Start looking for a new Zone!')
  }

}
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
          min: 2595,
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
