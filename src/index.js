import React from 'react'
import ReactDOM from 'react-dom'
// --- Store ---
import createStore from './store'
// --- Service worker ---
import registerServiceWorker from './registerServiceWorker'
// --- Components ---
import { Provider as StoreProvider } from 'react-redux'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import App from './App'
// --- Layout ---
import './styles/variables.css'
import './styles/atv.css'
import './styles/animations.css'
import './styles/index.css'

ReactDOM.render(
  <StoreProvider store={createStore()}>
    <Router>
      <Route path="/" component={App} />
    </Router>
  </StoreProvider>,
  document.getElementById('root')
)

registerServiceWorker()
