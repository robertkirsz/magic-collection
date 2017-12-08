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

const mapStateToProps = ({ allCards, myCards, user }) => ({
  allCardsFetching: allCards.fetching,
  myCardsLoading: myCards.loading,
  userAuthPending: user.authPending
})

class App extends Component {
  static propTypes = {
    location: PropTypes.object.isRequired,
    allCardsFetching: PropTypes.bool.isRequired,
    myCardsLoading: PropTypes.bool.isRequired,
    userAuthPending: PropTypes.bool.isRequired
  }

  componentDidMount () {
    dispatch.getCards()
    dispatch.addAuthListener()
  }

  componentWillReceiveProps ({ allCardsFetching, myCardsLoading, userAuthPending }) {
    if (debug) log(`All cards: ${allCardsFetching}, My cards: ${myCardsLoading}, Auth: ${userAuthPending}`)
  }

  render () {
    const { allCardsFetching, myCardsLoading, userAuthPending, location } = this.props
    const { onCardsPage, onListPage, onDetailsPage } = getLocation(location)
    const fetchingData = allCardsFetching || myCardsLoading || userAuthPending

    return (
      <StyledApp>
        <Header />
        <Routes />
        {onCardsPage &&
          fetchingData && (
            <AppButtons>
              <SearchModule pathname={location.pathname} />
            </AppButtons>
          )}
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
