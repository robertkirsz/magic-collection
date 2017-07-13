import { createStore, applyMiddleware, compose, combineReducers } from 'redux'
import thunk from 'redux-thunk'
// --- Reducers ---
import allCards from './allCards'

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

// Store
export default (initialState = {}) =>
  createStore(
    combineReducers({ allCards }),
    initialState,
    composeEnhancers(applyMiddleware(thunk))
  )

// Actions
export { actions as allCardsActions } from './allCards'
