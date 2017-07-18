import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import styled from 'styled-components'
// --- Actions ---
import { closeModal } from '../store/layout'
// -- Components ---
import { Modal } from 'react-bootstrap'

const mapStateToProps = ({ layout }) => ({
  modalName: layout.modal.name,
  errorMessage: layout.modal.props.message
})

const mapDispatchToProps = { closeModal }

const ErrorModal = ({ modalName, errorMessage, closeModal }) => (
  <StyledModal
    className="error-modal"
    show={modalName === 'error'}
    onHide={closeModal}
    bsSize="small"
  >
    <Modal.Body>
      {errorMessage}
    </Modal.Body>
  </StyledModal>
)

ErrorModal.propTypes = {
  modalName: PropTypes.string.isRequired,
  closeModal: PropTypes.func.isRequired,
  errorMessage: PropTypes.string
}

export default connect(mapStateToProps, mapDispatchToProps)(ErrorModal)

const StyledModal = styled(Modal)`
  background: rgba(200, 0, 0, 0.5);
`
