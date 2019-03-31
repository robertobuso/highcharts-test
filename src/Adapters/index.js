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
let percentageInsideZone
let candlestickSizeOutsideZone = 0

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

    console.log('Potential OUTGOING Leg: ', idx)

    //Is there an Incoming Leg?
    if (idx > 7) {firstPotentialLeg = idx - 7} else {firstPotentialLeg = 0}

    while ( i >= firstPotentialLeg) {

      if (isItALeg(newArray[i])) {
        console.log('Potential INCOMING Leg: ', i)
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
        console.log('Pushing bar inside Potential Zone: ', z)
        potentialZone.push(newArray[z])
      }

      console.log('Potential Zone: ', potentialZone)

      //Check to see if there are more than 6 bars in a row after Initial Leg
      if (potentialZone.length <= 6) {

        let highest = potentialZone.map( bar => bar[3])
        let lowest = potentialZone.map( bar => bar[4])
        let topOfCandlestick = potentialZone.map( bar => {
                        return bar[5] > bar[2] ?  bar[5] : bar[2]
          })

        //Set ceiling and floor of Zone based for Rally
        if (potentialZone.length === 1) {
          zoneCeiling = Math.max(...highest)
          zoneFloor = Math.min(...lowest)
          zoneHeight = zoneCeiling - zoneFloor

          console.log('DOJI!!!', potentialZone.length)
          console.log('idx: ', idx)
          console.log('i: ', i)
          console.log('Potential Zone inside Doji: ', potentialZone)
        }
        else if (formation === 'rally') {
          zoneCeiling = Math.max(...topOfCandlestick)
          zoneFloor = Math.min(...lowest)
          zoneHeight = zoneCeiling - zoneFloor

          //Check for Attractor Bars
          if (i - 1 > 0 && newArray[i-1][4] <= zoneFloor && ( zoneFloor - newArray[i-1][4]) <= zoneHeight ) {
            zoneFloor = newArray[i-1][4]
            console.log('First Previous Bar is an Attractor Bar!')
          }

          if (i - 2 > 0 && newArray[i-2][4] <= zoneFloor && ( zoneFloor - newArray[i-2][4]) <= zoneHeight ) {
            zoneFloor = newArray[i-2][4]
            console.log('Second Previous Bar is an Attractor Bar!')
          }

        }
        //Set ceiling and floor of Zone for Drop
        else if (formation === 'drop') {
          zoneCeiling = Math.max(...highest)
          zoneFloor = Math.min(...topOfCandlestick)
          zoneHeight = zoneCeiling - zoneFloor

          //Check for Attractor Bars
          if (i - 1 > 0 && newArray[i-1][3] >= zoneCeiling && ( newArray[i-1][3] - zoneCeiling ) <= zoneHeight ) {
            zoneCeiling = newArray[i-1][3]
            console.log('First Previous Bar is an Attractor Bar!')
          }

          if (i - 2 > 0 && newArray[i-2][3] >= zoneCeiling && ( newArray[i-2][3] - zoneCeiling ) <= zoneHeight ) {
            zoneCeiling = newArray[i-2][3]
            console.log('Second Previous Bar is an Attractor Bar!')
          }
        }

console.log('zoneHeight: ', zoneHeight)
console.log('incomingLeg: ', i)
        //Is the Incoming Leg valid?
        //Set candlestick depending on Rally or Drop
        if (newArray[i][5] - newArray[i][2] >= 0) {
          incomingCandlestick = newArray[i][5] - newArray[i][2]
          incomingFormation = 'rally'

          //Set size outside Zone when leg is partly in Zone
          candlestickSizeOutsideZone = 0

          if (newArray[i][2] < zoneFloor) {
            candlestickSizeOutsideZone = candlestickSizeOutsideZone + (zoneFloor-newArray[i][2])
          }

          if (newArray[i][5] > zoneCeiling) {
            candlestickSizeOutsideZone = candlestickSizeOutsideZone + (newArray[i][5] - zoneCeiling)
          }

          console.log('Line 229, incomingLeg is a Rally')
          console.log('Line 230, before checking this is invalidIncomingLeg: ', invalidIncomingLeg)
        } else {
          incomingCandlestick = newArray[i][2] - newArray[i][5]
          incomingFormation = 'drop'

          //Set size outside Zone when leg is partly in Zone
          if (newArray[i][2] > zoneCeiling) {
            candlestickSizeOutsideZone = candlestickSizeOutsideZone + (newArray[i][2] - zoneCeiling)
          }

          if (newArray[i][5] < zoneFloor) {
            candlestickSizeOutsideZone = candlestickSizeOutsideZone + (zoneFloor - newArray[i][5])
          }

          console.log('Line 244, incomingLeg is a Drop')
          console.log('Line 245, before checking this is invalidIncomingLeg: ', invalidIncomingLeg)
        }

        //Is the Incoming Leg at least 25% bigger than zoneHeight and doesn't invade the Zone - Rally
        if (incomingFormation === 'rally' && ((newArray[i][2] >= zoneCeiling || newArray[i][5] <= zoneFloor)) && ((incomingCandlestick / zoneHeight) < 0.25 )) {
          invalidIncomingLeg = true
          console.log('Line 248: invalid Incoming Leg, outside Zone')
        } else if (incomingFormation === 'rally'
        &&
        //Incoming Leg is Outside Zone
        ((newArray[i][2] < zoneFloor && newArray[i][5] > zoneFloor) || (newArray[i][2] < zoneCeiling && newArray[i][2] > zoneCeiling))
        &&
        //Candlestick outside zone is less than 25% of Zone
        ( (candlestickSizeOutsideZone / zoneHeight) < 0.25 )) {
          invalidIncomingLeg = true
          console.log('Line 257: invalid Incoming Leg, inside Zone')
        }

        //Is the Incoming Leg at least 25% bigger than zoneHeight and doesn't invade the Zone - Drop
        if (incomingFormation === 'drop' && ((newArray[i][5] >= zoneCeiling || newArray[i][2] <= zoneFloor)) && ((incomingCandlestick / zoneHeight) < 0.25 )) {
          invalidIncomingLeg = true
        } else if (incomingFormation === 'drop'
        &&
        //Incoming Leg is Inside Zone
        ((newArray[i][5] < zoneCeiling && newArray[i][5] > zoneFloor) || (newArray[i][2] < zoneFloor && newArray[i][2] > zoneCeiling))
        &&
        //Candlestick outside zone is less than 25% of Zone
        ( (candlestickSizeOutsideZone / zoneHeight) < 0.25 )) {
          invalidIncomingLeg = true
          console.log('Line 276: invalid Incoming Leg, inside Zone')
        }

        if (invalidIncomingLeg === false) {
          console.log('Incoming Leg is Valid, line 305')
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
              console.log('Invalidated by Leg Bases 1')
              break
            }

            // Check if candlestick of the Leg-Base is higher than the ceiling of the Potential Supply Zone
            if (formation === 'drop' && potentialZone[index][2] > zoneCeiling) {
              zoneInvalidatedByLegBases = true
              console.log('Invalidated by Leg Bases 2')
              break
            }

            // Check if candlestick of the Leg-Base is lower than the floor of the Potential Demand Zone
            if (formation === 'rally' && potentialZone[index][2] < zoneFloor) {
              zoneInvalidatedByLegBases = true
              console.log('Invalidated by Leg Bases 3')
              break
            }

            // Check if candlestick of the Leg-Base is lower than the floor of the Potential Supply Zone
            if (formation === 'drop' && potentialZone[index][5] < zoneFloor) {
              zoneInvalidatedByLegBases = true
              console.log('Invalidated by Leg Bases 4')
              break
            }

            // Are there are more Leg-Bases than Bases?
            if( (numberOfLegs/potentialZone.length) > 0.5) {
              zoneInvalidatedByLegBases = true
              console.log('Invalidated by Leg Bases 5')
              break
            }
          }
        }

        if (zoneInvalidatedByLegBases === false) {

        //Set the percentage the leg is inside the Zone depending on where it penetrates
        if (bar[4] < zoneCeiling && bar[3] > zoneFloor) {
          if (bar[4] < zoneCeiling) {
            percentageInsideZone = (zoneCeiling - bar[4]) / zoneHeight
          } else {
            percentageInsideZone = (bar[3] - zoneFloor) / zoneHeight
          }
        }

        //Check if bar is explosive in a Rally and less than 40% inside the Zone or if the 4 bars form an explosive group
        highestPriceArray = explosiveGroup.map(bar => bar ? bar[3] : null)
        highestPriceInExplosiveGroup = Math.max(...highestPriceArray)
        barDistanceFromDemandZone = bar[3] - zoneCeiling
        groupDistanceFromDemandZone =  highestPriceInExplosiveGroup - zoneCeiling
        zoneHeight = zoneCeiling - zoneFloor
        console.log('IDS: ', i, idx)
        console.log('Potential Zone: ', potentialZone)
        console.log('Explosive Group: ', explosiveGroup)
        console.log('Highest Price in Explosive Group: ', highestPriceInExplosiveGroup)

        if (formation === 'rally' && (
        //Outgoing Leg is Outside Zone
        ( (bar[4] >= zoneCeiling || bar[3] <= zoneFloor) &&
        //Distance between Highest Price of the Explosive Bar or Group is equal to or more than 1X or 2X the zoneHeight
        (
          barDistanceFromDemandZone >= zoneHeight || groupDistanceFromDemandZone >= (zoneHeight * 2)
        )
        )
       ||
        //Outgoing Leg is Inside Zone
        (
        (bar[4] < zoneCeiling && bar[3] > zoneFloor) &&

        //The part of the Outgoing Leg Inside Zone is equal to or less than 40% of the zoneHeight
        (percentageInsideZone <= 0.4 &&

        //The distance between Highest Price of the Explosive Bar or Group is equal to or more than 1X or 2X the zoneHeight
        (barDistanceFromDemandZone >= zoneHeight || groupDistanceFromDemandZone >= (zoneHeight * 2))
        ) ) ) )
        {
          //Check for Attractor Zones
            //Create Array with the ZoneCeiling of all the Previous Rally Zones

            let newArrayOfZones = arrayOfZones.filter(zone => zone[4]['formation'] === 'rally').map(rallyZone => rallyZone[1]['zoneCeiling'])
            //Check if the previous zoneCeilings are under the current zoneFloor and close enough to Zone
            for(let x = 0; x < newArrayOfZones.length; x++) {
              if (newArrayOfZones[x] <= zoneFloor && ( (zoneFloor - newArrayOfZones[x]) <= (zoneHeight * 2) ) ) {
                demandAttractorZoneFound = true
                console.log('Attractor Zone! Line 373')
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
          }
        }

        //Check to see if bar is explosive in a Drop and less than 40% inside the Zone or if the 4 bars form an explosive group
        lowestPriceArray = explosiveGroup.map(bar => bar ? bar[4] : null)
        lowestPriceInExplosiveGroup = Math.min(...lowestPriceArray)
        barDistanceFromSupplyZone = zoneFloor - bar[4]
        groupDistanceFromSupplyZone =  zoneFloor - lowestPriceInExplosiveGroup
        zoneHeight = zoneCeiling - zoneFloor

        if (formation === 'drop' && (
        //Outgoing Leg is Outside Zone
        ( (bar[4] >= zoneCeiling || bar[3] <= zoneFloor) &&
        //Distance between Lowest Price of the Explosive Bar or Group is equal to or more than 1X or 2X the zoneHeight
        (
          barDistanceFromSupplyZone >= zoneHeight || groupDistanceFromSupplyZone >= (zoneHeight * 2)
        )
        )
       ||
        //Outgoing Leg is Inside Zone
        (
        (bar[4] < zoneCeiling && bar[3] > zoneFloor) &&

        //The part of the Outgoing Leg Inside Zone is equal to or less than 40% of the zoneHeight
        (percentageInsideZone <= 0.4 &&

        //The distance between Highest Price of the Explosive Bar or Group is equal to or more than 1X or 2X the zoneHeight
        (barDistanceFromSupplyZone >= zoneHeight || groupDistanceFromSupplyZone >= (zoneHeight * 2))

        ) ) ) )
        {
          //Check for Attractor Zones
            //Create Array with the zoneFloor of all the Previous Supply Zones
            let newArrayOfSupplyZones = arrayOfZones.filter(zone => zone[4]['formation'] === 'drop').map(dropZone => dropZone[2]['zoneFloor'])
            //Check if the previous zoneFloors are over the current zoneCeiling and close enough to Zone
            for(let x = 0; x < newArrayOfSupplyZones.length; x++) {
              if (newArrayOfSupplyZones[x] >= zoneCeiling && ( (newArrayOfSupplyZones[x] - zoneCeiling) <= (zoneHeight * 2) ) ) {
                supplyAttractorZoneFound = true
                console.log('Attractor Zone! Line 426')
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
      i = i - 1
      }
      //This is when invalidIncomingLeg === true

    }  else if (potentialZone.length > 6) {
      //There were more than 6 bases in between Incoming Leg and Outgoing Leg -- UNUSED
        potentialZone = []
        invalidIncomingLeg = false
        zoneInvalidatedByLegBases = false
        break
      }
      //Go back to initial i loop, checking previous bar if there is one
      potentialZone = []
      invalidIncomingLeg = false
      zoneInvalidatedByLegBases = false
      candlestickSizeOutsideZone = 0
      i = i - 1
    } else {
      potentialZone = []
      invalidIncomingLeg = false
      zoneInvalidatedByLegBases = false
      candlestickSizeOutsideZone = 0
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
