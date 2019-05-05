import React, { Component } from 'react';
import secondHgPrices from '../Data/secondHgPrices.js';
import moment from 'moment-timezone';

let potentialZone = []
let distinctPotentialZone = []
let freshZones = []
let invalidZones = []
let candlestick = 0
let formation = ''
let zoneCeiling
let zoneFloor
let zoneHeight
let barDistanceFromDemandZone
let barDistanceFromSupplyZone
let zoneData = []
let notFreshZoneData = []
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
let averageTrueRange = 0
let positionArray = []
let priceReturnedBars = []
let stopBars = []
let breakEvenBars = []
let positionClosedZone = []
let zoneLines = []
let potentialFreshZones = []
let notFreshZones = []
let invalidIncomingLegZones = []
let invalidLegBaseZones = []
let invalidAttractorZones = []
let unusedZones = []
let resultsData = {'t3': 0, 'break even': 0, 'stop': 0, 'open': 0, 'unfilled': 0}
let filledPosition = {}
let processedData = []
let newArray =  []
let actualBases = []

while (secondHgPrices.length > 1) {
    const bar = secondHgPrices.splice(0, 9)
    newArray.push(bar)
  }

  //Set initial ceiling and floor based on direction of first bar
if (newArray[0][5] - newArray[0][2] >= 0) {
      zoneCeiling = newArray[0][5]
      zoneFloor = newArray[0][4]
} else {
  zoneCeiling = newArray[0][3]
  zoneFloor = newArray[0][5]
}

  //Variables for Parameters Form
  let globalIncomingLegPercentage = 0
  let outgoingLegPercentage = 0.4
  let explosiveBarMultiplier = 1
  let explosiveGroupMultiplier = 2
  let veryExplosiveGroupMultiplier = 4
  let explosiveGroupBars = 5

 class OptionsComponent extends Component {
  constructor(props) {
    super(props);
    this.state = { options: [],
                   finalPotentialZones: [],
                   finalPositions: [],
                   notFresh: [],
                   badIncomingLeg: [],
                   badLegBases: [],
                   foundAttractor: [],
                   unused: [],
                   finalData: [],
                   baseMarkers: [],
                   priceReturnedToMarket:[],
                   stopMarker: [],
                   positioonClosedMarker:[],
                   breakEvenMarker: [],
                   zoneLineMarkers: [],
                   zoneData: [],
                   notFreshZoneData: [],
                   explosiveBarMultiplier: 1,
                   finalInvalidZones: [],
                   finalResultsData: []
                 } }

 componentDidMount() {
   console.log('Inside ComponentDidMount Options Component')
 }

  createDateTime = (bar) => {
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

  isItALeg = (bar) => {
    let candlestick

    if (bar[5] - bar[2] > 0) {
      candlestick = bar[5] - bar[2]
    } else {
      candlestick = bar[2] - bar[5]
    }

    let range = bar[3] - bar[4]

    if ((candlestick / range) > 0.4) {
      return true
    } else {
      return false
    }
  }

  componentDidUpdate() {
    if ( this.state.baseMarkers.length < 1 ) {
console.log('Bubi: componentDidUpdate in OptionsComponent')
      this.setState( {
        finalPotentialZones: freshZones,

        finalInvalidZones: invalidZones,

        finalPositions: positionArray,

        baseMarkers: actualBases.map( base => {
          return {'x': base,
          'title': ' '}
        }),

        priceReturnedMarker: priceReturnedBars.map ( bar =>  {
          return {'x': bar,
          'title': 'T3'}
        }),

        stopMarker: stopBars.map ( bar =>  {
          return {'x': bar,
          'title': 'S '}
        }),

         breakEvenMarker: breakEvenBars.map ( bar =>  {
          return {'x': bar,
          'title': 'BE '}
        }),

         positionClosedMarker: positionClosedZone.map ( bar =>  {
          return {'x': bar,
          'title': 'X '}
        }),

         zoneLineMarkers: zoneLines.map (line => {
          return {
            color: 'blue',
            width: 1,
            value: line
          }
        }),

         notFresh: notFreshZones,

         badIncomingLeg: invalidIncomingLegZones,

         badLegBases: invalidLegBaseZones,

         foundAttractor: invalidAttractorZones ,

         unused: unusedZones,

         finalResultsData: resultsData,

         zoneData: zoneData,

         notFreshZoneData: notFreshZoneData,

         finalData: newArray.map( bar => {

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
          if (this.isItALeg(newArray[0])) {
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
          if (formation === 'rally' && barDistanceFromDemandZone >= ((zoneCeiling-zoneFloor) * explosiveBarMultiplier)) {
            potentialZone.push(newArray[1])
            distinctPotentialZone = [...new Set(potentialZone)]

            //Check if the new fresh zone has the same outgoing leg or incoming leg of another fresh zone
            positionArray.forEach(oldFreshZone => {
              if( (oldFreshZone['outgoingLeg'] === 2) || (oldFreshZone['incomingLeg'] === 0)) {
                console.log('CHECK WHICH OF THE TWO ZONES SHOULD TRIGGER THE POSITION - First Three Bars in a Rally 3')
              }
            })

            freshZones.push([ {'bases': distinctPotentialZone}, {'zoneCeiling': zoneCeiling}, {'zoneFloor': zoneFloor}, {'zoneHeight': zoneHeight}, {'formation': formation}, {'type': 'fresh'}, {'incomingLeg': 0}, {'outgoingLeg': 2} ])

            const newFreshZoneIndex = freshZones.length - 1

            positionArray.push({'freshZoneIndex': newFreshZoneIndex, 'entryPrice': freshZones[newFreshZoneIndex]['entryPrice'], 'targetPrice': freshZones[newFreshZoneIndex]['targetPrice'], 'stopPrice': freshZones[newFreshZoneIndex]['stopPrice'], 'barsAfterPositionOpens': 0, 'positionStatus': 'unfilled', 'priceReturnedId': idx, 'zoneFormation': freshZones[newFreshZoneIndex]['formation'], 'result': 'unfilled', 'outgoingLeg': 2, 'incomingLeg': 0 } )

            freshZones[newFreshZoneIndex]['position'] = true

            resultsData['unfilled'] = resultsData['unfilled'] + 1

            potentialZone = []
          }

          //Is the third bar explosive in a Drop and the first bar is a Leg?
          barDistanceFromSupplyZone = zoneFloor - newArray[2][4]
          if (formation === 'drop' && barDistanceFromSupplyZone >= ((zoneCeiling-zoneFloor) * explosiveBarMultiplier)) {
            potentialZone.push(newArray[1])

            //Check if the new fresh zone has the same outgoing leg or incoming leg of another fresh zone
            positionArray.forEach(oldFreshZone => {
              if( oldFreshZone['outgoingLeg'] === 2 || oldFreshZone['incomingLeg'] === 1) {
                console.log('CHECK WHICH OF THE TWO ZONES SHOULD TRIGGER THE POSITION - First Three Bars in a Drop 3')
              }
            })

            freshZones.push([ {'bases': distinctPotentialZone}, {'zoneCeiling': zoneCeiling}, {'zoneFloor': zoneFloor}, {'zoneHeight': zoneHeight}, {'formation': formation}, {'type': 'fresh'}, {'incomingLeg': 0}, {'outgoingLeg': 2} ])

            const newFreshZoneIndex = freshZones.length - 1

            positionArray.push({'freshZoneIndex': newFreshZoneIndex, 'entryPrice': freshZones[newFreshZoneIndex]['entryPrice'], 'targetPrice': freshZones[newFreshZoneIndex]['targetPrice'], 'stopPrice': freshZones[newFreshZoneIndex]['stopPrice'], 'barsAfterPositionOpens': 0, 'positionStatus': 'unfilled', 'priceReturnedId': idx, 'zoneFormation': freshZones[newFreshZoneIndex]['formation'], 'result': 'unfilled', 'outgoingLeg': 2, 'incomingLeg': 0 } )

            freshZones[newFreshZoneIndex]['position'] = true

            resultsData['unfilled'] = resultsData['unfilled'] + 1

            potentialZone = []
          }
          }
        } else {

          //After the third Bar, start looking back in time

          //Check Bar for Potential Fresh Zone

          //Check to see if the price returns to Zone in all the open potential Zones (is it fresh?)
          const newPotentialFreshArray = [...potentialFreshZones]

          newPotentialFreshArray.forEach ( zone =>  {
            console.log('zone: ', zone)

            //Check in Rally
            if (zone['type'] === 'checking for fresh' && zone['formation'] === 'rally'){
              zone['isItFreshBars'] = zone['isItFreshBars'] + 1

              //Check if Price Returned to Zone
              if (bar[3] >= zone['zoneFloor'] && bar[4] <= zone['zoneCeiling']) {

                zone['priceReturnedToZone'] = zone['priceReturnedToZone'] + 1

                console.log('The Price Returned on bar number: ', zone['isItFreshBars'])
                console.log('Zone: ', zone)
                console.log('zoneCeiling: ', zone['zoneCeiling'])
                console.log('Bar Lowest Price: ', bar[4])
                console.log('Zone Height: ', zone['zoneHeight'])

                if (zone['priceReturnedToZone'] > 1) {

                  zone['type'] = 'Not Fresh - Price Returned to Zone More than Once'

                  notFreshZones.push(zone)

                  //Set data to draw Not Fresh Zone in chart
                  notFreshZoneData.push(zone['bases'].map( bar => {return {'x': this.createDateTime(bar), 'high': zone['zoneCeiling'], 'low':  zone['zoneFloor']}}))

                  potentialFreshZones.splice(potentialFreshZones.indexOf(zone), 1)

                  console.log('ZONE IS NOT FRESH. The Price Returned to Zone More than Once - Rally ', invalidZones[invalidZones.length -1])
                } else if ( bar[4] <= zone['zoneCeiling'] && ((zone['zoneCeiling'] - bar[4])/zone['zoneHeight'] > 0.25)) {

                  zone['type'] = 'Not Fresh - The Price Went in More than 25% -- Rally'

                  notFreshZones.push(zone)

                  //Set data to draw Not Fresh Zone in chart
                  notFreshZoneData.push(zone['bases'].map( bar => {return {'x': this.createDateTime(bar), 'high': zone['zoneCeiling'], 'low':  zone['zoneFloor']}}))

                  potentialFreshZones.splice(potentialFreshZones.indexOf(zone), 1)

                  console.log('ZONE IS NOT FRESH. The Price Went in More than 25% -- Rally ', invalidZones[invalidZones.length -1])
                }
              }

              //If it's untouched for 5 bars, it's Fresh
                else if (zone && zone['isItFreshBars'] === 5) {
                  zone['type'] = 'fresh'
                  zone['targetPrice'] = zone['zoneCeiling'] + (zone['zoneHeight'] * 3)
                  zone['entryPrice'] = zone['zoneCeiling'] + (averageTrueRange * 0.01)
                  zone['stopPrice'] = zone['zoneFloor'] - (averageTrueRange * 0.02)


                  //Check if the new fresh zone has the same outgoing leg or incoming leg of another fresh zone
                  positionArray.forEach(oldFreshZone => {
                    if( (oldFreshZone['outgoingLeg'] === zone['outgoingLeg']) || (oldFreshZone['incomingLeg'] === zone['incomingLeg'])) {
                      console.log('CHECK WHICH OF THE TWO ZONES SHOULD TRIGGER THE POSITION')
                      console.log('oldFreshZone: ', oldFreshZone)
                      console.log('new zone: ', zone)
                    }
                  })

                  freshZones.push(zone)

                  positionArray.push({'freshZoneIndex': (freshZones.length - 1), 'entryPrice': zone['entryPrice'], 'targetPrice': zone['targetPrice'], 'stopPrice': zone['stopPrice'], 'barsAfterPositionOpens': 0, 'positionStatus': 'unfilled', 'priceReturnedId': idx, 'zoneFormation': zone['formation'], 'result': 'unfilled', 'outgoingLeg': zone['outgoingLeg'], 'incomingLeg': zone['incomingLeg'] } )

                  zone['position'] = true

                  resultsData['unfilled'] = resultsData['unfilled'] + 1

                  //Set data to draw Zone in chart

                  zoneData.push(zone['bases'].map( bar => {return {'x': this.createDateTime(bar), 'high': zone['zoneCeiling'], 'low':  zone['zoneFloor']}}))

                  //Set data to draw lines signaling fresh zone
                  // zoneLines.push(zoneCeiling)
                  // zoneLines.push(zoneFloor)

                  zoneCeiling = undefined
                  zoneFloor = undefined

                console.log('FRESH ZONE! In a Rally', zone)
                }
              }

              //Check if Price Returns to Zone or if Zone is Fresh - Drop
              if (zone && zone['type'] === 'checking for fresh' && zone['formation'] === 'drop'){
              zone['isItFreshBars'] = zone['isItFreshBars'] + 1

              //Check if Price Returned to Zone
              if (bar[3] >= zone['zoneFloor'] && bar[4] <= zone['zoneCeiling']) {
                zone['priceReturnedToZone'] = zone['priceReturnedToZone'] + 1

                console.log('The Price Returned on bar number: ', zone['isItFreshBars'])
                console.log('zoneCeiling: ', zone['zoneCeiling'])
                console.log('Bar Highest Price: ', bar[3])
                console.log('Zone Height: ', zone['zoneHeight'])

                if (zone['priceReturnedToZone'] > 1) {

                  zone['type'] = 'Not Fresh - Price Returned to Zone More than Once'

                  notFreshZones.push(zone)

                  //Set data to draw Not Fresh Zone in chart
                  notFreshZoneData.push(zone['bases'].map( bar => {return {'x': this.createDateTime(bar), 'high': zone['zoneCeiling'], 'low':  zone['zoneFloor']}}))

                  potentialFreshZones.splice(potentialFreshZones.indexOf(zone), 1)

                  console.log('ZONE IS NOT FRESH. The Price Returned to Zone More than Once - Drop ', invalidZones[invalidZones.length -1])
                } else if (bar[3] >= zone['zoneFloor'] && ((bar[3] - zone['zoneFloor'])/zone['zoneHeight'] > 0.25)) {

                  zone['type'] = 'Not Fresh - The Price Went in More than 25% -- Drop'

                  notFreshZones.push(zone)

                  //Set data to draw Not Fresh Zone in chart
                  notFreshZoneData.push(zone['bases'].map( bar => {return {'x': this.createDateTime(bar), 'high': zone['zoneCeiling'], 'low':  zone['zoneFloor']}}))

                  potentialFreshZones.splice(potentialFreshZones.indexOf(zone), 1)

                  console.log('ZONE IS NOT FRESH. The Price Went in More than 25% -- Drop ', invalidZones[invalidZones.length -1])
                }
              }

              //If it's untouched for 5 bars, it's Fresh
                else if (zone['isItFreshBars'] === 5) {
                  zone['type'] = 'fresh'

                  zone['targetPrice'] = zone['zoneFloor'] - (zone['zoneHeight'] * 3)
                  zone['entryPrice'] = zone['zoneFloor'] - (averageTrueRange * 0.01)
                  zone['stopPrice'] = zone['zoneCeiling'] + (averageTrueRange * 0.02)

                  //Check if the new fresh zone has the same outgoing leg or incoming leg of another fresh zone
                  positionArray.forEach(oldFreshZone => {
                    if( (oldFreshZone['outgoingLeg'] === zone['outgoingLeg']) || (oldFreshZone['incomingLeg'] === zone['incomingLeg'])) {
                      console.log('CHECK WHICH OF THE TWO ZONES SHOULD TRIGGER THE POSITION - Drop')
                      console.log('oldFreshZone: ', oldFreshZone)
                      console.log('new zone: ', zone)
                    }
                  })

                  freshZones.push(zone)

                  positionArray.push({'freshZoneIndex': (freshZones.length - 1), 'entryPrice': zone['entryPrice'], 'targetPrice': zone['targetPrice'], 'stopPrice': zone['stopPrice'], 'barsAfterPositionOpens': 0, 'positionStatus': 'unfilled', 'priceReturnedId': idx, 'zoneFormation': zone['formation'], 'result': 'unfilled', 'outgoingLeg': zone['outgoingLeg'], 'incomingLeg': zone['incomingLeg'] } )

                  zone['position'] = true

                  resultsData['unfilled'] = resultsData['unfilled'] + 1

                  //Set data to draw Zone in chart
                  zoneData.push(zone['bases'].map( bar => {return {'x': this.createDateTime(bar), 'high': zone['zoneCeiling'], 'low':  zone['zoneFloor']}}))

                  //Set data to draw lines signaling fresh zone
                  // zoneLines.push(zoneCeiling)
                  // zoneLines.push(zoneFloor)

                  zoneCeiling = undefined
                  zoneFloor = undefined

                console.log('FRESH ZONE! In a Drop', zone)
                }
              }
            })

        console.log('About to Check position! positionArray: ', positionArray)
        console.log('Were checking bar: ', bar)
        console.log('The ID is: ', idx)

          //Check Open Positions
          if(positionArray.length > 0) {
            for (let z = 0; z < positionArray.length; z++) {

              //Check if an Open Position Should Be Closed Because it Hit the Stop - Rally
              if (positionArray[z]['zoneFormation'] === 'rally' && positionArray[z]['positionStatus'] === 'open' && bar[4] <= positionArray[z]['stopPrice']) {

                positionArray[z]['positionStatus'] = 'closed'

                if (positionArray[z]['result'] === 'break even') {
                  positionArray[z]['type'] = 'break even'
                  resultsData['break even'] = resultsData['break even'] + 1
                  resultsData['open'] = resultsData['open'] - 1

                  breakEvenBars.push(dateTime)

                  freshZones[positionArray[z]['freshZoneIndex']]['type'] = 'break even'

                  console.log('PRICE HIT THE BREAK EVEN ON RALLY!')
                } else {
                  positionArray[z]['type'] = 'stop'
                  positionArray[z]['result'] = 'stop'
                  resultsData['stop'] = resultsData['stop'] + 1
                  resultsData['open'] = resultsData['open'] - 1
                  stopBars.push(dateTime)
                  freshZones[positionArray[z]['freshZoneIndex']]['type'] = 'stop'
                  console.log('PRICE HIT THE STOP ON RALLY!')
                }
              }

              //Check if an Open Position Should Be Closed Successfully - Rally
              else if (positionArray[z]['zoneFormation'] === 'rally' && positionArray[z]['positionStatus'] === 'open' && bar[3] >= positionArray[z]['targetPrice']) {
                positionArray[z]['positionStatus'] = 'closed'
                positionArray[z]['type'] = 't3'
                resultsData['t3'] = resultsData['t3'] + 1
                priceReturnedBars.push(dateTime)
                freshZones[positionArray[z]['freshZoneIndex']]['type'] = 't3'
                console.log('SUCCESS!!! The price reached the Target Price (T3) - Rally')
                console.log('ID: ', idx)
                console.log('Bar: ', bar)
              }

              //Check if an Open Position Should Be Closed Because it Hit the Stop - Drop
              if (positionArray[z]['zoneFormation'] === 'drop' && positionArray[z]['positionStatus'] === 'open' && bar[3] >= positionArray[z]['stopPrice']) {

                positionArray[z]['positionStatus'] = 'closed'

                if (positionArray[z]['result'] === 'break even') {
                  positionArray[z]['type'] = 'break even'
                  resultsData['break even'] = resultsData['break even'] + 1
                  resultsData['open'] = resultsData['open'] - 1

                  breakEvenBars.push(dateTime)

                  freshZones[positionArray[z]['freshZoneIndex']]['type'] = 'break even'

                  console.log('PRICE HIT THE BREAK EVEN ON DROP!')
                } else {
                  positionArray[z]['type'] = 'stop'
                  positionArray[z]['result'] = 'stop'
                  resultsData['stop'] = resultsData['stop'] + 1
                  resultsData['open'] = resultsData['open'] - 1

                  stopBars.push(dateTime)

                  freshZones[positionArray[z]['freshZoneIndex']]['type'] = 'stop'

                  console.log('PRICE HIT THE STOP ON DROP!')
                }
              }

              //Check if an Open Position Should Be Closed Successfully - Drop
              else if (positionArray[z]['zoneFormation'] === 'drop' && positionArray[z]['positionStatus'] === 'open' && bar[4] <= positionArray[z]['targetPrice']) {
                positionArray[z]['positionStatus'] = 'closed'
                positionArray[z]['type'] = 't3'

                priceReturnedBars.push(dateTime)
                resultsData['t3'] = resultsData['t3'] + 1

                freshZones[positionArray[z]['freshZoneIndex']]['type'] = 't3'

                console.log('SUCCESS!!! The price reached the Target Price (T3) - Drop')
                console.log('ID: ', idx)
                console.log('Bar: ', bar)
              }

              //Check if a position should be Opened or Closed - depending on whether the price is inside the Zone on the third bar after triggering position
              if (positionArray[z]['barsAfterPositionOpens'] < 2) {
                positionArray[z]['barsAfterPositionOpens'] = positionArray[z]['barsAfterPositionOpens'] + 1
              } else if ((positionArray[z]['barsAfterPositionOpens'] === 1) && (positionArray[z]['positionStatus'] === 'open')) {

                //Rally - Drop
                  if( (positionArray['zoneFormation'] === 'rally' && bar[2] <= positionArray[z]['entryPrice']) || (positionArray['zoneFormation'] === 'drop' && bar[2] >= positionArray[z]['entryPrice']) ) {
                  positionArray[z]['positionStatus'] = 'filled'
                  //Move the Stop Price to the Entry Price
                  positionArray[z]['result'] = 'break even'
                  positionArray[z]['stopPrice'] = positionArray[z]['entryPrice']

                  freshZones[positionArray[z]['freshZoneIndex']]['type'] = 'break even'

                  console.log('POSITION IS FILLED and OPEN: The price was outside the Zone in the third bar.')
                  console.log('The Fresh Zone: ', freshZones[positionArray[z]['freshZoneIndex']])
                  console.log('The Bar Where the Price Returned: ', positionArray[z]['priceReturnedId'])
                  console.log('The Third Bar: ', bar)

                } else {
                  positionArray[z]['positionStatus'] = 'closed'
                  positionArray[z]['type'] = 'price in zone after 3 bars'
                  positionClosedZone.push(dateTime)
                  freshZones[positionArray[z]['freshZoneIndex']]['type'] = 'closed'
                  console.log('POSITION IS CLOSED: The price was inside the Zone in the third bar.')
                }
                  console.log('Third Bar After Price ReEnters Zone: ', bar[4])
                  console.log('zoneCeiling: ', freshZones[positionArray[z]['freshZoneIndex']]['zoneCeiling'])
                }
              }
          } else {
            console.log('There were NO POSITIONS')
          }

          console.log('Checking if the Price Returns to a FRESH OPEN Zone')
          //Check if the Price returns to a Fresh, Open Zone
          if (freshZones.length > 0) {
            for (let x = 0; x < freshZones.length; x++) {

              //Check if Price returns in a Rally
              if(freshZones[x]['formation'] === 'rally' && bar[4] <= freshZones[x]['entryPrice'] && freshZones[x]['position']=== true) {

              filledPosition = positionArray.find(zone => zone['freshZoneIndex'] === x)

              filledPosition['positionStatus'] = 'open'
              filledPosition['result'] = 'open'

              freshZones[x]['position'] = false

              resultsData['unfilled'] = resultsData['unfilled'] - 1
              resultsData['open'] = resultsData['open'] + 1

                console.log('RALLY-- The price returned to Zone #', x)
                console.log('Bar: ', bar)
                console.log('Index: ', idx)
                console.log('zone: ', freshZones[x])
              }
              //Check if Price returns in a Drop
              if(freshZones[x]['formation'] === 'drop' && bar[3] >= freshZones[x]['entryPrice'] && freshZones[x]['position'] === true) {

                filledPosition = positionArray.find(zone => zone['freshZoneIndex'] === x)

                filledPosition['positionStatus'] = 'open'
                filledPosition['result'] = 'open'

                freshZones[x]['position'] = false

                resultsData['unfilled'] = resultsData['unfilled'] - 1
                resultsData['open'] = resultsData['open'] + 1

                console.log('DROP-- The price returned to Zone #', x)
                console.log('Bar: ', bar)
                console.log('Index: ', idx)
                console.log('zone: ', freshZones[x])
              }
            }
          } else {
            console.log('No Fresh Open Zones Exist Yet')
          }

          console.log('Checking if this bar is a LEG')

          //Is it a leg?
          if (idx >= 3 && this.isItALeg(bar)) {
            potentialZone = []
            let firstPotentialLeg
            let i = idx - 2
            let zoneInvalidatedByLegBases = false

            console.log('Potential OUTGOING Leg: ', idx)

            //Is there an Incoming Leg?
            if (idx > 7) {firstPotentialLeg = idx - 7} else {firstPotentialLeg = 0}

            while ( i >= firstPotentialLeg) {
              console.log('Looking for INCOMING LEGS!')
              console.log('Checking bar with index: ', i)
              if (this.isItALeg(newArray[i])) {
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
                let bottomOfCandlestick = potentialZone.map( bar => {
                                return bar[5] > bar[2] ?  bar[2] : bar[5]
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
                  if (i - 2 > 0 && newArray[i-2][4] <= zoneFloor && ( zoneFloor - newArray[i-2][4]) <= zoneHeight ) {
                    zoneFloor = newArray[i-2][4]
                    console.log('Second Previous Bar is an Attractor Bar!')
                  } else if (i - 1 > 0 && newArray[i-1][4] <= zoneFloor && ( zoneFloor - newArray[i-1][4]) <= zoneHeight ) {
                    zoneFloor = newArray[i-1][4]
                    console.log('First Previous Bar is an Attractor Bar!')
                  }
                }
                //Set ceiling and floor of Zone for Drop
                else if (formation === 'drop') {
                  zoneCeiling = Math.max(...highest)
                  zoneFloor = Math.min(...bottomOfCandlestick)
                  zoneHeight = zoneCeiling - zoneFloor

                  //Check for Attractor Bars
                  if (i - 2 > 0 && newArray[i-2][3] >= zoneCeiling && ( newArray[i-2][3] - zoneCeiling ) <= zoneHeight ) {
                    zoneCeiling = newArray[i-2][3]
                    console.log('Second Previous Bar is an Attractor Bar!')
                  } else if (i - 1 > 0 && newArray[i-1][3] >= zoneCeiling && ( newArray[i-1][3] - zoneCeiling ) <= zoneHeight ) {
                    zoneCeiling = newArray[i-1][3]
                    console.log('First Previous Bar is an Attractor Bar!')
                  }
                }

                //Is the Incoming Leg valid?
                //Set candlestick depending on Rally or Drop
                if (newArray[i][5] - newArray[i][2] >= 0) {
                  console.log(' Incoming Leg is a Rally')
                  console.log('Candlestick: ', incomingCandlestick)
                  incomingCandlestick = newArray[i][5] - newArray[i][2]
                  incomingFormation = 'rally'

                  console.log('Candlestick Totally Outside Zone: ', incomingCandlestick)

                  //Set size outside Zone when leg is outside Zone
                  candlestickSizeOutsideZone = 0

                  if (newArray[i][2] < zoneFloor) {
                    candlestickSizeOutsideZone = candlestickSizeOutsideZone + (zoneFloor-newArray[i][2])
                  }

                  if (newArray[i][5] > zoneCeiling) {
                    candlestickSizeOutsideZone = candlestickSizeOutsideZone + (newArray[i][5] - zoneCeiling)
                  }
                  console.log('Candlestick OUTSIDE Zone when part is INSIDE ZONE: ', candlestickSizeOutsideZone)
                } else {
                  console.log(' Incoming Leg is a Drop')
                  incomingCandlestick = newArray[i][2] - newArray[i][5]
                  incomingFormation = 'drop'

                  //Set size outside Zone when leg is partly in Zone
                  if (newArray[i][2] > zoneCeiling) {
                    candlestickSizeOutsideZone = candlestickSizeOutsideZone + (newArray[i][2] - zoneCeiling)
                  }

                  if (newArray[i][5] < zoneFloor) {
                    candlestickSizeOutsideZone = candlestickSizeOutsideZone + (zoneFloor - newArray[i][5])
                  }
                }

                //Is the Incoming Leg at least 25% bigger than zoneHeight and doesn't invade the Zone - Rally
                console.log('Incoming Leg Percentage at 582 is: ', globalIncomingLegPercentage)
                if (incomingFormation === 'rally' && ((newArray[i][2] > zoneCeiling || newArray[i][5] < zoneFloor)) && ((incomingCandlestick / zoneHeight) < globalIncomingLegPercentage )) {
                  invalidIncomingLeg = true

                    invalidIncomingLegZones.push( {'incomingLeg': newArray[i], 'outgoingLeg': newArray[idx], 'bases': potentialZone, 'zoneCeiling': zoneCeiling, 'zoneFloor': zoneFloor, 'zoneHeight': zoneHeight, 'formation': formation, 'type': 'Invalid Because of Incoming Leg is Less than 25% of Potential Zone (Outside Zone)'} )

                  console.log('Line 248: invalid Incoming Leg, outside Zone')
                } else if (incomingFormation === 'rally'
                &&
                //Incoming Leg is Inside Zone
                ((newArray[i][2] <= zoneCeiling && newArray[i][2] >= zoneFloor))
                &&
                //Candlestick outside zone is less than 25% of Zone
                ( (candlestickSizeOutsideZone / zoneHeight) < globalIncomingLegPercentage )) {

                  invalidIncomingLeg = true

                  invalidIncomingLegZones.push({'incomingLeg': newArray[i], 'outgoingLeg': newArray[idx], 'bases': potentialZone, 'zoneCeiling': zoneCeiling, 'zoneFloor': zoneFloor, 'zoneHeight': zoneHeight, 'formation': formation, 'type': 'Invalid Because of Incoming Leg is Less than 25% of Potential Zone (Inside Zone)'})

                  console.log('Line 257: invalid Incoming Leg, inside Zone')
                }

                //Is the Incoming Leg at least 25% bigger than zoneHeight and doesn't invade the Zone - Drop
                if (incomingFormation === 'drop' && ((newArray[i][5] > zoneCeiling || newArray[i][2] < zoneFloor)) && ((incomingCandlestick / zoneHeight) < globalIncomingLegPercentage )) {
                  invalidIncomingLeg = true

                  invalidIncomingLegZones.push({'incomingLeg': newArray[i], 'outgoingLeg': newArray[idx], 'bases': potentialZone, 'zoneCeiling': zoneCeiling, 'zoneFloor': zoneFloor, 'zoneHeight': zoneHeight, 'formation': formation, 'type': 'Invalid Because of Incoming Leg is Less than 25% of Potential Zone (Outside Zone)'})

                } else if (incomingFormation === 'drop'
                &&
                //Incoming Leg is Inside Zone
                ((newArray[i][5] <= zoneCeiling && newArray[i][2] >= zoneFloor))
                &&
                //Candlestick outside zone is less than 25% of Zone
                ( (candlestickSizeOutsideZone / zoneHeight) < globalIncomingLegPercentage )) {
                  invalidIncomingLeg = true

                  invalidIncomingLegZones.push({'incomingLeg': newArray[i], 'outgoingLeg': newArray[idx], 'bases': potentialZone, 'zoneCeiling': zoneCeiling, 'zoneFloor': zoneFloor, 'zoneHeight': zoneHeight, 'formation': formation, 'type': 'Invalid Because of Incoming Leg is Less than 25% of Potential Zone (Inside Zone)'})

                  console.log('Line 276: invalid Incoming Leg, inside Zone')
                }

                //Create potential Explosive Group array
                explosiveGroup =[]
                for (let z = 0; z < explosiveGroupBars; z++) {
                  explosiveGroup.push(newArray[idx + z])
                }

                //Check for Very Explosive Group and adjust Incoming Leg Validity

                //Check for a Rally
                highestPriceArray = explosiveGroup.map(bar => bar ? bar[3] : null)
                highestPriceInExplosiveGroup = Math.max(...highestPriceArray)
                groupDistanceFromDemandZone =  highestPriceInExplosiveGroup - zoneCeiling

                 if (formation === 'rally' && groupDistanceFromDemandZone >= (zoneHeight * veryExplosiveGroupMultiplier)) {
                   console.log('VERY EXPLOSIVE GROUP IN A RALLY!')
                   invalidIncomingLeg = false
                 }

                 //Check for a Drop
                 lowestPriceArray = explosiveGroup.map(bar => bar ? bar[4] : null)
                 lowestPriceInExplosiveGroup = Math.min(...lowestPriceArray)
                 groupDistanceFromSupplyZone =  zoneFloor - lowestPriceInExplosiveGroup

                 if (formation === 'drop' && groupDistanceFromSupplyZone >= (zoneHeight * veryExplosiveGroupMultiplier)) {
                   console.log('VERY EXPLOSIVE GROUP IN A DROP!')
                   invalidIncomingLeg = false
                 }


                if (invalidIncomingLeg === false) {
                  console.log('Incoming Leg is Valid, line 311')

                // Check Leg-Bases
                let zoneInvalidatedByLegBases = false
                let numberOfLegs = 0
                let potentialZoneWithoutLegBases = [...potentialZone]
                let legBaseCeiling = 0
                let legBaseFloor = 0
                let legBaseZoneHeight = 0

                for (let index = 0; index < potentialZone.length; index++) {
                  if (this.isItALeg(potentialZone[index])) {

                    //Count it as a Leg-Base
                    numberOfLegs = numberOfLegs + 1

                    // Check if candlestick of the Leg-Base is higher than the ceiling of the Potential Demand Zone
                    if (formation === 'rally' && potentialZone[index][5] > zoneCeiling) {
                      zoneInvalidatedByLegBases = true

                      invalidLegBaseZones.push({'incomingLeg': newArray[i], 'outgoingLeg': newArray[idx], 'bases': potentialZone, 'zoneCeiling': zoneCeiling, 'zoneFloor': zoneFloor, 'zoneHeight': zoneHeight, 'formation': formation, 'type': 'Invalid Because Leg-Base Candlestick Outside Zone Ceiling - Demand'})

                      console.log('Invalidated by Leg Bases 1')
                      break
                    }

                    // Check if candlestick of the Leg-Base is higher than the ceiling of the Potential Supply Zone
                    else if (formation === 'drop' && potentialZone[index][2] > zoneCeiling) {
                      zoneInvalidatedByLegBases = true

                    invalidLegBaseZones.push({'incomingLeg': newArray[i], 'outgoingLeg': newArray[idx], 'bases': potentialZone, 'zoneCeiling': zoneCeiling, 'zoneFloor': zoneFloor, 'zoneHeight': zoneHeight, 'formation': formation, 'type': 'Invalid Because Leg-Base Candlestick Outside Zone Ceiling - Supply'})

                    console.log('Invalidated by Leg Bases 2')
                    break
                    }

                    // Check if candlestick of the Leg-Base is lower than the floor of the Potential Demand Zone
                    else if (formation === 'rally' && potentialZone[index][2] < zoneFloor) {
                      zoneInvalidatedByLegBases = true

                      invalidLegBaseZones.push({'incomingLeg': newArray[i], 'outgoingLeg': newArray[idx], 'bases': potentialZone, 'zoneCeiling': zoneCeiling, 'zoneFloor': zoneFloor, 'zoneHeight': zoneHeight, 'formation': formation, 'type': 'Invalid Because Leg-Base Candlestick Outside Zone Floor - Demand'})

                      console.log('Invalidated by Leg Bases 3')
                      break
                    }

                    // Check if candlestick of the Leg-Base is lower than the floor of the Potential Supply Zone
                    else if (formation === 'drop' && potentialZone[index][5] < zoneFloor) {
                      zoneInvalidatedByLegBases = true

                      invalidLegBaseZones.push({'incomingLeg': newArray[i], 'outgoingLeg': newArray[idx], 'bases': potentialZone, 'zoneCeiling': zoneCeiling, 'zoneFloor': zoneFloor, 'zoneHeight': zoneHeight, 'formation': formation, 'type': 'Invalid Because Leg-Base Candlestick Outside Zone Floor - Supply'})

                      console.log('Invalidated by Leg Bases 4')
                      break
                    }

                    //Create potentialZone without legBase and see if legBase is less than the size of that Zone plus 25% - if legBase is a Rally
                    potentialZoneWithoutLegBases.splice(index, 1)

                    //Set ceiling, floor and height of the zone without the legBase
                    potentialZoneWithoutLegBases.forEach(bar => {
                      if(bar[4] > legBaseFloor) {
                        legBaseFloor = bar[4]
                      }

                      if(bar[5] > legBaseCeiling) {
                        legBaseCeiling = bar[5]
                      }
                    })

                    legBaseZoneHeight = legBaseCeiling - legBaseFloor

                    if (potentialZone[index][5] - potentialZone[index][2] > legBaseZoneHeight + (legBaseZoneHeight * 0.25) ) {
                      zoneInvalidatedByLegBases = true

                      invalidLegBaseZones.push({'incomingLeg': newArray[i], 'outgoingLeg': newArray[idx], 'bases': potentialZone, 'zoneCeiling': zoneCeiling, 'zoneFloor': zoneFloor, 'zoneHeight': zoneHeight, 'formation': formation, 'type': 'Invalid Because Leg-Base Is Longer Than ZoneHeight X 25% of Zone With Bases - Demand'})

                      console.log('Invalidated by Leg Bases - Longer than Base + 25% - Rally')
                      break
                    }

                    //Create potentialZone without legBase and see if legBase is less than the size of that Zone plus 25% - if legBase is a Drop
                    potentialZoneWithoutLegBases.splice(index, 1)

                    //Set ceiling, floor and height of the zone without the legBase
                    potentialZoneWithoutLegBases.forEach(bar => {
                      if(bar[5] > legBaseFloor) {
                        legBaseFloor = bar[5]
                      }

                      if(bar[3] > legBaseCeiling) {
                        legBaseCeiling = bar[3]
                      }
                    })

                    legBaseZoneHeight = legBaseCeiling - legBaseFloor

                    if (potentialZone[index][2] - potentialZone[index][5] > legBaseZoneHeight + (legBaseZoneHeight * 0.25) ) {
                      zoneInvalidatedByLegBases = true

                      invalidLegBaseZones.push({'incomingLeg': newArray[i], 'outgoingLeg': newArray[idx], 'bases': potentialZone, 'zoneCeiling': zoneCeiling, 'zoneFloor': zoneFloor, 'zoneHeight': zoneHeight, 'formation': formation, 'type': 'Invalid Because Leg-Base Is Longer Than ZoneHeight X 25% of Zone With Bases - Rally'})

                      console.log('Invalidated by Leg Bases - Longer than Base + 25% - Drop')
                      break
                    }
                  }
                }

                //Are there are more Leg-Bases than Bases?
                if( (numberOfLegs/potentialZone.length) >= 0.5) {

                  zoneInvalidatedByLegBases = true

                  invalidLegBaseZones.push({'incomingLeg': newArray[i], 'outgoingLeg': newArray[idx], 'bases': potentialZone, 'zoneCeiling': zoneCeiling, 'zoneFloor': zoneFloor, 'zoneHeight': zoneHeight, 'formation': formation, 'type': 'Invalid Because There are More Leg-Bases than Bases'})

                  console.log('Invalidated by Leg Bases 5')
                }

                if (zoneInvalidatedByLegBases === false) {
                  console.log('Zone Is Valid - Passed Leg Bases')

                //Set the percentage the leg is inside the Zone depending on where it penetrates

                if (bar[4] < zoneCeiling && bar[3] > zoneFloor) {
                  //Bar is Inside Zone
                  if(bar[3] > zoneCeiling) {
                    percentageInsideZone = (zoneCeiling - bar[4]) / zoneHeight
                  } else if (bar[3] <= zoneCeiling){
                  percentageInsideZone = (bar[3] - zoneFloor) / zoneHeight
                  }
                } else {
                  percentageInsideZone = 0
                }


                //Check if bar is explosive in a Rally and less than 40% inside the Zone or if the 4 bars form an explosive group
                highestPriceArray = explosiveGroup.map(bar => bar ? bar[3] : null)
                highestPriceInExplosiveGroup = Math.max(...highestPriceArray)
                barDistanceFromDemandZone = bar[3] - zoneCeiling
                groupDistanceFromDemandZone =  highestPriceInExplosiveGroup - zoneCeiling
                zoneHeight = zoneCeiling - zoneFloor

                //Is this Rally EXPLOSIVE?
                if (formation === 'rally' && (
                //Outgoing Leg is Outside Zone
                ( (bar[4] > zoneCeiling || bar[3] < zoneFloor) &&
                //Distance between Highest Price of the Explosive Bar or Group is equal to or more than 1X or 2X the zoneHeight
                (
                  barDistanceFromDemandZone >= zoneHeight * explosiveBarMultiplier || groupDistanceFromDemandZone >= (zoneHeight * explosiveGroupMultiplier)
                )
                )
               ||
                //Outgoing Leg is Inside Zone
                (
                (bar[4] <= zoneCeiling && bar[3] >= zoneFloor) &&

                //The part of the Outgoing Leg Inside Zone is equal to or less than 40% of the zoneHeight
                (percentageInsideZone <= outgoingLegPercentage &&

                //The distance between Highest Price of the Explosive Bar or Group is equal to or more than 1X or 2X the zoneHeight
                (barDistanceFromDemandZone >= zoneHeight * explosiveBarMultiplier || groupDistanceFromDemandZone >= (zoneHeight * explosiveGroupMultiplier))
                ) ) ) )
                {
                  //Check for Attractor Zones
                    //Create Array with the zoneCeiling of all the Previous Rally Zones that are Fresh

                    let newArrayOfZones = freshZones.filter(zone => zone['formation'] === 'rally')
                    //Check if the previous zoneCeilings are under the current zoneFloor and close enough to Zone
                    for(let x = 0; x < newArrayOfZones.length; x++) {
                      if (newArrayOfZones[x]['zoneCeiling'] < zoneFloor && newArrayOfZones[x]['type'] === 'fresh' && ( (zoneFloor - newArrayOfZones[x]['zoneCeiling']) <= (zoneHeight * 2) ) ) {
                        demandAttractorZoneFound = true

                        invalidAttractorZones.push( {'incomingLeg': newArray[i], 'outgoingLeg': newArray[idx], 'bases': potentialZone, 'zoneCeiling': zoneCeiling, 'zoneFloor': zoneFloor, 'zoneHeight': zoneHeight, 'formation': formation, 'type': 'Invalid - Attractor Zone Found - Demand', 'specificAttractorZone': newArrayOfZones[x]} )

                        console.log('Attractor Zone! Line 687')
                        break
                      } else {
                        demandAttractorZoneFound = false
                      }
                    }

                  if (demandAttractorZoneFound === false) {
                    console.log('Percentage of Outgoing Leg inside the Zone: ', percentageInsideZone)
                    console.log('POTENTIAL FRESH ZONE RALLY! Inserting Zone into potentialFreshZones.')

                  //Insert New Potential Zone into Array to Check if It's Fresh
                    potentialFreshZones.push( {'position': false, 'bases': potentialZone, 'zoneCeiling': zoneCeiling, 'zoneFloor': zoneFloor, 'zoneHeight': zoneHeight, 'formation': formation, 'type': 'checking for fresh', 'incomingLeg': i, 'outgoingLeg': idx, 'isItFreshBars': 1, 'priceReturnedToZone': 0} )
                  }
                } else {
                  if (formation !== 'drop') {
                    if (percentageInsideZone > outgoingLegPercentage) {
                      console.log('percentageInsideZone: ', percentageInsideZone)
                      console.log('Outgoing Leg is more than 40% inside zone.')
                    }
                    console.log('This Rally is NOT explosive.')
                  }
                }

                //Check to see if bar is explosive in a Drop and less than 40% inside the Zone or if the 4 bars form an explosive group
                lowestPriceArray = explosiveGroup.map(bar => bar ? bar[4] : null)
                lowestPriceInExplosiveGroup = Math.min(...lowestPriceArray)
                barDistanceFromSupplyZone = zoneFloor - bar[4]
                groupDistanceFromSupplyZone =  zoneFloor - lowestPriceInExplosiveGroup
                zoneHeight = zoneCeiling - zoneFloor

                //Is this Drop Explosive?
                if (formation === 'drop') {
                  console.log('READY TO CHECK IF DROP IS EXPLOSIVE')
                  console.log('lowestPriceInExplosiveGroup: ', lowestPriceInExplosiveGroup)
                  console.log('barDistanceFromSupplyZone: ', barDistanceFromSupplyZone)
                  console.log('groupDistanceFromSupplyZone: ', groupDistanceFromSupplyZone)
                  console.log('zoneHeight: ', zoneHeight)
                  console.log('bar[4]: ', bar[4])
                  console.log('bar[3]: ', bar[3])
                  console.log('zoneCeiling: ', zoneCeiling)
                  console.log('zoneFloor: ', zoneFloor)
                  console.log('percentageInsideZone: ', percentageInsideZone)
                }
                if (formation === 'drop' && (
                //Outgoing Leg is Outside Zone
                ( (bar[4] > zoneCeiling || bar[3] < zoneFloor) &&
                //Distance between Lowest Price of the Explosive Bar or Group is equal to or more than 1X or 2X the zoneHeight
                (
                  barDistanceFromSupplyZone >= zoneHeight * explosiveBarMultiplier || groupDistanceFromSupplyZone >= (zoneHeight * explosiveGroupMultiplier)
                )
                )
               ||
                //Outgoing Leg is Inside Zone
                (
                (bar[4] <= zoneCeiling && bar[3] >= zoneFloor) &&

                //The part of the Outgoing Leg Inside Zone is equal to or less than 40% of the zoneHeight
                (percentageInsideZone <= outgoingLegPercentage &&

                //The distance between Lowest Price of the Explosive Bar or Group is equal to or more than 1X or 2X the zoneHeight
                (barDistanceFromSupplyZone >= zoneHeight * explosiveBarMultiplier || groupDistanceFromSupplyZone >= (zoneHeight * explosiveGroupMultiplier))

                ) ) ) )
                {
                  console.log('THIS DROP IS EXPLOSIVE.')
                  //Check for Attractor Zones
                    //Create Array with the zoneFloor of all the Previous Supply Zones that are Fresh

                    let newArrayOfSupplyZones = freshZones.filter(zone => zone['formation'] === 'drop')
                    //Check if the previous zoneFloors are over the current zoneCeiling and close enough to Zone
                    for(let x = 0; x < newArrayOfSupplyZones.length; x++) {
                      if (newArrayOfSupplyZones[x]['zoneFloor'] > zoneCeiling && newArrayOfSupplyZones[x]['type'] === 'fresh' && ( (newArrayOfSupplyZones[x]['zoneFloor'] - zoneCeiling) <= (zoneHeight * 2) ) ) {
                        supplyAttractorZoneFound = true

                        invalidAttractorZones.push( {'incomingLeg': newArray[i], 'outgoingLeg': newArray[idx], 'bases': potentialZone, 'zoneCeiling': zoneCeiling, 'zoneFloor': zoneFloor, 'zoneHeight': zoneHeight, 'formation': formation, 'type': 'Invalid - Attractor Zone Found - Supply', 'specificAttractorZone': newArrayOfSupplyZones[x]} )

                        console.log('Attractor Zone! Line 726')
                        break
                      }  else {
                        supplyAttractorZoneFound = false
                      }
                    }

                  if (supplyAttractorZoneFound === false) {
                    console.log('POTENTIAL FRESH ZONE DROP! Inserting into potentialFreshZones array.')

                  //Insert New Potential Zone into Array to Check if It's Fresh
                    potentialFreshZones.push( {'position': false, 'bases': potentialZone, 'zoneCeiling': zoneCeiling, 'zoneFloor': zoneFloor, 'zoneHeight': zoneHeight, 'formation': formation, 'type': 'checking for fresh', 'incomingLeg': i, 'outgoingLeg': idx, 'isItFreshBars': 1, 'priceReturnedToZone': 0} )
                }
              } else {
                if (formation !== 'rally') {
                  if (percentageInsideZone > outgoingLegPercentage) {
                    console.log('Outgoing Leg is more than 40% inside zone.')
                  }

                  console.log('This Drop is NOT explosive.')
                }
              }
            }
            // Finished setting Potential Zone, leave loop to return data for chart below
              console.log('The bar were looking at as possible Incoming Leg before deducting 1: ', i)
              console.log('Line 810')
          }
              //This is when invalidIncomingLeg === true

            }  else if (potentialZone.length > 6) {
              //There were more than 6 bases in between Incoming Leg and Outgoing Leg -- UNUSED

                unusedZones.push({'incomingLeg': newArray[i], 'outgoingLeg': newArray[idx], 'bases': potentialZone, 'zoneCeiling': zoneCeiling, 'zoneFloor': zoneFloor, 'zoneHeight': zoneHeight, 'formation': formation, 'type': 'Unused - More than 6 Bars Between Legs'} )

                potentialZone = []
                invalidIncomingLeg = false
                zoneInvalidatedByLegBases = false
              }
              //Go back to initial i loop, checking previous bar if there is one
              console.log('Are we touching this one?')
              potentialZone = []
              invalidIncomingLeg = false
              zoneInvalidatedByLegBases = false
              candlestickSizeOutsideZone = 0
              i = i - 1
              if (i < firstPotentialLeg ) {
                console.log('We looked through all the possible Incoming Legs (6 bars).')
              } else {
              console.log('Now well see if this bar is an Incoming Leg: ', i)
            }
            } else {
              console.log('BAR IS NOT A LEG')
              potentialZone = []
              invalidIncomingLeg = false
              zoneInvalidatedByLegBases = false
              candlestickSizeOutsideZone = 0
              i = i - 1
              console.log('Lets check if this one is a leg: ', i)
            }
          }
          } else {
            console.log('Bar is NOT a leg: ', bar)
          }
        }
            return {"x": dateTime,
            "open": bar[2],
            "high": bar[3],
            "low": bar[4],
            "close": bar[5]}
          })
      }, () => this.props.handleChartData(this.state))
    }
  }

    render() {
      console.log('In OptionsComponent, explosiveBarMultiplier is: ', this.state.explosiveBarMultiplier)
      console.log('RENDERING OptionsComponnet. this.state.baseMarkers.length: ', this.state.baseMarkers.length)
      return (
        <div></div>
      )
    }
  }


  export default OptionsComponent;
