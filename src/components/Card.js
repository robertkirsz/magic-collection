import React, { Component } from 'react'
import PropTypes from 'proptypes'
import { connect } from 'react-redux'
import _includes from 'lodash/includes'
import _findIndex from 'lodash/findIndex'
import { addCard, removeCard } from 'store/myCards'
import { CardDetailsPopup } from 'components'
import cardBack from 'components/assets/card_back.jpg'
import cn from 'classnames'

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

    const w = this.refs.cardElement.clientWidth || this.refs.cardElement.offsetWidth || this.refs.cardElement.scrollWidth
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

      animations = [
        ...animations.slice(0, index),
        ...animations.slice(index + 1)
      ]

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
    const dy = (pageY - offsets.top - bdst) - h / 2
    const dx = (pageX - offsets.left - bdsl) - w / 2
    const yRotate = (offsetX - dx) * (0.07 * wMultiple)
    const xRotate = (dy - offsetY) * (0.1 * wMultiple)
    let imgCSS = 'rotateX(' + xRotate + 'deg) rotateY(' + yRotate + 'deg)'
    const arad = Math.atan2(dy, dx)
    let angle = arad * 180 / Math.PI - 90

    this.updateDetailsPopupPosition({ pageX, pageY })

    if (angle < 0) angle = angle + 360

    if (this.refs.cardContainer.className.indexOf(' over') !== -1) imgCSS += ' scale3d(1.07,1.07,1.07)'

    this.refs.cardContainer.style.transform = imgCSS

    shine.style.background = 'linear-gradient(' + angle + 'deg, rgba(255,255,255,' + (pageY - offsets.top - bdst) / h * 0.4 + ') 0%,rgba(255,255,255,0) 80%)'
    shine.style.transform = 'translateX(' + (offsetX * totalLayers) - 0.1 + 'px) translateY(' + (offsetY * totalLayers) - 0.1 + 'px)'

    let revNum = totalLayers
    for (let ly = 0; ly < totalLayers; ly++) {
      layers[ly].style.transform = 'translateX(' + (offsetX * revNum) * ((ly * 2.5) / wMultiple) + 'px) translateY(' + (offsetY * totalLayers) * ((ly * 2.5) / wMultiple) + 'px)'
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
    const {
      mainCard, variantCard, setIcon, numberOfCards, showAdd, showRemove,
      className, detailsPopup
    } = this.props
    const { animations, detailsPopupShow, detailsPopupCoordinates } = this.state

    const cardData = variantCard || mainCard

    const addRemoveControls = (
      <div className="card__add-remove-buttons">
        {showRemove &&
          <button className="remove-button" onClick={this.removeCard}>
            <span className="fa fa-minus-circle" />
          </button>
        }
        {showAdd &&
          <button className="add-button" onClick={this.addCard}>
            <span className="fa fa-plus-circle" />
          </button>
        }
      </div>
    )

    return (
      <div className="card-wrapper">
        {
          detailsPopup && (
            <CardDetailsPopup
              cardData={cardData}
              show={detailsPopupShow}
              coordinates={detailsPopupCoordinates}
            />
          )
        }
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
                {numberOfCards > 0 && <span className="card__count">{numberOfCards}</span>}
                {(showAdd || showRemove) && addRemoveControls}
                {
                animations.map(a => (
                  a.animationType === 'add'
                    ? <span key={a.id} className="card__count-animation card__count-animation--add">+1</span>
                    : <span key={a.id} className="card__count-animation card__count-animation--remove">-1</span>
                ))
              }
              </div>
            </div>
            <div className="atvImg-shine" ref="cardElementShine" />
          </div>
        </div>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Card)
