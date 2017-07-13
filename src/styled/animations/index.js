import { keyframes } from 'styled-components'

export const spinAnimation = degree => keyframes`
  0% { transform: rotate(${degree}deg); }
  100% { transform: rotate(${360 + degree}deg); }
`
