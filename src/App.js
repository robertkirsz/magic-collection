import React, { Component } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
// --- Helpers ---
import { connect } from 'react-redux'
import { log, debug, getLocation } from './utils'
// --- Actions ---
import { dispatch } from './redux'
// --- Components ---
import { Header, SearchModule, KeyboardHandler } from './components'
import ModalsHandler from './modals'
import Routes from './routes'

const mapStateToProps = ({ modal, allCards, myCards, user }) => ({
  allCardsFetching: allCards.fetching,
  myCardsLoading: myCards.loading,
  userAuthPending: user.authPending,
  modalName: modal.name
})

class App extends Component {
  static propTypes = {
    location: PropTypes.object.isRequired
  }

  state = { fetchingData: false }

  componentWillMount () {
    this.setState({ fetchingData: true })
    dispatch.getCards()
    dispatch.addAuthListener()
  }

  componentWillReceiveProps ({ allCardsFetching, myCardsLoading, userAuthPending }) {
    if (debug && this.state.fetchingData) {
      log(`All cards: ${allCardsFetching}, My cards: ${myCardsLoading}, Auth: ${userAuthPending}`)
    }

    if (!allCardsFetching && !myCardsLoading && !userAuthPending && this.state.fetchingData) {
      this.setState({ fetchingData: false })
    }
  }

  render () {
    const { onCardsPage, onListPage, onDetailsPage } = getLocation(this.props.location)

    return (
      <StyledApp className="App">
        <Header />
        <Routes />
        {onCardsPage &&
          !this.state.fetchingData &&
          <AppButtons>
            <SearchModule pathname={this.props.location.pathname} />
          </AppButtons>}
        <ModalsHandler />
        <KeyboardHandler onCardsListPage={onListPage} onCardDetailsPage={onDetailsPage} />
      </StyledApp>
    )
  }
}

export default connect(mapStateToProps)(App)

const StyledApp = styled.main.attrs({
  className: 'App'
})`
  flex: 1;
  display: flex;
  flex-direction: column;
  padding-top: var(--navbarHeight);
`

const AppButtons = styled.div.attrs({
  className: 'AppButtons'
})`
  flex: none;
  display: flex;
  justify-content: space-around;
  align-content: flex-end;
  position: fixed;
  right: 0;
  bottom: 20px;
  left: 0;
  padding: 0 1rem;
  z-index: 15;
  pointer-events: none;
`
