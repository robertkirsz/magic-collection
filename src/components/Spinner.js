import React from 'react'
import styled from 'styled-components'
import { AbsoluteFullSize } from 'styled'
import { spinAnimation } from 'styled/animations'

const SpinnerContainer = styled.div`
  position: relative;
  width: 100px;
  height: 100px;
  margin: 100px auto;
  animation: ${spinAnimation(0)} 2s linear infinite;
`

const SpinnerLayer = styled(AbsoluteFullSize)`
  transform: rotate(${props => props.rotation}deg);
`

const SpinnerDot = styled.span`
  position: relative;
  display: block;
  width: 20px;
  height: 20px;
  margin: 0 auto;
  border-radius: 50%;
  background: ${props => props.color};
  transform: rotate(${props => -props.rotation}deg);
  animation: ${props => spinAnimation(-props.rotation)} 2s linear infinite reverse;

  &::after {
    content: "";
    display: block;
    position: absolute;
    top: 3px;
    right: 2px;
    width: 8px;
    height: 8px;
    background: radial-gradient(circle at center, white 0%, transparent 100%);
    border-radius: 50%;
  }
`

const spinnerDots = [
  { color: '#f0f2c0', rotation: 0 },
  { color: '#b5cde3', rotation: 75 },
  { color: '#aca29a', rotation: 145 },
  { color: '#db8664', rotation: 215 },
  { color: '#93b483', rotation: 285 }
]

const Spinner = () => (
  <SpinnerContainer>
    {
      spinnerDots.map(({ color, rotation }) => (
        <SpinnerLayer key={color} rotation={rotation}>
          <SpinnerDot color={color} rotation={rotation} />
        </SpinnerLayer>
      ))
    }
  </SpinnerContainer>
)

export default Spinner
