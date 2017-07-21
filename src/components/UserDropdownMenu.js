import React, { Component } from 'react'
import PropTypes from 'prop-types'
// --- Helpers ---
import { connect } from 'react-redux'
import onClickOutside from 'react-onclickoutside'
import styled from 'styled-components'
// --- Components ---
import { Link } from 'react-router-dom'
// --- Actions ---
import { signOut } from '../store/user'

const mapStateToProps = () => ({})

const mapDispatchToProps = { signOut }

class UserDropdownMenu extends Component {
  static propTypes = {
    onHide: PropTypes.func.isRequired,
    signOut: PropTypes.func.isRequired
  }

  handleClickOutside = () => { this.props.onHide() }

  render () {
    return (
      <StyledUserDropdownMenu onClick={this.props.onHide}>
        <Link to="/collection-stats">Collection Stats</Link>
        <Link to="/settings">Settings</Link>
        <a onClick={this.props.signOut}>Sign out</a>
      </StyledUserDropdownMenu>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(onClickOutside(UserDropdownMenu))

const StyledUserDropdownMenu = styled.div`
  display: flex;
  flex-direction: column;
  position: absolute;
  top: 100%;
  right: 0;
  padding: 16px;
  background: white;
  border-bottom-right-radius: 4px;
  border-bottom-left-radius: 4px;
  box-shadow: var(--shadow);
  z-index: 15;

  a {
    color: inherit;
    text-decoration: none;
    &:not(:first-child) { margin-top: 16px; }
  }
`
