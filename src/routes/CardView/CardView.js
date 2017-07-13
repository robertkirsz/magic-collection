import React, { Component } from 'react'
import PropTypes from 'proptypes'
import { browserHistory } from 'react-router'
import { connect } from 'react-redux'
import { Row, Col, Modal } from 'react-bootstrap'
import _find from 'lodash/find'
import { Card, CardDetails } from 'components'
import { cardsDatabase } from 'database'
import { resetVariantCardFocus, setVariantCardFocus } from 'store/keyboard'

const mapDispatchToProps = { resetVariantCardFocus, setVariantCardFocus }

const mapStateToProps = ({ allCards, myCards, settings }, ownProps) => ({
  // Find card by its name from the URL in all the cards or cards
  // from user's collection based of what page we are on
  card: _find(
    ownProps.routes[1].path === 'my-cards'
      ? myCards.cards
      : cardsDatabase,
    { cardUrl: ownProps.routeParams.cardUrl }
  ),
  myCards: myCards.cards,
  myCardsLocked: settings.myCardsLocked,
  cardModalAnimation: settings.cardModalAnimation
})

class CardView extends Component {
  static propTypes = {
    card: PropTypes.object,
    routes: PropTypes.array,
    myCardsLocked: PropTypes.bool,
    cardModalAnimation: PropTypes.bool,
    myCards: PropTypes.array,
    resetVariantCardFocus: PropTypes.func.isRequired,
    setVariantCardFocus: PropTypes.func.isRequired
  }

  state = { modalOpened: true }

  isCollectionPage = this.props.routes[1].path === 'my-cards'

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
    browserHistory.push(`/${this.props.routes[1].path}`)
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
    const { card, myCardsLocked, cardModalAnimation } = this.props
    const { modalOpened } = this.state

    if (!card) return null

    return (
      <Modal
        className="card-view"
        animation={cardModalAnimation}
        show={modalOpened} // Value is from state and is "true" by default
        bsSize="large"
        onExited={this.goBack} // Go back when exit animation finishes
        onHide={this.closeModal} // Close modal on clicking "X" icon or clicking on backdrop
      >
        <Modal.Header closeButton>
          <Modal.Title>{card.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            <Col xs={4}>
              <div className="card-picture">
                <Card
                  mainCard={card}
                  hoverAnimation
                />
                {this.isCollectionPage && <span>&nbsp;(Total: {card.cardsInCollection})</span>}
              </div>
            </Col>
            <Col xs={8}>
              <CardDetails card={card} />
            </Col>
          </Row>
          <div className="card-variants-list">
            {
              card.variants.map(variantCard => {
                const numberOfCards = this.getNumberOfCards(variantCard)

                return (
                  <Card
                    className="small"
                    key={variantCard.id}
                    mainCard={card}
                    variantCard={variantCard}
                    setIcon
                    numberOfCards={numberOfCards}
                    showAdd={!myCardsLocked}
                    showRemove={!myCardsLocked && numberOfCards > 0}
                  />
                )
              })
            }
          </div>
        </Modal.Body>
      </Modal>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CardView)
