import React, { Component } from 'react'
import PropTypes from 'proptypes'
import { connect } from 'react-redux'
import { CardDetails } from 'components'

const mapStateToProps = ({ settings }) => ({
  cardDetailsPopupDelay: settings.cardDetailsPopupDelay
})

// TODO: popup is not positioned properly on lower cards when window is scolled down
class CardDetailsPopup extends Component {
  static propTypes = {
    cardData: PropTypes.object,
    show: PropTypes.bool,
    coordinates: PropTypes.object,
    cardDetailsPopupDelay: PropTypes.oneOfType([
      PropTypes.bool,
      PropTypes.number
    ])
  }

  state = {
    popupVisible: false,
    popupPosition: {}
  }

  timeout = null

  componentWillReceiveProps (nextProps) {
    if (nextProps.cardDetailsPopupDelay === false) return

    if (this.props.show && !nextProps.show) {
      this.hideDetailsPopup()
      return
    }

    // On mouse move...
    if (nextProps.coordinates.pageX !== undefined && nextProps.coordinates.pageY !== undefined) {
      clearTimeout(this.timeout)
      // If popup is visible
      if (this.state.popupVisible) {
        if (this.props.cardDetailsPopupDelay > 0) {
          // Hide it
          this.hideDetailsPopup()
        }
      // If popup is hidden
      } else if (nextProps.show) {
        // Show it
        this.timeout = setTimeout(() => {
          this.showDetailsPopup()
        }, this.props.cardDetailsPopupDelay)
      }
    }
  }

  componentWillUnmount () {
    clearTimeout(this.timeout)
  }

  showDetailsPopup () {
    this.setState({ popupVisible: true })
    this.updateDetailsPopupPosition(this.props.coordinates)
  }

  hideDetailsPopup () {
    clearTimeout(this.timeout)
    this.setState({ popupVisible: false })
  }

  updateDetailsPopupPosition = ({ pageX, pageY }) => {
    if (!this.state.popupVisible) return

    const offset = 10
    const popupWidth = this.refs.detailsPopup.clientWidth
    const popupHeight = this.refs.detailsPopup.clientHeight
    const windowWidth = window.innerWidth
    const windowHeight = window.innerHeight
    let top = pageY + offset
    let left = pageX + offset

    if (pageY + popupHeight > windowHeight) top = top - popupHeight
    if (pageX + popupWidth > windowWidth) left = left - popupWidth

    this.setState({ popupPosition: { top, left } })
  }

  render () {
    const { cardData, cardDetailsPopupDelay } = this.props
    const { popupPosition, popupVisible } = this.state

    if (cardDetailsPopupDelay === false || !popupVisible) return null

    return (
      <div
        className="card__details-popup"
        style={popupPosition}
        ref="detailsPopup"
      >
        <CardDetails card={cardData} />
      </div>
    )
  }
}

export default connect(mapStateToProps)(CardDetailsPopup)
