import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import styled from 'styled-components'
// --- Actions ---
import { closeModal } from '../store/layout'
// --- Animations ---
import { Fade } from '../transitions'
// --- Components ---
import AuthModal from './AuthModal'
import ErrorModal from './ErrorModal'

const mapStateToProps = ({ layout }) => ({
  modalName: layout.modal.name,
  modalProps: layout.modal.props
})

const mapDispatchToProps = { closeModal }

class ModalsHandler extends Component {
  static propTypes = {
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

  render = () =>
    <Fade in={!!this.props.modalName}>
      <StyledModal error={this.props.modalName === 'error'} onClick={this.props.closeModal}>
        <div onClick={this.onContentClick}>
          {(this.props.modalName === 'sign in' || this.props.modalName === 'sign up') &&
            <AuthModal {...this.props.modalProps} />}
          {this.props.modalName === 'error' &&
            <ErrorModal {...this.props.modalProps} />}
        </div>
      </StyledModal>
    </Fade>
}

export default connect(mapStateToProps, mapDispatchToProps)(ModalsHandler)

const StyledModal = styled.div`
  display: flex;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: ${props => (props.error ? 'rgba(200, 0, 0, .5)' : 'rgba(0, 0, 0, .5)')};
  z-index: 9999;
  transition: opacity .3s ease;
  > div {
    width: 300px;
    margin: auto;
    padding: 16px;
    background-color: white;
    border-radius: var(--borderRadius);
    box-shadow: 0 2px 8px rgba(0, 0, 0, .33);
    transition: all .3s;
  }
`
