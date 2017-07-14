import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
// --- Helpers ---
import _get from 'lodash/get'
import { log } from './utils'
// --- Firebase ---
import { auth, firebaseGetData } from './firebase'
// --- Actions ---
import { getCards } from './store/allCards'
import { loadMyCards } from './store/myCards'
import { authRequest, authSuccess, noUser } from './store/user'
import { loadInitialSettings } from './store/settings'
import { closeModal } from './store/layout'
// --- Components ---
import { AuthModal, ErrorModal } from './containers'
import { Header } from './components'

const mapStateToProps = ({ layout }) => ({
  modalName: layout.modal.name
})

const mapDispatchToProps = {
  getCards,
  loadMyCards,
  authRequest,
  authSuccess,
  noUser,
  loadInitialSettings,
  closeModal
}

// TODO: redirect user on logout

class App extends Component {
  static propTypes = {
    modalName: PropTypes.string.isRequired,
    authRequest: PropTypes.func.isRequired,
    getCards: PropTypes.func.isRequired,
    loadInitialSettings: PropTypes.func.isRequired,
    loadMyCards: PropTypes.func.isRequired,
    noUser: PropTypes.func.isRequired,
    authSuccess: PropTypes.func.isRequired,
    closeModal: PropTypes.func.isRequired
  }

  componentWillMount () {
    this.props.getCards()
    this.listenToAuthChange(this.props)
  }

  listenToAuthChange = () => {
    // When user's authentication status changes...
    auth.onAuthStateChanged(async firebaseUser => {
      log('Authentication state has changed')

      const authModalOpened =
        this.props.modalName === 'sign in' || this.props.modalName === 'sign up'

      // Show loading message
      this.props.authRequest()

      // Get currect time
      const now = Date.now()

      // If he's logged in...
      if (firebaseUser) {
        // Get user's from Firebase auth object
        const { uid, displayName, email, photoURL } = firebaseUser
        log('User logged in as', displayName || email)

        // Get user's data from database
        const usersDataFromDatabase = await firebaseGetData('Users', uid)

        // Create empty user data object
        let userData = {}

        // If user's data don't exists in database (this is his first time logging in)...
        if (!usersDataFromDatabase.success) {
          log('No user data in the database')
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
          log("Got user's data from the database")
          userData = {
            ...usersDataFromDatabase.data,
            lastLogin: now
          }

          // Check if user is an admin
          const userIsAdmin = await firebaseGetData('Admins', uid)
          if (userIsAdmin.success) userData.admin = true

          // Apply user's setting if he has any stored
          _get(usersDataFromDatabase, 'data.settings') &&
            this.props.loadInitialSettings(usersDataFromDatabase.data.settings)
        }

        // Load user's collection
        this.props.loadMyCards()
        // Save user's data in Firebase and in store
        this.props.authSuccess(userData)
        // Close any sign in or sign up modals
        if (authModalOpened) this.props.closeModal()
        // If user's not logged in or logged out...
      } else {
        this.props.noUser()
        // Log that into console
        log('No user')
      }
    })
  }

  render () {
    return (
      <div className="App">
        <Header />
        <AuthModal />
        <ErrorModal />
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App)
