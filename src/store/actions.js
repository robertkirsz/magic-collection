import store from './index'

// --- Firebase ---
import {
  auth,
  firebaseGetData,
  firebaseSignIn,
  firebaseSignUp,
  firebaseSignOut,
  firebaseProviderSignIn,
  loadCollection
} from '../firebase'

// --- Database ---
import { cardsDatabase, fetchCards } from '../database'

// --- Helpers ---
import _get from 'lodash/get'
import _map from 'lodash/map'
import _find from 'lodash/find'
import { log } from '../utils'

// --- Classes ---
import { Card } from '../classes'

export const actions = {
  // settings
  toggleSetting: (property, value) => ({ type: 'TOGGLE_SETTING', property, value }),
  loadInitialSettings: settings => ({ type: 'LOAD_INITIAL_SETTINGS', settings }),
  restoreDefaultSettings: () => ({ type: 'RESTORE_DEFAULT_SETTINGS' }),
  // modal
  openModal: (name, props) => ({ type: 'OPEN_MODAL', name, props }),
  closeModal: () => ({ type: 'CLOSE_MODAL' }),
  // user
  signIn: ({ email, password }) => {
    return async (dispatch, getState) => {
      // Return if request is pending
      if (getState().user.authPending) return
      // Dispatch action so we can show spinner
      dispatch(actions.authRequest())
      // Sign the user in in Firebase
      const firebaseSignInResponse = await firebaseSignIn(email, password)
      // If we got error, display it
      if (firebaseSignInResponse.error) dispatch(actions.authError(firebaseSignInResponse.error))
    }
  },
  signUp: ({ email, password }) => {
    return async (dispatch, getState) => {
      // Return if request is pending
      if (getState().user.authPending) return
      // Dispatch action so we can show spinner
      dispatch(actions.authRequest())
      // Sign the user up in Firebase
      const firebaseSignUpResponse = await firebaseSignUp(email, password)
      // If we got error, display it
      if (firebaseSignUpResponse.error) dispatch(actions.authError(firebaseSignUpResponse.error))
    }
  },
  signOut: () => {
    return async (dispatch, getState) => {
      // Return if request is pending
      if (getState().user.authPending) return
      // Dispatch action so we can show spinner
      dispatch(actions.authRequest())
      // Sign user out of Firebase
      const firebaseSignOutResponse = await firebaseSignOut()
      // Display errors if we get any
      if (firebaseSignOutResponse.error) {
        dispatch(
          actions.openModal('error', {
            message: `There was a problem with signing out. This is what we know: ${firebaseSignOutResponse.error}`
          })
        )
      } else {
        dispatch(actions.signOutSuccess())
      }
    }
  },
  signInWithProvider: providerName => {
    return async (dispatch, getState) => {
      // Return if request is pending
      if (getState().user.authPending) return
      // Dispatch action so we can show spinner
      dispatch(actions.authRequest())
      // Sign in via provider
      const firebaseSignInResponse = await firebaseProviderSignIn(providerName)
      // Display errors if we get any
      if (firebaseSignInResponse.error) dispatch(actions.authError(firebaseSignInResponse.error))
    }
  },
  authRequest: () => ({ type: 'AUTH_REQUEST' }),
  authSuccess: user => ({ type: 'AUTH_SUCCESS', user }),
  authError: error => ({ type: 'AUTH_ERROR', error }),
  signOutSuccess: () => ({ type: 'SIGN_OUT_SUCCESS' }),
  clearAuthErrors: () => ({ type: 'CLEAR_AUTH_ERROR' }),
  noUser: () => ({ type: 'NO_USER' }),
  addAuthListener: () => {
    return async (dispatch, getState) => {
      // When user's authentication status changes...
      auth.onAuthStateChanged(async firebaseUser => {
        log('Authentication state has changed')

        const modalName = getState().modal.name
        const authModalOpened = modalName === 'sign in' || modalName === 'sign up'

        // Show loading message
        dispatch(actions.authRequest())

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
              dispatch(actions.loadInitialSettings(usersDataFromDatabase.data.settings))
          }

          // Load user's collection
          dispatch(actions.loadMyCards())
          // Save user's data in Firebase and in store
          dispatch(actions.authSuccess(userData))
          // Close any sign in or sign up modals
          if (authModalOpened) dispatch(actions.closeModal())
          // If user's not logged in or logged out...
        } else {
          dispatch(actions.noUser())
          // Log that into console
          log('No user')
        }
      })
    }
  },
  // allCards
  sendRequest: () => ({ type: 'ALL_CARDS_REQUEST' }), // Indicates that there is "allCards" request pending
  responseSuccess: allSets => ({ type: 'ALL_CARDS_SUCCESS', allSets }),
  responseError: error => ({ type: 'ALL_CARDS_ERROR', error }),
  getCards: () => { // Fetches all cards and passes them further
    return (dispatch, getState) => {
      // Dispatch action so we can show spinner
      dispatch(actions.sendRequest())
      // Send API request
      fetchCards()
        .then(response => dispatch(actions.responseSuccess(response)))
        .catch(error => {
          dispatch(actions.responseError(error))
          dispatch(
            actions.openModal('error', {
              message: typeof error === 'string' ? error : error.message
            })
          )
        })
    }
  },
  filterAllCards: filterFunction => ({ type: 'FILTER_ALL_CARDS', filterFunction }),
  // myCards
  loadMyCards: () => async (dispatch, getState) => {
    if (!cardsDatabase.length) return

    dispatch(actions.loadMyCardsRequest())

    let retrievedCollection = []

    await loadCollection().then(response => {
      if (response.success) {
        const collection = response.data

        retrievedCollection = _map(collection, (value, key) => {
          const mainCard = new Card(_find(cardsDatabase, { name: key }))
          mainCard.cardsInCollection = value.cardsInCollection
          mainCard.variants = _map(value.variants, (value, key) => {
            const variant = new Card(_find(mainCard.variants, { id: key }))
            variant.cardsInCollection = value.cardsInCollection
            return variant
          })
          return mainCard
        })
      }
    })

    dispatch(actions.loadMyCardsSuccess(retrievedCollection))
  },
  loadMyCardsRequest: () => ({ type: 'LOAD_MY_CARDS_REQUEST' }),
  loadMyCardsSuccess: cards => ({ type: 'LOAD_MY_CARDS_SUCCESS', cards }),
  addCard: (card, variant) => ({ type: 'ADD_CARD', card, variant }),
  removeCard: (card, variant) => ({ type: 'REMOVE_CARD', card, variant }),
  clearMyCards: () => ({ type: 'CLEAR_MY_CARDS' }),
  filterMyCards: filterFunction => ({ type: 'FILTER_MY_CARDS', filterFunction }),
  noCards: () => ({ type: 'NO_CARDS' }),
  // keyboard
  setMainCardFocus: index => ({ type: 'SET_MAIN_CARD_FOCUS', index }),
  resetMainCardFocus: () => ({ type: 'RESET_MAIN_CARD_FOCUS' }),
  setVariantCardFocus: index => ({ type: 'SET_VARIANT_CARD_FOCUS', index }),
  resetVariantCardFocus: () => ({ type: 'RESET_VARIANT_CARD_FOCUS' })
}

export const dispatch = Object.keys(actions).reduce((all, action) => {
  all[action] = (...payload) => store.dispatch(actions[action](...payload))
  return all
}, {})
