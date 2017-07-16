/* eslint-disable no-new */
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import styled from 'styled-components'
import Chart from 'chart.js'
// --- Helpers ---
import _flatMap from 'lodash/flatMap'
import _times from 'lodash/times'
import _countBy from 'lodash/countBy'
import _flatMapDeep from 'lodash/flatMapDeep'
import _map from 'lodash/map'
import _forEach from 'lodash/forEach'
import _find from 'lodash/find'
import _filter from 'lodash/filter'
import _includes from 'lodash/includes'
// --- Components ---
import { Div } from '../styled'
import { LoadingScreen } from '../components'

const mapStateToProps = ({ myCards, allCards }) => ({
  collection: myCards.cards,
  emptyCollection: myCards.cards.length === 0,
  cardSets: allCards.cardSets,
  loadingCollection: myCards.loading,
  collectionLoaded: myCards.loaded
})

class CollectionStats extends Component {
  static propTypes = {
    collection: PropTypes.array.isRequired,
    emptyCollection: PropTypes.bool.isRequired,
    loadingCollection: PropTypes.bool.isRequired,
    collectionLoaded: PropTypes.bool.isRequired,
    cardSets: PropTypes.array.isRequired
  }

  state = { chartsInitialized: false }

  componentDidMount () {
    if (!this.state.chartsInitialized && !this.props.emptyCollection) {
      this.createCharts(this.props.collection, this.props.cardSets)
    }
  }

  componentWillReceiveProps (nextProps) {
    if (!this.props.collectionLoaded && nextProps.collectionLoaded) {
      if (!this.state.chartsInitialized && !nextProps.emptyCollection) {
        this.createCharts(nextProps.collection, nextProps.cardSets)
      }
    }
  }

  // 1. Colors pie chart
  createColorsChartData = collection => {
    // Create an array of colors for each individual card from the collection
    const colorsOfEachCard = _flatMap(collection, card => _times(card.cardsInCollection, () => card.colors))
    // Put them in an object and count by color
    const { White, Blue, Black, Red, Green, undefined } = _countBy(colorsOfEachCard)
    // Render a chart
    new Chart('cardColorsChart', {
      type: 'pie',
      data: {
        labels: ['White', 'Blue', 'Black', 'Red', 'Green', 'Colorless'],
        datasets: [
          {
            backgroundColor: ['#f0f2c0', '#b5cde3', '#aca29a', '#db8664', '#93b483', '#beb9b2'],
            data: [White, Blue, Black, Red, Green, undefined]
          }
        ]
      },
      options: {
        responsive: true,
        legend: {
          display: false
        }
      }
    })
  }

  // 2. Sets bar chart
  createSetsChartData = (collection, cardSets) => {
    // Create an array of sets for each individual card from the collection
    const setCodesOfEachCard = _flatMapDeep(collection, card =>
      _map(card.variants, card => _times(card.cardsInCollection, () => card.setCode))
    )
    // Put them in an object and count by color
    const setCodesCount = _countBy(setCodesOfEachCard)
    // Convert set codes to set names
    const setNamesCount = {}
    _forEach(setCodesCount, (count, code) => {
      const setName = _find(cardSets, { code }).name
      setNamesCount[setName] = count
    })
    // Prepare data and render a chart
    const cardSetsChartLabels = []
    const cardSetsChartData = []
    _forEach(setNamesCount, (count, name) => {
      cardSetsChartLabels.push(name)
      cardSetsChartData.push(count)
    })

    new Chart('cardSetsChart', {
      type: 'bar',
      data: {
        labels: cardSetsChartLabels,
        datasets: [
          {
            data: cardSetsChartData
          }
        ]
      },
      options: {
        responsive: true,
        legend: {
          display: false
        },
        scales: {
          yAxes: [
            {
              ticks: {
                beginAtZero: true
              }
            }
          ]
        }
      }
    })
  }

