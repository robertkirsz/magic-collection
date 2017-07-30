// ------------------------------------------------
// Popup with card details displayed on card hover
// ------------------------------------------------

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
// --- Components ---
import { CardDetails } from './'
import { FadeScale } from '../transitions'

export default class CardDetailsPopup extends Component {
  static propTypes = {
    // Card data to be displayed
    card: PropTypes.object.isRequired,
    // True when "onMouseEnter" is triggered on the card
    show: PropTypes.bool.isRequired,
    // Cursor positions (relative to the card and to the window)
    coordinates: PropTypes.object.isRequired
  }

  state = {
    isVisible: false,
    popupStyle: {}
  }

  timeout = null
  popup = null

  componentWillReceiveProps (nextProps) {
    if (this.props.show && !nextProps.show) {
      this.hideDetailsPopup()
      return
    }

    // On mouse move...
    clearTimeout(this.timeout)
    // If popup is visible
    if (this.state.isVisible) {
      // Hide it
      this.hideDetailsPopup()
      // If popup is hidden
    } else if (nextProps.show) {
      // Show it
      this.timeout = setTimeout(() => {
        this.showDetailsPopup()
      }, 500)
    }
  }

  componentWillUnmount () {
    clearTimeout(this.timeout)
  }

  showDetailsPopup () {
    this.setState({ isVisible: true })
    this.updateDetailsPopupPosition(this.props.coordinates)
  }

  hideDetailsPopup () {
    clearTimeout(this.timeout)
    this.setState({ isVisible: false })
  }

  updateDetailsPopupPosition = ({ pageX, pageY, cardX, cardY }) => {
    if (!this.state.isVisible) return

    const offset = 10
    const popup = this.popup.getBoundingClientRect()
    const left =
      pageX + popup.width + offset > window.innerWidth
        ? cardX - (popup.width + offset * 3)
        : cardX + offset
    const top =
      pageY + popup.height + offset > window.innerHeight
        ? cardY - (popup.height + offset)
        : cardY + offset
    const popupStyle = { top, left }

    this.setState({ popupStyle })
  }

  render = () =>
    <FadeScale in={this.state.isVisible}>
      <StyledCardDetailsPopup
        style={this.state.popupStyle}
        innerRef={o => { this.popup = o }}
      >
        <CardDetails card={this.props.card} />
      </StyledCardDetailsPopup>
    </FadeScale>
}

const StyledCardDetailsPopup = styled.div.attrs({
  className: 'CardDetailsPopup'
})`
  position: absolute;
  width: 250px;
  padding: 0.3rem 0.5rem;
  background: white;
  border-radius: var(--borderRadius);
  font-size: 0.7rem;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.3);
  pointer-events: none;
  z-index: 1000;
`
