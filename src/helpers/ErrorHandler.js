import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { dispatch } from '../redux'

import Dialog, { DialogActions, DialogContent, DialogContentText, DialogTitle } from 'material-ui/Dialog'
import Button from 'material-ui/Button'

const mapStateToProps = ({ errors }) => ({ errors })

class ErrorHandler extends Component {
  static propTypes = {
    errors: PropTypes.array.isRequired
  }

  state = { isOpened: !!this.props.errors[0] }

  componentWillReceiveProps (nextProps) {
    if (!this.state.isOpened && !!nextProps.errors[0]) this.setState({ isOpened: true })
  }

  handleRequestClose = () => this.setState({ isOpened: false })

  handleExited = () => dispatch.hideError(this.props.errors[0].id)

  render = () => (
    <Dialog open={this.state.isOpened} onRequestClose={this.handleRequestClose} onExited={this.handleExited}>
      <DialogTitle>Oh no, we have an error!</DialogTitle>
      <DialogContent>
        <DialogContentText>{this.props.errors[0] && this.props.errors[0].message}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={this.handleRequestClose} color="primary">
          Okay
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default connect(mapStateToProps)(ErrorHandler)
