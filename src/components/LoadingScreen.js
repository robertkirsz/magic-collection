import React from 'react'
import CSSTransition from 'react-transition-group/CSSTransition'
// --- Components ---
import { Spinner } from './'
import { AbsoluteCenter } from '../styled'

const LoadingScreen = props =>
  <CSSTransition {...props} unmountOnExit timeout={300} classNames="fade">
    <AbsoluteCenter background="white">
      <Spinner />
    </AbsoluteCenter>
  </CSSTransition>

export default LoadingScreen
