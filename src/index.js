import React from 'react'
import ReactDOM from 'react-dom'
// --- Store ---
import { store } from './redux'
// --- Service worker ---
import registerServiceWorker from './registerServiceWorker'
// --- Components ---
import { Provider as StoreProvider } from 'react-redux'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import App from './App'
// --- Styles ---
import './styles/variables.css'
import './styles/animations.css'
import './styles/index.css'

// if (process.env.NODE_ENV !== 'production') {
//   const { whyDidYouUpdate } = require('why-did-you-update')
//   let createClass = React.createClass
//   Object.defineProperty(React, 'createClass', {
//     set: nextCreateClass => {
//       createClass = nextCreateClass
//     }
//   })
//   whyDidYouUpdate(React)
// }

ReactDOM.render(
  <StoreProvider store={store}>
    <Router>
      <Route path="/" component={App} />
    </Router>
  </StoreProvider>,
  document.getElementById('root')
)

registerServiceWorker()
