import React, { Component } from 'react'
import PropTypes from 'proptypes'
import { connect } from 'react-redux'
import { browserHistory } from 'react-router'
import _slice from 'lodash/slice'
import { Card } from 'components'
import { setMainCardFocus, resetMainCardFocus } from 'store/keyboard'

const mapStateToProps = () => ({})

const mapDispatchToProps = { setMainCardFocus, resetMainCardFocus }

const initialCardsNumber = 20

class CardsSearchList extends Component {
  static propTypes = {
    cards: PropTypes.array.isRequired,
    path: PropTypes.string.isRequired,
    setMainCardFocus: PropTypes.func.isRequired,
    resetMainCardFocus: PropTypes.func.isRequired
  }

  state = { cardsLimit: initialCardsNumber }

  componentWillUnmount () {
    this.props.resetMainCardFocus()
  }

  shouldShowButton = () => {
    return this.props.cards.length > this.state.cardsLimit
  }

  showMoreCards = () => {
    this.setState({ cardsLimit: this.state.cardsLimit + initialCardsNumber })
  }

  onCardClick = index => card => {
    this.props.setMainCardFocus(index)
    browserHistory.push(`/${this.props.path}/${card.cardUrl}`)
  }

  render () {
    const { cards } = this.props
    const { cardsLimit } = this.state

    return (
      <div className="cards-search-list">
        {
          _slice(cards, 0, cardsLimit).map((card, index) => (
            <Card
              key={card.id}
              mainCard={card}
              hoverAnimation
              detailsPopup
              onClick={this.onCardClick(index)}
            />
          ))
        }
        {
          this.shouldShowButton() && (
            <div className="cards-search-list__show-more-button" onClick={this.showMoreCards}>
              <i className="fa fa-search-plus" />
              <span className="cardsNumber">{cardsLimit} / {cards.length}</span>
            </div>
          )
        }
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CardsSearchList)
