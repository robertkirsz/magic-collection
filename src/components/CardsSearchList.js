import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
// --- Helpers ---
import _slice from 'lodash/slice'
// --- Actions ---
import { setMainCardFocus, resetMainCardFocus } from '../store/keyboard'
// --- Components ---
import { Container } from '../styled'
import { Card, ShowMoreButton } from './'

const mapStateToProps = () => ({})

const mapDispatchToProps = { setMainCardFocus, resetMainCardFocus }

const initialCardsNumber = 20

class CardsSearchList extends Component {
  static propTypes = {
    history: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
    cards: PropTypes.array.isRequired,
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
    this.props.history.push(`${this.props.match.path}/${card.cardUrl}`)
  }

  render = () =>
    <StyledCardsSearchList className="cards-search-list">
      {_slice(this.props.cards, 0, this.state.cardsLimit).map((card, index) =>
        <Card key={card.id} mainCard={card} hoverAnimation detailsPopup onClick={this.onCardClick(index)} />
      )}
      {this.shouldShowButton() &&
        <ShowMoreButton
          onClick={this.showMoreCards}
          cardsLimit={this.state.cardsLimit}
          cardsNumber={this.props.cards.length}
        />}
    </StyledCardsSearchList>
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(CardsSearchList))

const StyledCardsSearchList = Container.extend`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  grid-gap: 1rem;
  padding: 2rem 1rem;
`
