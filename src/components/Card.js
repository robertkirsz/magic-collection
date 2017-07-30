import React, { Component } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
// --- Helpers ---
import cn from 'classnames'
import _findIndex from 'lodash/findIndex'
// --- Components ---
import { CardDetailsPopup, CardHoverEffect } from './'
// --- Assets ---
import cardBack from './assets/card_back.jpg'

export default class Card extends Component {
  static propTypes = {
    mainCard: PropTypes.object,
    variantCard: PropTypes.object,
    setIcon: PropTypes.bool,
    numberOfCards: PropTypes.number,
    showAdd: PropTypes.bool,
    showRemove: PropTypes.bool,
    addCard: PropTypes.func,
    removeCard: PropTypes.func,
    onClick: PropTypes.func,
    cardDetailsPopup: PropTypes.bool,
    hoverAnimation: PropTypes.bool, // TODO: Refactor this - This is from props (route based)
    showContent: PropTypes.bool
  }

  state = {
    animations: [],
    detailsPopupShow: false,
    detailsPopupCoordinates: {}
  }

  animationTimeout = null

  componentWillUnmount () {
    clearTimeout(this.animationTimeout)
    this.animationTimeout = null
  }

  onCardClick = () => {
    if (this.props.onClick) {
      this.props.onClick(this.props.variantCard || this.props.mainCard)
    }
  }

  addCard = () => {
    this.props.addCard(this.props.mainCard, this.props.variantCard)
    this.animate('add')
  }

  removeCard = () => {
    this.props.removeCard(this.props.mainCard, this.props.variantCard)
    this.animate('remove')
  }

  showDetailsPopup = () => {
    this.setState({ detailsPopupShow: true })
  }

  hideDetailsPopup = () => {
    this.setState({ detailsPopupShow: false })
  }

  updateDetailsPopupPosition = detailsPopupCoordinates => {
    // TODO: debounce it
    this.setState({ detailsPopupCoordinates })
  }

  animate = animationType => {
    const id = Date.now()
    const animations = [...this.state.animations]

    animations.push({ id, animationType })

    this.setState({ animations })

    this.animationTimeout = setTimeout(() => {
      let animations = [...this.state.animations]
      const index = _findIndex(animations, { id })

      animations = [...animations.slice(0, index), ...animations.slice(index + 1)]

      if (this.animationTimeout) this.setState({ animations })
    }, 1000)
  }

  render () {
    const {
      mainCard,
      variantCard,
      setIcon,
      numberOfCards,
      showAdd,
      showRemove,
      cardDetailsPopup,
      hoverAnimation
    } = this.props
    const { animations, detailsPopupShow, detailsPopupCoordinates } = this.state

    const cardData = variantCard || mainCard

    const addRemoveControls = (
      <div className="add-remove-buttons">
        {showRemove &&
          <button className="remove-button" onClick={this.removeCard}>
            <span className="fa fa-minus-circle" />
          </button>}
        {showAdd &&
          <button className="add-button" onClick={this.addCard}>
            <span className="fa fa-plus-circle" />
          </button>}
      </div>
    )

    const countAnimations = animations.map(
      a =>
        a.animationType === 'add'
          ? <span key={a.id} className="count-animation count-animation--add">
              +1
            </span>
          : <span key={a.id} className="count-animation count-animation--remove">
              -1
            </span>
    )

    return (
      <StyledCard className="card" tabIndex="1">
        <CardHoverEffect
          onClick={this.onCardClick}
          hoverAnimation={hoverAnimation}
          onMouseEnter={this.showDetailsPopup}
          onMouseLeave={this.hideDetailsPopup}
          onMouseMove={this.updateDetailsPopupPosition}
        >
          <div>
            {this.props.showContent &&
              <div className="content">
                {setIcon && <span className={cn('set-icon', cardData.setIcon)} />}
                {numberOfCards > 0 &&
                  <span className="count">
                    {numberOfCards}
                  </span>}
                {(showAdd || showRemove) && addRemoveControls}
                {countAnimations}
              </div>}
            <div className="images">
              <img src={cardData.image} className="artwork" alt="Card artwork" />
              <img src={cardBack} className="background" alt="Card background" />
            </div>
          </div>
        </CardHoverEffect>
        {cardDetailsPopup &&
          <CardDetailsPopup
            card={cardData}
            show={detailsPopupShow}
            coordinates={detailsPopupCoordinates}
          />}
      </StyledCard>
    )
  }
}

const StyledCard = styled.div`
  position: relative;
  transition: transform 0.1s;
  &:hover {
    z-index: 10;
  }
  &:focus {
    transform: scale(1.05);
  }

  .content {
    position: absolute;
    width: 100%;
    height: 100%;
    z-index: 2;
    &:hover {
      .add-remove-buttons {
        opacity: 1;
      }
    }
  }

  .images {
    position: relative;
    border-radius: 4%;
    overflow: hidden;
    z-index: 1;
    img {
      width: 100%;
      &.artwork {
        position: absolute;
        height: 100%;
      }
    }
  }

  .set-icon {
    position: absolute;
    bottom: 30px;
    left: 50%;
    padding: 3px;
    background: white;
    border-radius: 20%;
    font-size: 2.5em;
    transform: translateX(-50%);
  }

  .count {
    position: absolute;
    bottom: 4px;
    left: 4px;
    width: 1.4em;
    height: 1.4em;
    background: white;
    border: 1px solid black;
    border-radius: 0.3em;
    color: black;
    font-size: 1.3em;
    line-height: 1.4em;
    font-weight: 700;
    text-align: center;
  }

  .add-remove-buttons {
    display: flex;
    position: absolute;
    top: 50%;
    right: 15%;
    left: 15%;
    transform: translateY(-50%);
    opacity: 0;
    transition: opacity 0.1s;
    button {
      background: none;
      border: none;
      outline: none;
      transition: transform 0.1s;
      &:active {
        transform: scale(0.9);
      }
      &.remove-button {
        margin-right: auto;
      }
      &.add-button {
        margin-left: auto;
      }
    }
    .fa {
      font-size: 2em;
      color: white;
      text-shadow: 1px 1px 2px black;
    }
  }

  .count-animation {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    font-size: 2em;
    font-weight: bold;
    animation: fly 1s ease-out 1 forwards;
    pointer-events: none;
    &.count-animation--add {
      color: #8cf54c;
    }
    &.count-animation--remove {
      color: #f14621;
    }
  }
`
