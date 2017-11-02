import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import styled from 'styled-components'
import cn from 'classnames'
import { dispatch } from '../redux'

const mapStateToProps = ({ settings }) => ({ myCardsLocked: settings.myCardsLocked })

const propTypes = {
  myCardsLocked: PropTypes.bool.isRequired
}

const LockButton = ({ myCardsLocked }) =>
  <StyledLockButton
    type="button"
    onClick={() => dispatch.toggleSetting('myCardsLocked')}
  >
    <i className={cn('fa', { 'fa-lock': myCardsLocked, 'fa-unlock-alt': !myCardsLocked })} />
  </StyledLockButton>

LockButton.propTypes = propTypes

export default connect(mapStateToProps)(LockButton)

const StyledLockButton = styled.button`
  border: none;
  background: none;
  font-size: 1.4em;
`
