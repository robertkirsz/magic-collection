import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
// --- Components ---
import { Spinner } from './'
import { Fade } from '../transitions'

const propTypes = {
  show: PropTypes.bool.isRequired
}

const LoadingScreen = props =>
  <Fade in={props.show}>
    <StyledLoadingScreen>
      <Spinner />
    </StyledLoadingScreen>
  </Fade>

LoadingScreen.propTypes = propTypes

export default LoadingScreen

const StyledLoadingScreen = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  width: 100vw;
  height: 100vh;
  background: white;
  z-index: 9999;
`
