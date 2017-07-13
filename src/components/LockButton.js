import React from 'react'
import PropTypes from 'proptypes'
import { connect } from 'react-redux'
import { toggleSetting } from 'store/settings'
import cn from 'classnames'
import { LockButton as StyledLockButton } from 'styled'

const mapStateToProps = ({ settings }) => ({ myCardsLocked: settings.myCardsLocked })

const mapDispatchToProps = { toggleSetting }

const propTypes = {
  myCardsLocked: PropTypes.bool,
  toggleSetting: PropTypes.func
}

const LockButton = ({ myCardsLocked, toggleSetting }) => (
  <StyledLockButton
    type="button"
    className="navbar-btn"
    onClick={() => { toggleSetting('myCardsLocked') }}
  >
    <i className={cn('fa', { 'fa-lock': myCardsLocked, 'fa-unlock-alt': !myCardsLocked })} />
  </StyledLockButton>
)

LockButton.propTypes = propTypes

export default connect(mapStateToProps, mapDispatchToProps)(LockButton)
