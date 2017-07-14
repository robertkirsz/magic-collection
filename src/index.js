import React from 'react'
import ReactDOM from 'react-dom'
import { Provider as StoreProvider } from 'react-redux'
// --- Store ---
import createStore from './store'
// --- Service worker ---
import registerServiceWorker from './registerServiceWorker'
// --- Components ---
import App from './App'
// --- Layout ---
import './styles/variables.css'
import './styles/atv.css'
import './styles/index.css'

ReactDOM.render(
  <StoreProvider store={createStore()}>
    <App />
  </StoreProvider>,
  document.getElementById('root')
)

registerServiceWorker()
