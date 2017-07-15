import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
// --- Components ---
import { CardsSearchList, LoadingScreen } from '../../components'

const mapStateToProps = ({ myCards }) => ({
  cards: myCards.cards,
  filteredCards: myCards.filteredCards,
  myCardsLoading: myCards.loading
})

class MyCardsView extends Component {
  static propTypes = {
    children: PropTypes.element,
    cards: PropTypes.array,
    filteredCards: PropTypes.array,
    myCardsLoading: PropTypes.bool.isRequired
  }

  render () {
    const { children, cards, filteredCards, myCardsLoading } = this.props

    if (!myCardsLoading && !cards.length) {
      return (
        <div className="my-cards-view">
          {children}
          <h1 className="my-cards-view__login-prompt">No cards in collection</h1>
        </div>
      )
    }

    return (
      <div className="my-cards-view">
        {children}
        <LoadingScreen in={myCardsLoading} />
        {!myCardsLoading && <CardsSearchList cards={filteredCards || cards} />}
      </div>
    )
  }
}

export default connect(mapStateToProps)(MyCardsView)
