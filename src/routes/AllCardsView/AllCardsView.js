import React, { Component } from 'react'
import PropTypes from 'proptypes'
import { connect } from 'react-redux'
import Transition from 'react/lib/ReactCSSTransitionGroup'
import { cardsDatabase } from 'database'
import { CardsSearchList, LoadingScreen } from 'components'

const mapStateToProps = ({ allCards }) => ({
  filteredCards: allCards.filteredCards,
  allCardsFetching: allCards.fetching
})

class AllCardsView extends Component {
  static propTypes = {
    children: PropTypes.element,
    filteredCards: PropTypes.array,
    allCardsFetching: PropTypes.bool.isRequired
  }

  render () {
    // TODO: check what children are for here
    const { children, filteredCards, allCardsFetching } = this.props

    return (
      <div className="all-cards-view">
        {children}
        <Transition
          transitionName="fade"
          transitionEnterTimeout={300}
          transitionLeaveTimeout={300}
        >
          {allCardsFetching
            ? <LoadingScreen key="a" />
            : <CardsSearchList key="b" path="all-cards" cards={filteredCards || cardsDatabase} />}
        </Transition>
      </div>
    )
  }
}

export default connect(mapStateToProps)(AllCardsView)
