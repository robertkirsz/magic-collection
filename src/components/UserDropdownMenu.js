import React from 'react'
import PropTypes from 'prop-types'
// --- Components ---
import { Link } from 'react-router-dom'
import { DropdownMenu } from '../styled'

import { dispatch } from '../redux'
// --- Transitions ---
import { Fade } from '../transitions'

const propTypes = {
  show: PropTypes.bool.isRequired,
  onHide: PropTypes.func.isRequired
}

const UserDropdownMenu = props =>
  <Fade in={props.show}>
    <DropdownMenu vertical space="0" onClick={props.onHide}>
      <Link to="/collection-stats">Collection Stats</Link>
      <Link to="/settings">Settings</Link>
      <a onClick={dispatch.signOut}>Sign out</a>
    </DropdownMenu>
  </Fade>

UserDropdownMenu.propTypes = propTypes

export default UserDropdownMenu
