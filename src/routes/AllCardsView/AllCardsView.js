import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Transition from 'react/lib/ReactCSSTransitionGroup'
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
    <Transition transitionName="fade" transitionEnterTimeout={300} transitionLeaveTimeout={300}>
      {allCardsFetching
        ? <LoadingScreen key="a" />
        : <CardsSearchList key="b" path="all-cards" cards={filteredCards || cardsDatabase} />}
    </Transition>
  </Div>

AllCardsView.propTypes = {
  filteredCards: PropTypes.array,
  allCardsFetching: PropTypes.bool.isRequired
}

export default connect(mapStateToProps)(AllCardsView)
