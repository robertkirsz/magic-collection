import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Route } from 'react-router-dom'
// import _find from 'lodash/find'
import { log, debug, getLocation } from './utils'
// --- Actions ---
import { getCards } from './store/allCards'
import { listenToAuthChange } from './store/user'
// --- Components ---
import { AuthModal, ErrorModal } from './containers'
import { Header, SearchModule, KeyboardHandler } from './components'
import { HomeView, AllCardsView, MyCardsView, CardView, SettingsView, CollectionStatsView } from './routes'

const mapStateToProps = ({ layout, allCards, myCards, user }) => ({
  allCardsFetching: allCards.fetching,
  myCardsLoading: myCards.loading,
  userAuthPending: user.authPending,
  modalName: layout.modal.name
})

const mapDispatchToProps = {
  getCards,
  listenToAuthChange
}

// TODO: redirect user on logout

class App extends Component {
  static propTypes = {
    location: PropTypes.object.isRequired,
    getCards: PropTypes.func.isRequired,
    listenToAuthChange: PropTypes.func.isRequired
  }

  state = { fetchingData: false }

  componentWillMount () {
    this.setState({ fetchingData: true })
    this.props.getCards()
    this.props.listenToAuthChange()
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
        <Route exact path="/" component={HomeView} />
        <Route path="/all-cards" component={AllCardsView} />
        <Route path="/all-cards/:cardUrl" component={CardView} />
        <Route path="/my-cards" component={MyCardsView} />
        <Route path="/my-cards/:cardUrl" component={CardView} />
        <Route path="/settings" component={SettingsView} />
        <Route path="/collection-stats" component={CollectionStatsView} />
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