  // 3. Types bar chart
  createTypesChartData = collection => {
    // Create an array of types for each individual card from the collection
    const typesOfEachCard = _flatMapDeep(collection, card =>
      _map(card.variants, card => _times(card.cardsInCollection, () => card.types))
    )
    // Put them in an object and count by type
    const cardTypesCount = _countBy(typesOfEachCard)
    // Prepare data and render a chart
    const cardTypesChartLabels = []
    const cardTypesChartData = []
    _forEach(cardTypesCount, (count, type) => {
      cardTypesChartLabels.push(type)
      cardTypesChartData.push(count)
    })

    new Chart('cardTypesChart', {
      type: 'bar',
      data: {
        labels: cardTypesChartLabels,
        datasets: [
          {
            data: cardTypesChartData
          }
        ]
      },
      options: {
        responsive: true,
        legend: {
          display: false
        },
        scales: {
          yAxes: [
            {
              ticks: {
                beginAtZero: true
              }
            }
          ]
        }
      }
    })
  }

  // 4. Rarity bar chart
  createRarityChartData = collection => {
    // Create an array of types for each individual card from the collection
    const rarityOfEachCard = _flatMapDeep(collection, card =>
      _map(card.variants, card => _times(card.cardsInCollection, () => card.rarity))
    )
    // Put them in an object and count by type
    const rarityCount = _countBy(rarityOfEachCard)
    // Prepare data and render a chart
    const rarityChartLabels = []
    const rarityChartData = []
    _forEach(rarityCount, (count, type) => {
      rarityChartLabels.push(type)
      rarityChartData.push(count)
    })

    new Chart('rarityChart', {
      type: 'bar',
      data: {
        labels: rarityChartLabels,
        datasets: [
          {
            data: rarityChartData
          }
        ]
      },
      options: {
        responsive: true,
        legend: {
          display: false
        },
        scales: {
          yAxes: [
            {
              ticks: {
                beginAtZero: true
              }
            }
          ]
        }
      }
    })
  }

  // 5. Subtypes bar chart
  createCreatureTypesChartData = collection => {
    // Create an array of subtypes for each individual card from the collection
    const creatures = _filter(collection, card => _includes(card.types, 'Creature'))
    const creatureTypes = _flatMapDeep(creatures, card =>
      _map(card.variants, card => _times(card.cardsInCollection, () => card.subtypes))
    )
    // Put them in an object and count by subtype
    const creatureTypesCount = _countBy(creatureTypes)
    // Prepare data and render a chart
    const creatureTypesChartLabels = []
    const creatureTypesChartData = []
    _forEach(creatureTypesCount, (count, type) => {
      creatureTypesChartLabels.push(type)
      creatureTypesChartData.push(count)
    })

    new Chart('creatureTypesChart', {
      type: 'bar',
      data: {
        labels: creatureTypesChartLabels,
        datasets: [
          {
            data: creatureTypesChartData
          }
        ]
      },
      options: {
        responsive: true,
        legend: {
          display: false
        },
        scales: {
          yAxes: [
            {
              ticks: {
                beginAtZero: true
              }
            }
          ]
        }
      }
    })
  }

  // Calls all functions above
  createCharts = (collection, cardSets) => {
    this.createColorsChartData(collection)
    this.createSetsChartData(collection, cardSets)
    this.createTypesChartData(collection)
    this.createRarityChartData(collection)
    this.createCreatureTypesChartData(collection)
    this.setState({ chartsInitialized: true })
  }

  render () {
    return (
      <Container>
        <LoadingScreen in={this.props.loadingCollection} />
        <h3>Collection Stats</h3>

        {this.props.emptyCollection &&
          <Div flex justifyContent="center" alignItems="center" flexVal={1}>
            <h1>No cards in collection</h1>
          </Div>}

        <Div flex column>
          <figure>
            <canvas id="cardColorsChart" />
            {/* <figcaption>
              Multicolored cards will make total number of above data bigger then the total number of cards
            </figcaption> */}
          </figure>
          <figure>
            <canvas id="cardSetsChart" />
          </figure>
          <figure>
            <canvas id="cardTypesChart" />
          </figure>
          <figure>
            <canvas id="rarityChart" />
          </figure>
          <figure>
            <canvas id="creatureTypesChart" />
          </figure>
        </Div>
      </Container>
    )
  }
}

export default connect(mapStateToProps)(CollectionStats)

const Container = styled.div`
  display: flex;
  flex-flow: column nowrap;
  h2 {
    margin: 8px 0;
  }
  figure {
    display: inline-block;
    border: 1px solid;
    padding: 8px;
    &:not(:last-child) {
      margin-bottom: 8px;
    }
  }
`
