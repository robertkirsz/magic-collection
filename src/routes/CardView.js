// TODO: variants list should only show owned cards

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Row, Col, Modal } from 'react-bootstrap'
import styled from 'styled-components'
import _find from 'lodash/find'
import _startsWith from 'lodash/startsWith'
import { getLocation } from '../utils'
import { Card, CardDetails } from '../components'
import { cardsDatabase } from '../database'
import { resetVariantCardFocus, setVariantCardFocus } from '../store/keyboard'

const mapDispatchToProps = { resetVariantCardFocus, setVariantCardFocus }

const mapStateToProps = ({ allCards, myCards, settings }, ownProps) => ({
  // Find card by its name from the URL in all the cards or cards
  // from user's collection based of what page we are on
  card: _find(_startsWith(ownProps.match.params.path, '/my-cards') ? myCards.cards : cardsDatabase, {
    cardUrl: ownProps.match.params.cardUrl
  }),
  myCards: myCards.cards,
  myCardsLocked: settings.myCardsLocked,
  cardModalAnimation: settings.cardModalAnimation
})

class CardView extends Component {
  static propTypes = {
    history: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    card: PropTypes.object,
    myCardsLocked: PropTypes.bool,
    cardModalAnimation: PropTypes.bool,
    myCards: PropTypes.array,
    resetVariantCardFocus: PropTypes.func.isRequired,
    setVariantCardFocus: PropTypes.func.isRequired
  }

  state = { modalOpened: true }

  componentDidMount () {
    this.props.setVariantCardFocus(0)
  }

  componentWillReceiveProps (nextProps) {
    if (this.props.card && !nextProps.card) this.goBack()
  }

  closeModal = () => {
    // Hide modal
    this.setState({ modalOpened: false })
    // Go back, if animation is disabled (because normally we go back when exit animation finishes)
    this.props.resetVariantCardFocus()
    if (!this.props.cardModalAnimation) this.goBack()
  }

  goBack = () => {
    this.props.history.goBack()
  }

  getNumberOfCards = variantCard => {
    // If this card has its number (is a card from collection), return it
    if (variantCard.cardsInCollection) return variantCard.cardsInCollection
    // If its a card from the "allCards" page, we'll look for it in the collection
    // First, search for the main card of the chosen variant
    const mainCardFromCollection = _find(this.props.myCards, { id: this.props.card.id })
    // If there is no such card in the collection, return 0
    if (!mainCardFromCollection) return 0
    // Second, look for a particular variant
    const variantCardFromTheCollection = _find(mainCardFromCollection.variants, { id: variantCard.id })
    // If there is no such card in the collection, return 0
    if (!variantCardFromTheCollection) return 0
    // If we found that card, return its count
    return variantCardFromTheCollection.cardsInCollection
  }

  render () {
    const { card, myCardsLocked, cardModalAnimation, location } = this.props
    const { modalOpened } = this.state

    if (!card) return null

    return (
      <Modal
        animation={cardModalAnimation}
        show={modalOpened} // Value is from state and is "true" by default
        bsSize="large"
        onExited={this.goBack} // Go back when exit animation finishes
        onHide={this.closeModal} // Close modal on clicking "X" icon or clicking on backdrop
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {card.name}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            <Col xs={4}>
              <div className="card-picture">
                <Card mainCard={card} hoverAnimation />
                {getLocation(location).onMyCardsPage &&
                  <span>
                    {/* TODO: this doesn't work, 'cardsInCollection' in not added to the Card object */}
                    &nbsp;(Total: {card.cardsInCollection})
                  </span>}
              </div>
            </Col>
            <Col xs={8}>
              <CardDetails card={card} />
            </Col>
          </Row>
          <VariantsList className="card-variants-list">
            {card.variants.map(variantCard => {
              const numberOfCards = this.getNumberOfCards(variantCard)

              return (
                <Card
                  key={variantCard.id}
                  mainCard={card}
                  variantCard={variantCard}
                  setIcon
                  numberOfCards={numberOfCards}
                  showAdd={!myCardsLocked}
                  showRemove={!myCardsLocked && numberOfCards > 0}
                  showContent
                />
              )
            })}
          </VariantsList>
        </Modal.Body>
      </Modal>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CardView)

const VariantsList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  grid-gap: 1rem;
  margin-top: 1rem;
`
