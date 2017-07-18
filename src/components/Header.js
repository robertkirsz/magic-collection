import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { NavLink, Link } from 'react-router-dom'
import styled from 'styled-components'
// --- Helpers ---
import _reduce from 'lodash/reduce'
// --- Actions ---
import { signOut } from '../store/user'
import { openModal } from '../store/layout'
// --- Components ---
import { UserBadge, LockButton } from './'

const mapStateToProps = ({ user, location, myCards }) => ({
  user,
  // TODO:
  // pathname: location.pathname,
  pathname: '/all-cards',

  numberOfTotalCards: _reduce(myCards.cards, (sum, card) => sum + card.cardsInCollection, 0),
  numberOfUniqueCards: myCards.cards.length
})

const mapDispatchToProps = { signOut, openModal }

const propTypes = {
  user: PropTypes.object.isRequired,
  pathname: PropTypes.string.isRequired,
  openModal: PropTypes.func.isRequired,
  signOut: PropTypes.func.isRequired,
  numberOfTotalCards: PropTypes.number,
  numberOfUniqueCards: PropTypes.number
}

const Header = ({ user, signOut, openModal, pathname, numberOfTotalCards, numberOfUniqueCards }) => {
  const { signedIn } = user

  // Brand and toggle get grouped for better mobile display
  const brandAndToggle = (
    <div className="navbar-header">
      <button
        type="button"
        className="navbar-toggle collapsed"
        data-toggle="collapse"
        data-target="#bs-example-navbar-collapse-1"
        aria-expanded="false"
      >
        <span className="sr-only">Toggle navigation</span>
        <span className="icon-bar" />
        <span className="icon-bar" />
        <span className="icon-bar" />
      </button>
      <Link to="/" className="navbar-brand">
        Magic Collection
      </Link>
    </div>
  )

  const navigationLinks = (
    <ul className="route-navigation nav navbar-nav">
      <li>
        <NavLink to="/all-cards">All cards</NavLink>
      </li>
      <li>
        <NavLink to="/my-cards">
          My cards {numberOfTotalCards} ({numberOfUniqueCards})
        </NavLink>
      </li>
    </ul>
  )

  const authenticationLinks = (
    <ul className="nav navbar-nav nav-pills navbar-right">
      <li role="presentation">
        <a onClick={() => openModal('sign in')}>Sign In</a>
      </li>
      <li role="presentation">
        <a onClick={() => openModal('sign up')}>Sign Up</a>
      </li>
    </ul>
  )

  // Collect the nav links, forms, and other content for toggling
  const userDropdown = (
    <ul className="nav navbar-nav navbar-right">
      <li className="dropdown">
        <a className="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">
          <UserBadge />
        </a>
        <ul className="dropdown-menu">
          <li>
            <Link to="/collection-stats">Collection Stats</Link>
          </li>
          <li>
            <Link to="/settings">Settings</Link>
          </li>
          <li role="separator" className="divider" />
          <li>
            <a onClick={signOut}>Sign out</a>
          </li>
        </ul>
      </li>
    </ul>
  )

  return (
    <Container className="navbar navbar-default navbar-fixed-top">
      <div className="container-fluid">
        {brandAndToggle}
        {!user.authPending &&
          <div className="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
            {signedIn && <LockButton />}
            {signedIn && navigationLinks}
            {signedIn ? userDropdown : authenticationLinks}
          </div>}
      </div>
    </Container>
  )
}

Header.propTypes = propTypes

export default connect(mapStateToProps, mapDispatchToProps)(Header)

const Container = styled.nav`
  pointer-events: auto;

  .route-navigation a.active { text-decoration: underline; }
  .dropdown-toggle {
    padding-top: 5px;
    padding-bottom: 5px;
  }
`
