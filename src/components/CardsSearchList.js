import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
// import { browserHistory } from 'react-router'
import _slice from 'lodash/slice'
// --- Actions ---
import { setMainCardFocus, resetMainCardFocus } from '../store/keyboard'
// --- Components ---
import { Div } from '../styled'
import { Card, ShowMoreButton } from './'

const mapStateToProps = () => ({})

const mapDispatchToProps = { setMainCardFocus, resetMainCardFocus }

const initialCardsNumber = 20

class CardsSearchList extends Component {
  static propTypes = {
    cards: PropTypes.array.isRequired,
    // TODO:
    // path: PropTypes.string.isRequired,
    setMainCardFocus: PropTypes.func.isRequired,
    resetMainCardFocus: PropTypes.func.isRequired
  }

  state = { cardsLimit: initialCardsNumber }

  componentWillUnmount () {
    this.props.resetMainCardFocus()
  }

  shouldShowButton = () => this.props.cards.length > this.state.cardsLimit

  showMoreCards = () => this.setState({ cardsLimit: this.state.cardsLimit + initialCardsNumber })

  onCardClick = index => card => {
    this.props.setMainCardFocus(index)
    // TODO:
    // browserHistory.push(`/${this.props.path}/${card.cardUrl}`)
  }

  render = () =>
    <Div flex wrap justifyContent="flex-start" alignItems="flex-start">
      {_slice(this.props.cards, 0, this.state.cardsLimit).map((card, index) =>
        <Card key={card.id} mainCard={card} hoverAnimation detailsPopup onClick={this.onCardClick(index)} />
      )}
      {this.shouldShowButton() &&
        <ShowMoreButton
          onClick={this.showMoreCards}
          cardsLimit={this.state.cardsLimit}
          cardsNumber={this.props.cards.length}
        />}
    </Div>
}

export default connect(mapStateToProps, mapDispatchToProps)(CardsSearchList)
