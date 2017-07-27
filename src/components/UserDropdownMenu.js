import React from 'react'
import PropTypes from 'prop-types'
// --- Helpers ---
import { connect } from 'react-redux'
import styled from 'styled-components'
// --- Components ---
import { Link } from 'react-router-dom'
// --- Actions ---
import { signOut } from '../store/user'

const mapStateToProps = () => ({})

const mapDispatchToProps = { signOut }

const propTypes = {
  onHide: PropTypes.func.isRequired,
  signOut: PropTypes.func.isRequired
}

const UserDropdownMenu = props =>
  <StyledUserDropdownMenu onClick={props.onHide}>
    <Link to="/collection-stats">Collection Stats</Link>
    <Link to="/settings">Settings</Link>
    <a onClick={props.signOut}>Sign out</a>
  </StyledUserDropdownMenu>

UserDropdownMenu.propTypes = propTypes

export default connect(mapStateToProps, mapDispatchToProps)(UserDropdownMenu)

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
    &:not(:first-child) {
      margin-top: 16px;
    }
  }
`
