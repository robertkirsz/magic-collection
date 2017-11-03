import { Component } from 'react'
import PropTypes from 'prop-types'

export default class ErrorBoundary extends Component {
  static propTypes = {
    message: PropTypes.string,
    children: PropTypes.node.isRequired
  }

  static defaultProps = { message: 'Error... :(' }

  state = { error: null }

  componentDidCatch = error => this.setState({ error })

  render = () => (this.state.error ? `${this.props.message} ${this.state.error.message}` : this.props.children)
}
