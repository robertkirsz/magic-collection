import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Route, Redirect } from 'react-router-dom'
import { connect } from 'react-redux'

const mapStateToProps = state => ({ signedIn: state.user.signedIn })

class PrivateRoute extends Component {
  static propTypes = {
    signedIn: PropTypes.bool.isRequired,
    component: PropTypes.func.isRequired,
    redirectTo: PropTypes.string
  }

  static defaultProps = {
    redirectTo: '/'
  }

  render () {
    const { signedIn, redirectTo, component: Component, ...rest } = this.props

    return (
      <Route
        {...rest}
        render={props =>
          signedIn ? (
            <Component {...props} />
          ) : (
            <Redirect to={{ pathname: redirectTo, state: { from: props.location } }} />
          )}
      />
    )
  }
}

export default connect(mapStateToProps)(PrivateRoute)
