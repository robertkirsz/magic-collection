import React from 'react'
import PropTypes from 'proptypes'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import { UserBadge, LockButton } from 'components'
import { signOut } from 'store/user'
import { openModal } from 'store/layout'
import _reduce from 'lodash/reduce'

const mapStateToProps = ({ user, location, myCards }) => ({
  user,
  pathname: location.pathname,
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
      <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1" aria-expanded="false">
        <span className="sr-only">Toggle navigation</span>
        <span className="icon-bar" />
        <span className="icon-bar" />
        <span className="icon-bar" />
      </button>
      <span className="navbar-brand">Magic Cards Manager</span>
    </div>
  )

  const navigationLinks = (
    <ul className="route-navigation nav navbar-nav">
      <li>
        <Link to="/all-cards" className={pathname === '/all-cards' ? 'active' : ''}>
          All cards
        </Link>
      </li>
      <li>
        <Link to="/my-cards" className={pathname === '/my-cards' ? 'active' : ''}>
          My cards {numberOfTotalCards} ({numberOfUniqueCards})
        </Link>
      </li>
    </ul>
  )

  const authenticationLinks = (
    <ul className="nav navbar-nav nav-pills navbar-right">
      <li role="presentation">
        <a onClick={() => openModal('sign in')}>
          Sign In
        </a>
      </li>
      <li role="presentation">
        <a onClick={() => openModal('sign up')}>
          Sign Up
        </a>
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
          {/* <li><Link to="profile">Profile</Link></li> */}
          <li><Link to="collection-stats">Collection Stats</Link></li>
          <li><Link to="settings">Settings</Link></li>
          <li role="separator" className="divider" />
          <li><a onClick={signOut}>Sign out</a></li>
        </ul>
      </li>
    </ul>
  )

  return (
    <nav id="MainHeader" className="navbar navbar-default navbar-fixed-top">
      <div className="container-fluid">
        {brandAndToggle}
        {!user.authPending && <div className="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
          {signedIn && <LockButton />}
          {signedIn && navigationLinks}
          {signedIn ? userDropdown : authenticationLinks}
        </div>}
      </div>
    </nav>
  )
}

Header.propTypes = propTypes

export default connect(mapStateToProps, mapDispatchToProps)(Header)
