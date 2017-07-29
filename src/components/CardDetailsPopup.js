import React, { Component } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
// --- Components ---
import { CardDetails } from './'

// TODO: popup is not positioned properly on lower cards when window is scolled down
export default class CardDetailsPopup extends Component {
  static propTypes = {
    cardData: PropTypes.object,
    show: PropTypes.bool,
    coordinates: PropTypes.object,
    cardDetailsPopupDelay: PropTypes.oneOfType([PropTypes.bool, PropTypes.number]).isRequired
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
      <Container style={popupPosition} ref="detailsPopup">
        <CardDetails card={cardData} />
      </Container>
    )
  }
}

const Container = styled.div`
  position: absolute;
  width: 250px;
  padding: 5px 8px;
  background: white;
  border-radius: 5px;
  font-size: 12px;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.3);
  pointer-events: none;
  z-index: 1000;
`
