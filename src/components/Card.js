import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
// --- Helpers ---
import cn from 'classnames'
import _includes from 'lodash/includes'
import _findIndex from 'lodash/findIndex'
// --- Actions ---
import { addCard, removeCard } from '../store/myCards'
// --- Components ---
import { CardContainer } from '../styled'
import { CardDetailsPopup } from './'
// --- Assets ---
import cardBack from './assets/card_back.jpg'

let bd
let htm

const mapStateToProps = ({ settings }) => ({
  cardHoverAnimation: settings.cardHoverAnimation
})

const mapDispatchToProps = { addCard, removeCard }

class Card extends Component {
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
    className: PropTypes.string,
    detailsPopup: PropTypes.bool,
    hoverAnimation: PropTypes.bool, // TODO: Refactor this - This is from props (route based)
    cardHoverAnimation: PropTypes.bool.isRequired // TODO: Refactor this - This is from settings
  }

  state = {
    animations: [],
    detailsPopupShow: null,
    detailsPopupCoordinates: {}
  }

  animationTimeout = null

  componentDidMount () {
    bd = document.getElementsByTagName('body')[0]
    htm = document.getElementsByTagName('html')[0]

    const w =
      this.refs.cardElement.clientWidth || this.refs.cardElement.offsetWidth || this.refs.cardElement.scrollWidth
    this.refs.cardElement.style.transform = 'perspective(' + w * 3 + 'px)'
  }

  componentWillUnmount () {
    clearTimeout(this.animationTimeout)
    this.animationTimeout = null
  }

  onCardClick = () => {
    if (this.props.onClick) {
      this.processExit()
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

  processMovement = e => {
    if (!this.props.cardHoverAnimation || !this.props.hoverAnimation) return
    // This covers situation where "mouseMove" happens without "mouseEnter"
    if (!_includes(this.refs.cardContainer.className, ' over')) this.processEnter()

    const touchEnabled = false
    const elem = this.refs.cardElement
    const layers = [this.refs.cardElementLayer1, this.refs.cardElementLayer2]
    const totalLayers = 2
    const shine = this.refs.cardElementShine
    const bdst = bd.scrollTop || htm.scrollTop
    const bdsl = bd.scrollLeft
    const pageX = touchEnabled ? e.touches[0].pageX : e.pageX
    const pageY = touchEnabled ? e.touches[0].pageY : e.pageY
    const offsets = elem.getBoundingClientRect()
    const w = elem.clientWidth || elem.offsetWidth || elem.scrollWidth
    const h = elem.clientHeight || elem.offsetHeight || elem.scrollHeight
    const wMultiple = 320 / w
    const offsetX = 0.52 - (pageX - offsets.left - bdsl) / w
    const offsetY = 0.52 - (pageY - offsets.top - bdst) / h
    const dy = pageY - offsets.top - bdst - h / 2
    const dx = pageX - offsets.left - bdsl - w / 2
    const yRotate = (offsetX - dx) * (0.07 * wMultiple)
    const xRotate = (dy - offsetY) * (0.1 * wMultiple)
    let imgCSS = 'rotateX(' + xRotate + 'deg) rotateY(' + yRotate + 'deg)'
    const arad = Math.atan2(dy, dx)
    let angle = arad * 180 / Math.PI - 90

    this.updateDetailsPopupPosition({ pageX, pageY })

    if (angle < 0) angle = angle + 360

    if (this.refs.cardContainer.className.indexOf(' over') !== -1) imgCSS += ' scale3d(1.07,1.07,1.07)'

    this.refs.cardContainer.style.transform = imgCSS

    shine.style.background =
      'linear-gradient(' +
      angle +
      'deg, rgba(255,255,255,' +
      (pageY - offsets.top - bdst) / h * 0.4 +
      ') 0%,rgba(255,255,255,0) 80%)'
    shine.style.transform =
      'translateX(' + offsetX * totalLayers - 0.1 + 'px) translateY(' + offsetY * totalLayers - 0.1 + 'px)'

    let revNum = totalLayers
    for (let ly = 0; ly < totalLayers; ly++) {
      layers[ly].style.transform =
        'translateX(' +
        offsetX * revNum * (ly * 2.5 / wMultiple) +
        'px) translateY(' +
        offsetY * totalLayers * (ly * 2.5 / wMultiple) +
        'px)'
      revNum--
    }
  }

  processEnter = () => {
    this.showDetailsPopup()
    if (!this.props.cardHoverAnimation || !this.props.hoverAnimation) return

    this.refs.cardContainer.className += ' over'
  }

  processExit = () => {
    this.hideDetailsPopup()
    if (!this.props.cardHoverAnimation || !this.props.hoverAnimation) return

    const layers = [this.refs.cardElementLayer1, this.refs.cardElementLayer2]
    const totalLayers = 2
    const shine = this.refs.cardElementShine

    const container = this.refs.cardContainer

    container.className = container.className.replace(' over', '')
    container.style.transform = ''
    shine.style.cssText = ''

    for (let ly = 0; ly < totalLayers; ly++) layers[ly].style.transform = ''
  }

  render () {
    const { mainCard, variantCard, setIcon, numberOfCards, showAdd, showRemove, className, detailsPopup } = this.props
    const { animations, detailsPopupShow, detailsPopupCoordinates } = this.state

    const cardData = variantCard || mainCard

    const addRemoveControls = (
      <div className="card__add-remove-buttons">
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

    return (
      <Container className="card-wrapper">
        <div
          ref="cardElement"
          className={cn('card atvImg', className)}
          style={this.props.onClick && { cursor: 'pointer' }}
          onClick={this.onCardClick}
          onMouseMove={this.processMovement}
          onMouseEnter={this.processEnter}
          onMouseLeave={this.processExit}
          tabIndex="1"
        >
          <div className="atvImg-container" ref="cardContainer">
            <div className="atvImg-shadow" />
            <div className="atvImg-layers">
              <div
                className="atvImg-rendered-layer"
                style={{ backgroundImage: `url(${cardData.image}), url(${cardBack})` }}
                ref="cardElementLayer1"
              />
              <div className="atvImg-rendered-layer card__content" ref="cardElementLayer2">
                {setIcon && <span className={cn('card__set-icon', cardData.setIcon)} />}
                {numberOfCards > 0 &&
                  <span className="card__count">
                    {numberOfCards}
                  </span>}
                {(showAdd || showRemove) && addRemoveControls}
                {animations.map(
                  a =>
                    a.animationType === 'add'
                      ? <span key={a.id} className="card__count-animation card__count-animation--add">
                          +1
                        </span>
                      : <span key={a.id} className="card__count-animation card__count-animation--remove">
                          -1
                        </span>
                )}
              </div>
            </div>
            <div className="atvImg-shine" ref="cardElementShine" />
          </div>
        </div>
        {detailsPopup &&
          <CardDetailsPopup cardData={cardData} show={detailsPopupShow} coordinates={detailsPopupCoordinates} />}
      </Container>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Card)

const Container = CardContainer.extend`
  .card {
    background-repeat: no-repeat;
    background-position: 0 0;
    background-size: cover;
    &:focus {
      .atvImg-layers {
        transform: scale(1.05);
      }
    }

    &__content {
      height: 100%;
      z-index: 2;
      &:hover {
        .card__add-remove-buttons {
          opacity: 1;
        }
      }
    }

    &__set-icon {
      position: absolute;
      bottom: 30px;
      left: 50%;
      padding: 3px;
      background: white;
      border-radius: 20%;
      font-size: 2.5em;
      transform: translateX(-50%);
    }

    &__count {
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

    &__add-remove-buttons {
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

    &__count-animation {
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
      &.card__count-animation--add {
        color: #8cf54c;
      }
      &.card__count-animation--remove {
        color: #f14621;
      }
    }

    &__details-popup {
      position: absolute;
      width: 250px;
      padding: 5px 8px;
      background: white;
      border-radius: 5px;
      font-size: 12px;
      box-shadow: 0 3px 10px rgba(black, 0.3);
      pointer-events: none;
      z-index: 1000;
    }
  }
`
