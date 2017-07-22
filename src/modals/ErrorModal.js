import React from 'react'
import PropTypes from 'prop-types'
import { List, ModalContent } from '../styled'

const propTypes = {
  message: PropTypes.string,
  onContentClick: PropTypes.func.isRequired
}

const ErrorModal = ({ message, onContentClick }) =>
  <StyledErrorModal width="auto" onClick={onContentClick}>
    <i className="fa fa-exclamation-circle" />
    <span>{message}</span>
  </StyledErrorModal>

ErrorModal.propTypes = propTypes

export default ErrorModal

const StyledErrorModal = ModalContent.withComponent(List).extend`
  .fa {
    color: rgb(200, 0, 0);
    font-size: 1.5em;
    text-shadow: var(--shadow);
  }
`
