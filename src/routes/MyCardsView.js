import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Route } from 'react-router-dom'
// --- Components ---
import { Div } from '../styled'
import { CardsSearchList, LoadingScreen } from '../components'
import CardView from '../routes/CardView'

const mapStateToProps = ({ myCards }) => ({
  cards: myCards.cards,
  filteredCards: myCards.filteredCards,
  myCardsLoading: myCards.loading
})

const propTypes = {
  match: PropTypes.object.isRequired,
  cards: PropTypes.array,
  filteredCards: PropTypes.array,
  myCardsLoading: PropTypes.bool.isRequired
}

const MyCardsView = ({ match, cards, filteredCards, myCardsLoading }) => {
  if (!myCardsLoading && !cards.length) {
    return (
      <Div flex justifyContent="center" alignItems="center" flexVal={1}>
        <h1>No cards in collection</h1>
      </Div>
    )
  }

  return (
    <main>
      <Route path={`${match.url}/:cardUrl`} component={CardView} />
      <LoadingScreen in={myCardsLoading} />
      {!myCardsLoading && <CardsSearchList cards={filteredCards || cards} />}
    </main>
  )
}

MyCardsView.propTypes = propTypes

export default connect(mapStateToProps)(MyCardsView)
