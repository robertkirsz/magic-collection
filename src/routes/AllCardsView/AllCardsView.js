import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
// --- Database ---
import { cardsDatabase } from '../../database'
// --- Components ---
import { CardsSearchList, LoadingScreen } from '../../components'
import { Div } from '../../styled'

const mapStateToProps = ({ allCards }) => ({
  filteredCards: allCards.filteredCards,
  allCardsFetching: allCards.fetching
})

const AllCardsView = ({ filteredCards, allCardsFetching }) =>
  <Div flex column flexVal={1} className="all-cards-view">
    <LoadingScreen in={allCardsFetching} />
    {!allCardsFetching && <CardsSearchList cards={filteredCards || cardsDatabase} />}
  </Div>

AllCardsView.propTypes = {
  filteredCards: PropTypes.array,
  allCardsFetching: PropTypes.bool.isRequired
}

export default connect(mapStateToProps)(AllCardsView)
