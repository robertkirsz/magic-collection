import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import styled from 'styled-components'
import cn from 'classnames'
// --- Actions ---
import { toggleSetting } from '../store/settings'
// --- Components ---

const mapStateToProps = ({ settings }) => ({ myCardsLocked: settings.myCardsLocked })

const mapDispatchToProps = { toggleSetting }

const propTypes = {
  myCardsLocked: PropTypes.bool.isRequired,
  toggleSetting: PropTypes.func.isRequired
}

const LockButton = ({ myCardsLocked, toggleSetting }) =>
  <StyledLockButton
    type="button"
    onClick={() => {
      toggleSetting('myCardsLocked')
    }}
  >
    <i className={cn('fa', { 'fa-lock': myCardsLocked, 'fa-unlock-alt': !myCardsLocked })} />
  </StyledLockButton>

LockButton.propTypes = propTypes

export default connect(mapStateToProps, mapDispatchToProps)(LockButton)

const StyledLockButton = styled.button`
  border: none;
  background: none;
  font-size: 1.4em;
`
