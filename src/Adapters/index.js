import esPrices from '../Data/esPrices.js';
import moment from 'moment-timezone';

let newArray =  []

while (esPrices.length > 1) {
    const bar = esPrices.splice(0, 9)
    newArray.push(bar)
  }

  const createDateTime = (bar) => {
    // data to moment object
    const stringDateTime = moment.utc(bar[0] + " " + bar[1])
    //moment object to local time zone
    const localDate = moment(stringDateTime).local()
    //moment object to iso format in local time zone
    const formatDate = localDate.format("x")
    //iso string to integer
    const dateTime = parseInt(formatDate)

    return dateTime
  }

export const actualBases = []

let potentialZone = []
let distinctPotentialZone = []
let arrayOfZones =[]
let candlestick = 0
let formation = ''
let zoneCeiling
let zoneFloor
let zoneHeight
let barDistanceFromDemandZone
let barDistanceFromSupplyZone
let firstBarIsLeg = false
let zoneData = []
let explosiveGroup = []
let groupDistanceFromSupplyZone
let lowestPriceArray
let lowestPriceInExplosiveGroup
let highestPriceArray
let highestPriceInExplosiveGroup
let groupDistanceFromDemandZone

//Set initial ceiling and floor based on direction of first bar
  if (newArray[0][5] - newArray[0][2] >= 0) {
    zoneCeiling = newArray[0][5]
    zoneFloor = newArray[0][4]
  } else {
    zoneCeiling = newArray[0][3]
    zoneFloor = newArray[0][5]
  }

