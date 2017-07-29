import React, { Component } from 'react'
import PropTypes from 'prop-types'
// --- Helpers ---
import { connect } from 'react-redux'
import styled from 'styled-components'
import _reduce from 'lodash/reduce'
// --- Actions ---
import { openModal } from '../store/modal'
// --- Components ---
import { NavLink, Link } from 'react-router-dom'
import { List, Container } from '../styled'
import { LockButton, UserMenu } from './'
import { Fade } from '../transitions'

const mapStateToProps = ({ user, location, myCards }) => ({
  loading: user.authPending,
  collectionLoaded: myCards.loaded,
  userSignedIn: user.signedIn,
  numberOfTotalCards: _reduce(myCards.cards, (sum, card) => sum + card.cardsInCollection, 0),
  numberOfUniqueCards: myCards.cards.length
})

const mapDispatchToProps = { openModal }

const propTypes = {
  loading: PropTypes.bool.isRequired,
  collectionLoaded: PropTypes.bool.isRequired,
  userSignedIn: PropTypes.bool.isRequired,
  openModal: PropTypes.func.isRequired,
  numberOfTotalCards: PropTypes.number,
  numberOfUniqueCards: PropTypes.number
}

class Header extends Component {
  openModal = modalName => e => {
    this.props.openModal(modalName)
  }

  render = () =>
    <StyledHeader>
      <Container flex justifyContent="space-between" alignItems="center">
        <Link to="/">Magic Collection</Link>

        <Fade in={this.props.collectionLoaded}>
          <List space="1.5vw">
            <NavLink to="/all-cards">All cards</NavLink>
            <NavLink to="/my-cards">
              My cards {this.props.numberOfTotalCards} ({this.props.numberOfUniqueCards})
            </NavLink>
            <LockButton />
          </List>
        </Fade>

        {!this.props.loading &&
          !this.props.userSignedIn &&
          <List right space="1.5vw">
            <a onClick={this.openModal('sign in')}>Sign In</a>
            <a onClick={this.openModal('sign up')}>Sign Up</a>
          </List>}

        {(this.props.loading || this.props.userSignedIn) &&
          <UserMenu userSignedIn={this.props.userSignedIn} />}
      </Container>
    </StyledHeader>
}

Header.propTypes = propTypes

export default connect(mapStateToProps, mapDispatchToProps)(Header)

const StyledHeader = styled.nav.attrs({
  className: 'Header'
})`
  display: flex;
  justify-content: center;
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  height: var(--navbarHeight);
  background: white;
  text-align: center;
  box-shadow: var(--shadow);
  z-index: 10;

  * {
    user-select: none;
  }

  @media (max-width: 400px) {
    font-size: 0.8em;
  }
`
