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
      <Container>
        <Header />
        <Routes />
        {onCardsPage && !this.state.fetchingData &&
          <AppButtons>
            <SearchModule pathname={this.props.location.pathname} />
          </AppButtons>}
        <AuthModal />
        <ErrorModal />
        <KeyboardHandler onCardsListPage={onListPage} onCardDetailsPage={onDetailsPage} />
      </Container>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App)

const Container = styled.div`
  display: flex;
  flex-direction: column;
  padding: var(--navbarHeight) var(--horizontalPadding) 0;
`

const AppButtons = styled.div`
  display: flex;
  justify-content: space-around;
  align-content: flex-end;
  flex: none;
  position: fixed;
  right: 0;
  bottom: 20px;
  left: 0;
  z-index: 5;
  pointer-events: none;
`