const isItALeg = (bar) => {
  let candlestick

  if (bar[5] - bar[2] > 0) {
    candlestick = bar[5] - bar[2]
  } else {
    candlestick = bar[2] - bar[5]
  }

  let range = bar[3] - bar[4]

  if ((candlestick / range) >= 0.4) {
    return true
  } else {
    return false
  }
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

  let range = bar[3] - bar[4]
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
  if (isItALeg(newArray[0])) {
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
  barDistanceFromDemandZone = newArray[2][5] - zoneCeiling
  if (formation === 'rally' && barDistanceFromDemandZone >= zoneCeiling-zoneFloor && firstBarIsLeg === true ) {
    potentialZone.push(bar)
    distinctPotentialZone = [...new Set(potentialZone)]
    arrayOfZones.push(distinctPotentialZone)
    potentialZone = []
    console.log('This is a Potential Demand Zone', barDistanceFromDemandZone)
    console.log('Explosive Leg: ', bar)
  }

  //Is the third bar explosive in a Drop and the first bar is a Leg?
  barDistanceFromSupplyZone = zoneFloor - newArray[2][5]
  if (formation === 'drop' && barDistanceFromSupplyZone >= zoneCeiling-zoneFloor && firstBarIsLeg === true) {
    potentialZone.push(bar)
    arrayOfZones.push(potentialZone)
    potentialZone = []
    console.log('This is a Potential Supply Zone', barDistanceFromSupplyZone)
    console.log('Explosive Leg: ', bar)
  }
  }
} else {

  //After the third Bar, start looking back in time

//Is it a leg?
  if (idx >= 3 && isItALeg(bar)) {
    potentialZone = []
    let firstPotentialLeg
    let i = idx - 2
    let zoneInvalidatedByLegBases = false

    //Is there an Incoming Leg?
    if (idx > 6) {firstPotentialLeg = idx - 6} else {firstPotentialLeg = 0}

    while ( i >= firstPotentialLeg) {
      if (isItALeg(newArray[i])) {

        //Is it a rally or a drop?
        if (newArray[idx][5] - newArray[idx][2] >= 0) {
          candlestick = newArray[idx][5] - newArray[idx][2]
          formation = 'rally'
          console.log('This formation is set as RALLY in 171')
        } else {
          candlestick = newArray[idx][2] - newArray[idx][5]
          formation = 'drop'
          console.log('This formation is set as DROP in 175')
        }

      //Create Potential Zone array
      for (let z = i + 1; z < idx; z++) {
        potentialZone.push(newArray[z])
      }

      //Check to see if there are more than 5 bars in a row after Initial Leg
      if (potentialZone.length <= 5) {

        let highest = potentialZone.map( bar => bar[3])
        let lowest = potentialZone.map( bar => bar[4])
        let closing = potentialZone.map( bar => bar[5])

        //Set ceiling and floor of Zone based for Rally
        if (potentialZone.length === 1) {
          zoneCeiling = Math.max(...highest)
          zoneFloor = Math.min(...lowest)
        }
        else if (formation === 'rally') {
          zoneCeiling = Math.max(...closing)
          zoneFloor = Math.min(...lowest)
        }
        //Set ceiling and floor of Zone for Drop
        else if (formation === 'drop') {
          zoneCeiling = Math.max(...highest)
          zoneFloor = Math.min(...closing)
        }

        //Create potential Explosive Group array
        explosiveGroup =[]
        for (let z = 0; z < 4; z++) {
          explosiveGroup.push(newArray[idx + z])
        }

        // Check Leg-Bases
        let zoneInvalidatedByLegBases = false
        let numberOfLegs = 0

        console.log('The Zone is set: ', potentialZone)

        for (let index = 0; index < potentialZone.length; index++) {
          if (isItALeg(potentialZone[index])) {
            //Count it as a Leg-Base
            numberOfLegs = numberOfLegs + 1

            // Check if candlestick of the Leg-Base is higher than the ceiling of the Potential Demand Zone
            if(formation === 'rally' && potentialZone[index][5] > zoneCeiling) {
              zoneInvalidatedByLegBases = true
              break
            }

            // Check if candlestick of the Leg-Base is higher than the ceiling of the Potential Supply Zone
            if(formation === 'drop' && potentialZone[index][2] > zoneCeiling) {
              zoneInvalidatedByLegBases = true
              break
            }

            // Check if candlestick of the Leg-Base is lower than the floor of the Potential Demand Zone
            if(formation === 'rally' && potentialZone[index][2] < zoneFloor) {
              zoneInvalidatedByLegBases = true
              break
            }

            // Check if candlestick of the Leg-Base is lower than the floor of the Potential Supply Zone
            if(formation === 'supply' && potentialZone[index][5] < zoneFloor) {
              zoneInvalidatedByLegBases = true
              break
            }

            // Are there are more Leg-Bases than Bases?
            if( (numberOfLegs/potentialZone.length) > 0.5) {
              zoneInvalidatedByLegBases = true
              break
            }
          }
        }
        console.log('Was Zone Invalidated by Leg Bases? ', zoneInvalidatedByLegBases)
        if (zoneInvalidatedByLegBases === false) {
        //Check to see if bar is explosive in a Rally and less than 40% inside the Zone or if the 4 bars form an explosive group
        highestPriceArray = explosiveGroup.map(bar => bar ? bar[3] : null)
        highestPriceInExplosiveGroup = Math.max(...highestPriceArray)
        barDistanceFromDemandZone = bar[5] - zoneCeiling
        groupDistanceFromDemandZone =  highestPriceInExplosiveGroup - zoneCeiling
        zoneHeight = zoneCeiling-zoneFloor

        if(formation === 'rally') {
          console.log('highestPriceArray: ', highestPriceArray)
          console.log('highestPriceInExplosiveGroup: ', highestPriceInExplosiveGroup)
          console.log('barDistanceFromDemandZone: ', barDistanceFromDemandZone)
          console.log('groupDistanceFromDemandZone: ', groupDistanceFromDemandZone)
          console.log('zoneHeight: ', zoneHeight)
          console.log('bar: ', newArray[idx])
          console.log('Needs to be positive: ', newArray[idx][5] - newArray[idx][2])
          console.log('Formation: ', formation)
        }

        if (formation === 'rally' && (zoneCeiling === bar[2] || (((zoneCeiling-bar[2])/zoneHeight) <= 0.4)) && (barDistanceFromDemandZone >= zoneHeight || groupDistanceFromDemandZone >= (zoneHeight * 2))  ) {
          arrayOfZones.push(potentialZone)

          //Set data to draw Zone in chart
          zoneData.push(potentialZone.map( bar => {return {'x': createDateTime(bar), 'high': zoneCeiling, 'low':  zoneFloor}}))

          console.log('This is a Potential Demand Zone', potentialZone)
          console.log('Incoming Leg: ', newArray[i])
          console.log('Explosive Leg: ', bar)
          console.log('Zone Ceiling: ', zoneCeiling)
          console.log('Zone Floor: ', zoneFloor)
          console.log(i, idx)
          console.log('Formation: ', formation)

          zoneCeiling = undefined
          zoneFloor = undefined
        }

        //Check to see if bar is explosive in a Drop and less than 40% inside the Zone or if the 4 bars form an explosive group
        lowestPriceArray = explosiveGroup.map(bar => bar ? bar[4] : null)
        lowestPriceInExplosiveGroup = Math.min(...lowestPriceArray)
        barDistanceFromSupplyZone = bar[5] - zoneFloor
        groupDistanceFromSupplyZone =  lowestPriceInExplosiveGroup - zoneFloor
        zoneHeight = zoneFloor-zoneCeiling


                if(formation === 'drop') {
                  console.log('lowestPriceArray: ', lowestPriceArray)
                  console.log('lowestPriceInExplosiveGroup: ', lowestPriceInExplosiveGroup)
                  console.log('barDistanceFromSupplyZone: ', barDistanceFromSupplyZone)
                  console.log('groupDistanceFromSupplyZone: ', groupDistanceFromSupplyZone)
                  console.log('zoneHeight: ', zoneHeight)
                }

        if (formation === 'drop' && (zoneFloor === bar[2] || (((zoneFloor-bar[2])/zoneHeight) <= 0.4)) && (barDistanceFromSupplyZone <= zoneHeight || groupDistanceFromSupplyZone <= (zoneHeight * 2)) ) {
          arrayOfZones.push(potentialZone)

          //Set data to draw Zone in chart
          zoneData.push(potentialZone.map( bar => {return {'x': createDateTime(bar), 'high': zoneCeiling, 'low':  zoneFloor}}))

          console.log('This is a Potential Supply Zone', potentialZone)
          console.log('Incoming Leg: ', newArray[i])
          console.log('Explosive Leg: ', bar)
          console.log('Zone Ceiling: ', zoneCeiling)
          console.log('Zone Floor: ', zoneFloor)
          console.log(i, idx)

          zoneCeiling = undefined
          zoneFloor = undefined
        }
        //Finished setting Potential Zone, leave loop to return data for chart below
        break
        }
        }  else if (potentialZone.length > 5) {
          potentialZone = []
          console.log('More than 5 bars after leg without an explosive leg. Start looking for a new Zone!')
          break
        }
      } else {
        zoneInvalidatedByLegBases = false
        i = i - 1
      }
  }
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
    data: zoneData.flat(),
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
