import React from 'react'
import { Spinner } from './'
import { AbsoluteCenter } from '../styled'

const LoadingScreen = () => (
  <AbsoluteCenter background="white">
    <Spinner />
  </AbsoluteCenter>
)

export default LoadingScreen
