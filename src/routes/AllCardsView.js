import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Route } from 'react-router-dom'
// --- Database ---
import { cardsDatabase } from '../database'
// --- Components ---
import { CardsSearchList, LoadingScreen } from '../components'
import CardView from '../routes/CardView'

const mapStateToProps = ({ allCards }) => ({
  filteredCards: allCards.filteredCards,
  allCardsFetching: allCards.fetching
})

const propTypes = {
  match: PropTypes.object.isRequired,
  filteredCards: PropTypes.array,
  allCardsFetching: PropTypes.bool.isRequired
}

const AllCardsView = ({ match, filteredCards, allCardsFetching }) =>
  <div>
    <Route path={`${match.url}/:cardUrl`} component={CardView} />
    <LoadingScreen in={allCardsFetching} />
    {!allCardsFetching && <CardsSearchList cards={filteredCards || cardsDatabase} />}
  </div>

AllCardsView.propTypes = propTypes

export default connect(mapStateToProps)(AllCardsView)
