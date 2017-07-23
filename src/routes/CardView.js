// TODO: variants list should only show owned cards

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import styled from 'styled-components'
import _find from 'lodash/find'
import _startsWith from 'lodash/startsWith'
import { getLocation } from '../utils'
import { Card, CardDetails } from '../components'
import { cardsDatabase } from '../database'
import { resetVariantCardFocus, setVariantCardFocus } from '../store/keyboard'
import { ModalContent } from '../styled'
import { Fade, Scale } from '../transitions'

const mapDispatchToProps = { resetVariantCardFocus, setVariantCardFocus }

const mapStateToProps = ({ allCards, myCards, settings }, ownProps) => ({
  // Find card by its name from the URL in all the cards or cards
  // from user's collection based of what page we are on
  card: _find(_startsWith(ownProps.match.params.path, '/my-cards') ? myCards.cards : cardsDatabase, {
    cardUrl: ownProps.match.params.cardUrl
  }),
  myCards: myCards.cards,
  myCardsLocked: settings.myCardsLocked
})

class CardView extends Component {
  static propTypes = {
    history: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    card: PropTypes.object,
    myCardsLocked: PropTypes.bool,
    myCards: PropTypes.array,
    resetVariantCardFocus: PropTypes.func.isRequired,
    setVariantCardFocus: PropTypes.func.isRequired
  }

  state = { modalOpened: false }

  componentDidMount () {
    if (this.props.card) {
      setTimeout(() => {
        this.setState({ modalOpened: true })
        this.props.setVariantCardFocus(0)
      }, 80)
    }
  }

  componentWillReceiveProps (nextProps) {
    if (this.props.card && !nextProps.card) {
      this.closeModal()
    }
    if (!this.props.card && nextProps.card) {
      this.setState({ modalOpened: true })
      this.props.setVariantCardFocus(0)
    }
  }

  closeModal = () => {
    this.setState({ modalOpened: false })
    this.props.resetVariantCardFocus()
  }

  goBack = () => {
    this.props.history.replace('/' + this.props.location.pathname.split('/')[1])
  }

  onContentClick = e => {
    e.stopPropagation()
  }

  componentDidUpdate (prevProps, prevState) {
    if (prevState.modalOpened && !this.state.modalOpened) {
      setTimeout(() => {
        this.goBack()
      }, 300)
    }
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
    const { card, myCardsLocked, location } = this.props

    if (!card) {
      console.warn('ASDADASDASDSADSAD')
      return null
    }

    return (
      <Fade in={this.state.modalOpened}>
        <StyledModal onClick={this.closeModal}>
          <Scale in={this.state.modalOpened}>
            <StyledCardView onClick={this.onContentClick}>
              <TitleArea>
                {card.name}
              </TitleArea>
              <CardArea>
                <Card mainCard={card} hoverAnimation />
                {getLocation(location).onMyCardsPage &&
                  <span>
                    {/* TODO: this doesn't work, 'cardsInCollection' in not added to the Card object */}
                    &nbsp;(Total: {card.cardsInCollection})
                  </span>}
              </CardArea>
              <DetailsArea>
                <CardDetails card={card} />
              </DetailsArea>
              <VariantsArea className="card-variants-list">
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
              </VariantsArea>
            </StyledCardView>
          </Scale>
        </StyledModal>
      </Fade>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CardView)

const StyledModal = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, .5);
  z-index: 9999;
  transition: opacity var(--transitionTime);
`

const StyledCardView = ModalContent.extend`
  display: grid;
  grid-template-columns: 1fr 3fr;
  grid-template-rows: 1fr auto auto;
  grid-template-areas: "title title" "card details" "variants variants";
  grid-gap: 1rem;

  width: 100%;
  padding: 1rem;
`

const TitleArea = styled.h4`
  grid-area: title;

  margin: 0;
`

const CardArea = styled.div`grid-area: card;`

const DetailsArea = styled.div`grid-area: details;`

const VariantsArea = styled.div`
  grid-area: variants;

  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  grid-gap: 1rem;
`
