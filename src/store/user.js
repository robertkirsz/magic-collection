// TODO: redirect user on logout

import { updateUserData } from '../firebase'

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
    // TODO: deal with admins - I don't know if I need that option now
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
