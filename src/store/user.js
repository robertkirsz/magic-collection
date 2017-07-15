// TODO: redirect user on logout

// --- Firebase ---
import {
  auth,
  firebaseGetData,
  firebaseSignIn,
  firebaseSignUp,
  firebaseSignOut,
  firebaseProviderSignIn,
  updateUserData
} from '../firebase'
// --- Helpers ---
import _get from 'lodash/get'
import { log } from '../utils'
// --- Actions ---
import { openModal, closeModal } from './layout'
import { loadMyCards } from './myCards'
import { loadInitialSettings } from './settings'

// ------------------------------------
// Actions
// ------------------------------------
export const signIn = ({ email, password }) => {
  return async (dispatch, getState) => {
    // Return if request is pending
    if (getState().user.authPending) return
    // Dispatch action so we can show spinner
    dispatch(authRequest())
    // Sign the user in in Firebase
    const firebaseSignInResponse = await firebaseSignIn(email, password)
    // If we got error, display it
    if (firebaseSignInResponse.error) dispatch(authError(firebaseSignInResponse.error))
  }
}
export const signUp = ({ email, password }) => {
  return async (dispatch, getState) => {
    // Return if request is pending
    if (getState().user.authPending) return
    // Dispatch action so we can show spinner
    dispatch(authRequest())
    // Sign the user up in Firebase
    const firebaseSignUpResponse = await firebaseSignUp(email, password)
    // If we got error, display it
    if (firebaseSignUpResponse.error) dispatch(authError(firebaseSignUpResponse.error))
  }
}
export const signOut = () => {
  return async (dispatch, getState) => {
    // Return if request is pending
    if (getState().user.authPending) return
    // Dispatch action so we can show spinner
    dispatch(authRequest())
    // Sign user out of Firebase
    const firebaseSignOutResponse = await firebaseSignOut()
    // Display errors if we get any
    if (firebaseSignOutResponse.error) {
      dispatch(
        openModal('error', {
          message: `There was a problem with signing out. This is what we know: ${firebaseSignOutResponse.error}`
        })
      )
    } else {
      dispatch(signOutSuccess())
    }
  }
}
export const signInWithProvider = providerName => {
  return async (dispatch, getState) => {
    // Return if request is pending
    if (getState().user.authPending) return
    // Dispatch action so we can show spinner
    dispatch(authRequest())
    // Sign in via provider
    const firebaseSignInResponse = await firebaseProviderSignIn(providerName)
    // Display errors if we get any
    if (firebaseSignInResponse.error) dispatch(authError(firebaseSignInResponse.error))
  }
}
export const authRequest = () => ({ type: 'AUTH_REQUEST' })
export const authSuccess = user => ({ type: 'AUTH_SUCCESS', user })
export const authError = error => ({ type: 'AUTH_ERROR', error })
export const signOutSuccess = () => ({ type: 'SIGN_OUT_SUCCESS' })
export const clearAuthErrors = () => ({ type: 'CLEAR_AUTH_ERROR' })
export const noUser = () => ({ type: 'NO_USER' })
export const addAuthListener = () => {
  return async (dispatch, getState) => {
    const modalName = getState().layout.modal.name
    // When user's authentication status changes...
    auth.onAuthStateChanged(async firebaseUser => {
      log('Authentication state has changed')

      const authModalOpened = modalName === 'sign in' || modalName === 'sign up'

      // Show loading message
      dispatch(authRequest())

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
        log('No user')
      }
    })
  }
}

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  AUTH_REQUEST: state => ({ ...state, authPending: true, error: null }),
  AUTH_SUCCESS: (state, { user }) => {
    updateUserData(user)

    const newState = {
      ...state,
      ...user,
      authPending: false,
      signedIn: true
    }

    if (user.admin) newState.admin = true

    return newState
  },
  AUTH_ERROR: (state, { error }) => ({ ...state, authPending: false, error }),
  CLEAR_AUTH_ERROR: state => ({ ...state, error: null }),
  SIGN_OUT_SUCCESS: () => ({ ...initialState, authPending: false }),
  NO_USER: () => ({ ...initialState, authPending: false })
}

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {
  authPending: true,
  signedIn: false,
  error: null,
  name: '',
  email: '',
  picture: ''
}

export default (state = initialState, action) =>
  ACTION_HANDLERS[action.type] ? ACTION_HANDLERS[action.type](state, action) : state
