import React from 'react'
import PropTypes from 'prop-types'

const propTypes = {
  message: PropTypes.string
}

const ErrorModal = ({ message }) => <p>{message}</p>

ErrorModal.propTypes = propTypes

export default ErrorModal
