import { createStore, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'
import { routerMiddleware } from 'react-router-redux'
import createHistory from 'history/createBrowserHistory'

import reducers from './reducers'

export const history = createHistory()

const enhancers = (window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose)(
  applyMiddleware(thunk, routerMiddleware(history))
)

const store = createStore(reducers, {}, enhancers)

export default store
