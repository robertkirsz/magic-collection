import React, { Component } from 'react'
import PropTypes from 'proptypes'
import { connect } from 'react-redux'
import Transition from 'react/lib/ReactCSSTransitionGroup'
import { CardsSearchList, LoadingScreen } from 'components'

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
        <Transition
          transitionName="fade"
          transitionEnterTimeout={300}
          transitionLeaveTimeout={300}
        >
          {myCardsLoading
            ? <LoadingScreen key="a" />
            : <CardsSearchList key="b" path="my-cards" cards={filteredCards || cards} />}
        </Transition>
      </div>
    )
  }
}

export default connect(mapStateToProps)(MyCardsView)
