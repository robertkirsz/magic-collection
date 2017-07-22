import React, { Component } from 'react'
import PropTypes from 'prop-types'
// --- Helpers ---
import { connect } from 'react-redux'
import styled from 'styled-components'
import _reduce from 'lodash/reduce'
// --- Actions ---
import { openModal } from '../store/layout'
// --- Components ---
import { NavLink, Link } from 'react-router-dom'
import { List, Container } from '../styled'
import { UserBadge, LockButton, UserDropdownMenu } from './'
import { Fade } from '../transitions'

const mapStateToProps = ({ user, location, myCards }) => ({
  loading: user.authPending,
  userSignedIn: user.signedIn,
  numberOfTotalCards: _reduce(myCards.cards, (sum, card) => sum + card.cardsInCollection, 0),
  numberOfUniqueCards: myCards.cards.length
})

const mapDispatchToProps = { openModal }

const propTypes = {
  loading: PropTypes.bool.isRequired,
  userSignedIn: PropTypes.bool.isRequired,
  openModal: PropTypes.func.isRequired,
  numberOfTotalCards: PropTypes.number,
  numberOfUniqueCards: PropTypes.number
}

class Header extends Component {
  state = { showDropdown: false }

  showDropdown = () => {
    this.setState({ showDropdown: true })
  }

  hideDropdown = () => {
    this.setState({ showDropdown: false })
  }

  openModal = modalName => e => {
    this.props.openModal(modalName)
  }

  render = () =>
    <StyledHeader>
      <Container flex alignItems="center">
        <Link to="/">Magic Collection</Link>

        <Fade in={this.props.userSignedIn}>
          <List space="24px" margin="0 auto">
            <LockButton />
            <NavLink to="/all-cards">All cards</NavLink>
            <NavLink to="/my-cards">
              My cards {this.props.numberOfTotalCards} ({this.props.numberOfUniqueCards})
            </NavLink>
          </List>
        </Fade>

        {!this.props.loading &&
          !this.props.userSignedIn &&
          <List right space="24px" margin="0 0 0 auto">
            <a onClick={this.openModal('sign in')}>Sign In</a>
            <a onClick={this.openModal('sign up')}>Sign Up</a>
          </List>}

        {(this.props.loading || this.props.userSignedIn) &&
          <UserBadge style={{ margin: '0 0 0 auto' }} onClick={!this.state.showDropdown ? this.showDropdown : null} />}

        <Fade in={this.props.userSignedIn && this.state.showDropdown}>
          <UserDropdownMenu onHide={this.hideDropdown} />
        </Fade>
      </Container>
    </StyledHeader>
}

Header.propTypes = propTypes

export default connect(mapStateToProps, mapDispatchToProps)(Header)

const StyledHeader = styled.nav`
  display: flex;
  justify-content: center;
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  height: var(--navbarHeight);
  background: white;
  box-shadow: var(--shadow);
  z-index: 10;
  pointer-events: auto;

  a {
    color: inherit;
    text-decoration: none;
  }
`
