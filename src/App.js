import React, { Component } from 'react'
import PropTypes from 'prop-types'
// --- Helpers ---
import { connect } from 'react-redux'
import { log, debug, getLocation } from './utils'
// --- Actions ---
import { getCards } from './store/allCards'
import { addAuthListener } from './store/user'
// --- Components ---
import { Header, SearchModule, KeyboardHandler, AuthModal, ErrorModal } from './components'
import Routes from './routes'

const mapStateToProps = ({ layout, allCards, myCards, user }) => ({
  allCardsFetching: allCards.fetching,
  myCardsLoading: myCards.loading,
  userAuthPending: user.authPending,
  modalName: layout.modal.name
})

const mapDispatchToProps = { getCards, addAuthListener }

class App extends Component {
  static propTypes = {
    location: PropTypes.object.isRequired,
    getCards: PropTypes.func.isRequired,
    addAuthListener: PropTypes.func.isRequired
  }

  state = { fetchingData: false }

  componentWillMount () {
    this.setState({ fetchingData: true })
    this.props.getCards()
    this.props.addAuthListener()
  }

  componentWillReceiveProps ({ allCardsFetching, myCardsLoading, userAuthPending }) {
    if (debug && this.state.fetchingData) {
      log(`allCardsFetching: ${allCardsFetching} myCardsLoading: ${myCardsLoading} userAuthPending ${userAuthPending}`)
    }

    if (!allCardsFetching && !myCardsLoading && !userAuthPending && this.state.fetchingData) {
      this.setState({ fetchingData: false })
    }
  }

  render () {
    const { onCardsPage, onListPage, onDetailsPage } = getLocation(this.props.location)

    return (
      <div className="App">
        <Header />
        <Routes />
        {onCardsPage &&
          !this.state.fetchingData &&
          <div className="app-buttons">
            <SearchModule pathname={this.props.location.pathname} />
          </div>}
        <AuthModal />
        <ErrorModal />
        <KeyboardHandler onCardsListPage={onListPage} onCardDetailsPage={onDetailsPage} />
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App)
