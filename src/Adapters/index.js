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
let demandAttractorZoneFound = false
let supplyAttractorZoneFound = false
let incomingCandlestick
let incomingFormation
let invalidIncomingLeg = false

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

//Check if first Bar is a Base or a Leg
  if (isItALeg(newArray[0])) {
  //Set rally or drop, ceiling and floor based on third bar
  if (newArray[2][5] - newArray[2][2] > 0) {
    candlestick = newArray[2][5] - newArray[2][2]
    formation = 'rally'
    zoneCeiling = newArray[1][3]
    zoneFloor = newArray[1][4]
  } else {
    candlestick = newArray[2][2] - newArray[2][5]
    formation = 'drop'
    zoneCeiling = newArray[1][3]
    zoneFloor = newArray[1][4]
  }

  //Is the third bar explosive in a Rally and the first bar is a Leg?
  barDistanceFromDemandZone = newArray[2][3] - zoneCeiling
  if (formation === 'rally' && barDistanceFromDemandZone >= zoneCeiling-zoneFloor) {
    potentialZone.push(newArray[1])
    distinctPotentialZone = [...new Set(potentialZone)]

    arrayOfZones.push([ {'bases': distinctPotentialZone}, {'zoneCeiling': zoneCeiling}, {'zoneFloor': zoneFloor}, {'zoneHeight': zoneHeight}, {'formation': formation}, {'type': ''}, {'incomingLeg': 0}, {'outgoingLeg': 3} ])

    potentialZone = []
  }

  //Is the third bar explosive in a Drop and the first bar is a Leg?
  barDistanceFromSupplyZone = zoneFloor - newArray[2][4]
  if (formation === 'drop' && barDistanceFromSupplyZone >= zoneCeiling-zoneFloor) {
    potentialZone.push(newArray[1])

    arrayOfZones.push([ {'bases': distinctPotentialZone}, {'zoneCeiling': zoneCeiling}, {'zoneFloor': zoneFloor}, {'zoneHeight': zoneHeight}, {'formation': formation}, {'type': ''}, {'incomingLeg': 0}, {'outgoingLeg': 3} ])

    potentialZone = []
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
    if (idx > 7) {firstPotentialLeg = idx - 7} else {firstPotentialLeg = 0}

    while ( i >= firstPotentialLeg) {
      if (isItALeg(newArray[i])) {

        //Is it a rally or a drop?
        if (newArray[idx][5] - newArray[idx][2] >= 0) {
          candlestick = newArray[idx][5] - newArray[idx][2]
          formation = 'rally'
        } else {
          candlestick = newArray[idx][2] - newArray[idx][5]
          formation = 'drop'
        }

      //Create Potential Zone array
      for (let z = i + 1; z < idx; z++) {
        potentialZone.push(newArray[z])
      }

      //Check to see if there are more than 6 bars in a row after Initial Leg
      if (potentialZone.length <= 6) {

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
          zoneHeight = zoneCeiling - zoneFloor
        }
        //Set ceiling and floor of Zone for Drop
        else if (formation === 'drop') {
          zoneCeiling = Math.max(...highest)
          zoneFloor = Math.min(...closing)
          zoneHeight = zoneFloor - zoneCeiling
        }

        //Is the Incoming Leg valid?
        //Set candlestick depending on Rally or Drop
        if (newArray[i][5] - newArray[i][2] >= 0) {
          incomingCandlestick = newArray[i][5] - newArray[i][2]
          incomingFormation = 'rally'
        } else {
          incomingCandlestick = newArray[i][2] - newArray[i][5]
          incomingFormation = 'drop'
        }

        //Is the Incoming Leg at least 25% bigger than zoneHeight and doesn't invade the Zone - Rally
        if (incomingFormation === 'rally' && (newArray[i][2] > zoneCeiling) && ((incomingCandlestick / zoneHeight) < 0.25 )) {
          invalidIncomingLeg = true
        } else if (incomingFormation === 'rally' && ((newArray[i][2] < zoneCeiling && newArray[i][2] > zoneFloor) || (newArray[i][5] > zoneFloor && newArray[i][5] < zoneCeiling))  &&  ( (newArray[i][5] - zoneCeiling) / zoneHeight < 0.25 )) {
          invalidIncomingLeg = true
        }

        //Is the Incoming Leg at least 25% bigger than zoneHeight and doesn't invade the Zone - Drop
        if (incomingFormation === 'drop' && (newArray[i][5] > zoneCeiling) && ((incomingCandlestick / zoneHeight) < 0.25 )) {
          invalidIncomingLeg = true
        } else if (incomingFormation === 'drop' && ((newArray[i][5] < zoneCeiling && newArray[i][5] > zoneFloor) || (newArray[i][2] < zoneFloor && newArray[i][2] > zoneCeiling))  &&  ( (newArray[i][5] - zoneCeiling) / zoneHeight < 0.25 )) {
          invalidIncomingLeg = true
        }

        if (invalidIncomingLeg === false) {
        //Create potential Explosive Group array
        explosiveGroup =[]
        for (let z = 0; z < 4; z++) {
          explosiveGroup.push(newArray[idx + z])
        }

        // Check Leg-Bases
        let zoneInvalidatedByLegBases = false
        let numberOfLegs = 0

        for (let index = 0; index < potentialZone.length; index++) {
          if (isItALeg(potentialZone[index])) {
            //Count it as a Leg-Base
            numberOfLegs = numberOfLegs + 1

            // Check if candlestick of the Leg-Base is higher than the ceiling of the Potential Demand Zone
            if (formation === 'rally' && potentialZone[index][5] > zoneCeiling) {
              zoneInvalidatedByLegBases = true
              break
            }

            // Check if candlestick of the Leg-Base is higher than the ceiling of the Potential Supply Zone
            if (formation === 'drop' && potentialZone[index][2] > zoneCeiling) {
              zoneInvalidatedByLegBases = true
              break
            }

            // Check if candlestick of the Leg-Base is lower than the floor of the Potential Demand Zone
            if (formation === 'rally' && potentialZone[index][2] < zoneFloor) {
              zoneInvalidatedByLegBases = true
              break
            }

            // Check if candlestick of the Leg-Base is lower than the floor of the Potential Supply Zone
            if (formation === 'drop' && potentialZone[index][5] < zoneFloor) {
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

        if (zoneInvalidatedByLegBases === false) {
        //Check to see if bar is explosive in a Rally and less than 40% inside the Zone or if the 4 bars form an explosive group
        highestPriceArray = explosiveGroup.map(bar => bar ? bar[3] : null)
        highestPriceInExplosiveGroup = Math.max(...highestPriceArray)
        barDistanceFromDemandZone = bar[3] - zoneCeiling
        groupDistanceFromDemandZone =  highestPriceInExplosiveGroup - zoneCeiling
        zoneHeight = zoneCeiling-zoneFloor

        if (formation === 'rally' && (zoneCeiling === bar[2] || (((zoneCeiling-bar[4])/zoneHeight) <= 0.4)) && (barDistanceFromDemandZone >= zoneHeight || groupDistanceFromDemandZone >= (zoneHeight * 2))  ) {

          //Check for Attractor Zones
            //Create Array with the ZoneCeiling of all the Previous Rally Zones

            let newArrayOfZones = arrayOfZones.filter(zone => zone[4]['formation'] === 'rally').map(rallyZone => rallyZone[1]['zoneCeiling'])
            //Check if the previous zoneCeilings are under the current zoneFloor and close enough to Zone
            for(let x = 0; x < newArrayOfZones.length; x++) {
              if (newArrayOfZones[x] <= zoneFloor && ( (zoneFloor - newArrayOfZones[x]) <= (zoneHeight * 2) ) ) {
                demandAttractorZoneFound = true
                break
              } else {
                demandAttractorZoneFound = false
              }
            }

          if (demandAttractorZoneFound === false) {
          arrayOfZones.push([ {'bases': potentialZone}, {'zoneCeiling': zoneCeiling}, {'zoneFloor': zoneFloor}, {'zoneHeight': zoneHeight}, {'formation': formation}, {'type': ''}, {'incomingLeg': i}, {'outgoingLeg': idx} ])

          //Set data to draw Zone in chart
          zoneData.push(potentialZone.map( bar => {return {'x': createDateTime(bar), 'high': zoneCeiling, 'low':  zoneFloor}}))

          zoneCeiling = undefined
          zoneFloor = undefined
          break
          }
        }

        //Check to see if bar is explosive in a Drop and less than 40% inside the Zone or if the 4 bars form an explosive group
        lowestPriceArray = explosiveGroup.map(bar => bar ? bar[4] : null)
        lowestPriceInExplosiveGroup = Math.min(...lowestPriceArray)
        barDistanceFromSupplyZone = zoneFloor - bar[4]
        groupDistanceFromSupplyZone =  zoneFloor - lowestPriceInExplosiveGroup
        zoneHeight = zoneCeiling - zoneFloor

        if (formation === 'drop' && (zoneFloor === bar[2] || (((bar[2]-zoneFloor)/zoneHeight) <= 0.4)) && (barDistanceFromSupplyZone >= zoneHeight || groupDistanceFromSupplyZone >= (zoneHeight * 2)) ) {

          //Check for Attractor Zones
            //Create Array with the zoneFloor of all the Previous Supply Zones
            let newArrayOfSupplyZones = arrayOfZones.filter(zone => zone[4]['formation'] === 'drop').map(dropZone => dropZone[2]['zoneFloor'])
            //Check if the previous zoneFloors are over the current zoneCeiling and close enough to Zone
            for(let x = 0; x < newArrayOfSupplyZones.length; x++) {
              if (newArrayOfSupplyZones[x] >= zoneCeiling && ( (newArrayOfSupplyZones[x] - zoneCeiling) <= (zoneHeight * 2) ) ) {
                supplyAttractorZoneFound = true
              }
            }

          if (supplyAttractorZoneFound === false) {
            arrayOfZones.push([ {'bases': potentialZone}, {'zoneCeiling': zoneCeiling}, {'zoneFloor': zoneFloor}, {'zoneHeight': zoneHeight}, {'formation': formation}, {'type': ''}, {'incomingLeg': i}, {'outgoingLeg': idx} ])

            //Set data to draw Zone in chart
            zoneData.push(potentialZone.map( bar => {return {'x': createDateTime(bar), 'high': zoneCeiling, 'low':  zoneFloor}}))

            zoneCeiling = undefined
            zoneFloor = undefined
          }
        }
      }
      //Finished setting Potential Zone, leave loop to return data for chart below
      break
      }
      //This is when invalidIncomingLeg === true

    }  else if (potentialZone.length > 6) {
        potentialZone = []
        invalidIncomingLeg = false
        zoneInvalidatedByLegBases = false
        console.log('More than 6 bars after leg without an explosive leg. Start looking for a new Zone!')
        break
      }
    } else {
      potentialZone = []
      invalidIncomingLeg = false
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
          tickInterval: 10,
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
                tickInterval: 10,
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
