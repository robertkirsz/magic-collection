import React, { Component } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
// --- Helpers ---
import { connect } from 'react-redux'
import { log, debug, getLocation } from './utils'
// --- Actions ---
import { getCards } from './store/allCards'
import { addAuthListener } from './store/user'
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
      <StyledApp>
        <Header />
        <Routes />
        {onCardsPage && !this.state.fetchingData &&
          <AppButtons>
            <SearchModule pathname={this.props.location.pathname} />
          </AppButtons>}
        <ModalsHandler />
        <KeyboardHandler onCardsListPage={onListPage} onCardDetailsPage={onDetailsPage} />
      </StyledApp>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App)

const StyledApp = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  padding-top: var(--navbarHeight);
`

const AppButtons = styled.div`
  flex: none;
  display: flex;
  justify-content: space-around;
  align-content: flex-end;
  position: fixed;
  right: 0; bottom: 20px; left: 0;
  z-index: 5;
  pointer-events: none;
`
