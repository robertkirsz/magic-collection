import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import styled from 'styled-components'
// --- Actions ---
import { closeModal } from '../store/modal'
// --- Animations ---
import { Fade } from '../transitions'
// --- Components ---
import AuthModal from './AuthModal'
import ErrorModal from './ErrorModal'

const mapStateToProps = ({ modal }) => ({
  modalOpened: modal.opened,
  modalName: modal.name,
  modalProps: modal.props
})

const mapDispatchToProps = { closeModal }

class ModalsHandler extends Component {
  static propTypes = {
    modalOpened: PropTypes.bool.isRequired,
    modalName: PropTypes.string,
    modalProps: PropTypes.object,
    closeModal: PropTypes.func.isRequired
  }

  static defaultTypes = {
    modalProps: {}
  }

  onContentClick = e => {
    e.stopPropagation()
  }

  render () {
    let modal = null

    if (this.props.modalName === 'sign in' || this.props.modalName === 'sign up') {
      modal = (
        <StyledModal onClick={this.props.closeModal}>
          <AuthModal onContentClick={this.onContentClick} {...this.props.modalProps} />}
        </StyledModal>
      )
    }

    if (this.props.modalName === 'error') {
      modal = (
        <StyledModal error onClick={this.props.closeModal}>
          <ErrorModal onContentClick={this.onContentClick} {...this.props.modalProps} />
        </StyledModal>
      )
    }

    return (
      <Fade in={this.props.modalOpened}>
        {modal}
      </Fade>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ModalsHandler)

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
  transition: opacity var(--transitionTime);
`
