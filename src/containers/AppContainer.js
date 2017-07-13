import React, { Component } from 'react'
import PropTypes from 'proptypes'
import { browserHistory, Router } from 'react-router'
import { Provider } from 'react-redux'
import _get from 'lodash/get'
import { auth, firebaseGetData } from 'utils/firebase'
import { getCards } from 'store/allCards'
import { authRequest, authSuccess, noUser } from 'store/user'
import { loadInitialSettings } from 'store/settings'
import { loadMyCards } from 'store/myCards'
import { closeModal } from 'store/layout'

const debug = false

class AppContainer extends Component {
  static propTypes = {
    routes: PropTypes.object.isRequired,
    store: PropTypes.object.isRequired
  }

  componentWillMount () {
    this.props.store.dispatch(getCards())
    this.listenToAuthChange(this.props)
  }

  shouldComponentUpdate () {
    return false
  }

  listenToAuthChange = () => {
    const { dispatch } = this.props.store

    // When user's authentication status changes...
    auth.onAuthStateChanged(async firebaseUser => {
      if (debug) console.info('Authentication state has changed')

      const { layout } = this.props.store.getState()
      const authModalOpened = layout.modal.name === 'sign in' || layout.modal.name === 'sign up'

      // Show loading message
      dispatch(authRequest())

      // Get currect time
      const now = Date.now()

      // If he's logged in...
      if (firebaseUser) {
        // Get user's from Firebase auth object
        const { uid, displayName, email, photoURL } = firebaseUser
        if (debug) console.info('User logged in as', displayName || email)

        // Get user's data from database
        const usersDataFromDatabase = await firebaseGetData('Users', uid)

        // Create empty user data object
        let userData = {}

        // If user's data don't exists in database (this is his first time logging in)...
        if (!usersDataFromDatabase.success) {
          if (debug) console.info('No user data in the database')
          // Gather user's data from Firebase authentication
          userData = {
            uid,
            displayName,
            email,
            photoURL,
            lastLogin: now,
            createdOn: now
          }
        } else {
          if (debug) console.info('Got user\'s data from the database')
          userData = {
            ...usersDataFromDatabase.data,
            lastLogin: now
          }

          // Check if user is an admin
          const userIsAdmin = await firebaseGetData('Admins', uid)
          if (userIsAdmin.success) userData.admin = true

          // Apply user's setting if he has any stored
          _get(usersDataFromDatabase, 'data.settings') &&
            dispatch(loadInitialSettings(usersDataFromDatabase.data.settings))
        }

        // Load user's collection
        dispatch(loadMyCards())
        // Save user's data in Firebase and in store
        dispatch(authSuccess(userData))
        // Close any sign in or sign up modals
        if (authModalOpened) dispatch(closeModal())
      // If user's not logged in or logged out...
      } else {
        dispatch(noUser())
        // Log that into console
        if (debug) console.warn('No user')
      }
    })
  }

  render () {
    const { routes, store } = this.props

    return (
      <Provider store={store}>
        <Router history={browserHistory} children={routes} />
      </Provider>
    )
  }
}

export default AppContainer
