import React from 'react'
import PropTypes from 'proptypes'
import { connect } from 'react-redux'
import { Modal } from 'react-bootstrap'
import { closeModal } from 'store/layout'

const mapStateToProps = ({ layout }) => ({
  modalName: layout.modal.name,
  errorMessage: layout.modal.props.message
})

const mapDispatchToProps = { closeModal }

const ErrorModal = ({ modalName, errorMessage, closeModal }) => (
  <Modal
    className="error-modal"
    show={modalName === 'error'}
    onHide={closeModal}
    bsSize="small"
  >
    <Modal.Body>
      {errorMessage}
    </Modal.Body>
  </Modal>
)

ErrorModal.propTypes = {
  modalName: PropTypes.string.isRequired,
  closeModal: PropTypes.func.isRequired,
  errorMessage: PropTypes.string
}

export default connect(mapStateToProps, mapDispatchToProps)(ErrorModal)
