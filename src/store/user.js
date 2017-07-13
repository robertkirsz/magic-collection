import { browserHistory } from 'react-router'
import { firebaseSignIn, firebaseSignUp, firebaseSignOut, firebaseProviderSignIn, updateUserData } from 'utils/firebase'
import { openModal } from 'store/layout'

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
    if (firebaseSignOutResponse.error) dispatch(openModal('error', { message: `There was a problem with signing out. This is what we know: ${firebaseSignOutResponse.error}` }))
    else dispatch(signOutSuccess())
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
export const signOutSuccess = () => {
  browserHistory.push('/all-cards')
  return { type: 'SIGN_OUT_SUCCESS' }
}
export const clearAuthErrors = () => ({ type: 'CLEAR_AUTH_ERROR' })
export const noUser = () => ({ type: 'NO_USER' })

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

export default function userReducer (state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]

  return handler ? handler(state, action) : state
}
