import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'

const initialState = {
  user: null,
  session: {
    loggedIn: false
  },
  requests: {
    loggingIn: false,
    loggingOut: false,
    updatingUser: false
  },
  counter: 0,
  errors: [],
  appReady: false
}

const reducers = {
  user: {
    LOGIN: (state, action) => ({
      uid: action.user.uid,
      displayName: action.user.displayName,
      email: action.user.email,
      photoURL: action.user.photoURL
    }),
    UPDATE_USER: (state, action) => ({ ...state, ...action.data })
  },
  session: {
    LOGIN: (state, action) => ({ ...state, loggedIn: true }),
    LOGOUT: (state, action) => ({ ...state, loggedIn: false })
  },
  requests: {
    START: (state, action) => ({ ...state, [action.name]: true }),
    STOP: (state, action) => ({ ...state, [action.name]: false }),
    LOGIN: (state, action) => ({ ...state, loggingIn: false }),
    LOGOUT: (state, action) => ({ ...state, loggingOut: false }),
    UPDATE_USER: (state, action) => ({ ...state, updatingUser: false })
  },
  counter: {
    INCREMENT: state => state + 1,
    DOUBLE_ASYNC: (state, action) => action.value * 2
  },
  errors: {
    SHOW_ERROR: (state, action) => [
      ...state.filter(error => error.id !== action.error.id),
      action.error
    ],
    HIDE_ERROR: (state, action) => state.filter(error => error.id !== action.id)
  },
  appReady: {
    SET_APP_READY: () => true,
    LOGOUT: () => true
  }
}

const createReducer = (name, initialState) => (state = initialState, action) => {
  if (action.type === 'LOGOUT' && name !== 'appReady') return initialState

  return reducers[name][action.type] ? reducers[name][action.type](state, action) : state
}

const uncombinedReducers = {
  ...Object.keys(reducers).reduce((all, name) => {
    all[name] = createReducer(name, initialState[name])
    return all
  }, {}),
  router: routerReducer
}

export default combineReducers(uncombinedReducers)
