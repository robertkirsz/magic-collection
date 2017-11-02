import { createStore, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'

import reducers from './reducers'

const enhancers = (window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose)(
  applyMiddleware(thunk)
)

const store = createStore(reducers, {}, enhancers)

export default store
