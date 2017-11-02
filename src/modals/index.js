import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import styled from 'styled-components'

import { dispatch } from '../redux'
// --- Animations ---
import { Fade, Scale } from '../transitions'
// --- Components ---
import AuthModal from './AuthModal'
import ErrorModal from './ErrorModal'

const mapStateToProps = ({ modal }) => ({
  modalOpened: modal.opened,
  modalName: modal.name,
  modalProps: modal.props
})

class ModalsHandler extends Component {
  static propTypes = {
    modalOpened: PropTypes.bool.isRequired,
    modalName: PropTypes.string,
    modalProps: PropTypes.object
  }

  static defaultTypes = {
    modalProps: {}
  }

  onContentClick = e => {
    e.stopPropagation()
  }

  render () {
    let modal = ''

    if (this.props.modalName === 'sign in' || this.props.modalName === 'sign up') {
      modal = (
        <AuthModal onContentClick={this.onContentClick} {...this.props.modalProps} />
      )
    }

    if (this.props.modalName === 'error') {
      modal = (
        <ErrorModal onContentClick={this.onContentClick} {...this.props.modalProps} />
      )
    }

    return (
      <Fade in={this.props.modalOpened}>
        <StyledModal error={this.props.modalName === 'error'} onClick={dispatch.closeModal}>
          <Scale in={this.props.modalOpened}>
            {modal}
          </Scale>
        </StyledModal>
      </Fade>
    )
  }
}

export default connect(mapStateToProps)(ModalsHandler)

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
  background: ${props => (props.error ? 'rgba(200, 0, 0, .5)' : 'rgba(0, 0, 0, .5)')};
  z-index: 9999;
`
