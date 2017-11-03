import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Route, Redirect } from 'react-router-dom'
import { connect } from 'react-redux'

const mapStateToProps = state => ({ signeIn: state.user.signeIn })

class PublicOnlyRoute extends Component {
  static propTypes = {
    signeIn: PropTypes.bool.isRequired,
    component: PropTypes.func.isRequired,
    redirectTo: PropTypes.string
  }

  static defaultProps = {
    redirectTo: '/'
  }

  render () {
    const { signeIn, redirectTo, component: Component, ...rest } = this.props

    return (
      <Route
        {...rest}
        render={props =>
          !signeIn ? (
            <Component {...props} />
          ) : (
            <Redirect to={{ pathname: redirectTo, state: { from: props.location } }} />
          )}
      />
    )
  }
}

export default connect(mapStateToProps)(PublicOnlyRoute)
