import React from 'react'
import PropTypes from 'prop-types'
// --- Helpers ---
import { connect } from 'react-redux'
// --- Components ---
import { Link } from 'react-router-dom'
import { DropdownMenu } from '../styled'
// --- Actions ---
import { signOut } from '../store/user'
// --- Transitions ---
import { Fade } from '../transitions'

const mapStateToProps = () => ({})

const mapDispatchToProps = { signOut }

const propTypes = {
  show: PropTypes.bool.isRequired,
  onHide: PropTypes.func.isRequired,
  signOut: PropTypes.func.isRequired
}

const UserDropdownMenu = props =>
  <Fade in={props.show}>
    <DropdownMenu vertical space="0" onClick={props.onHide}>
      <Link to="/collection-stats">Collection Stats</Link>
      <Link to="/settings">Settings</Link>
      <a onClick={props.signOut}>Sign out</a>
    </DropdownMenu>
  </Fade>

UserDropdownMenu.propTypes = propTypes

export default connect(mapStateToProps, mapDispatchToProps)(UserDropdownMenu)
