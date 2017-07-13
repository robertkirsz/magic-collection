import { createStore, applyMiddleware, compose, combineReducers } from 'redux'
import thunk from 'redux-thunk'
// --- Reducers ---
import user     from './user'
import allCards from './allCards'
import myCards  from './myCards'
import layout   from './layout'
import settings from './settings'
import keyboard from './keyboard'

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

// Store
export default (initialState = {}) =>
  createStore(
    combineReducers({ user, allCards, myCards, layout, settings, keyboard }),
    initialState,
    composeEnhancers(applyMiddleware(thunk))
  )
