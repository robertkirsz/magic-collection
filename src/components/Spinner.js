import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
// --- Components ---
import { AbsoluteFullSize } from '../styled'
// --- Animations ---
import { spinAnimation } from '../styled/animations'

const spinnerDots = [
  { color: '#F0F2C0', rotation: 0 },
  { color: '#B5CDE3', rotation: 75 },
  { color: '#ACA29A', rotation: 145 },
  { color: '#DB8664', rotation: 215 },
  { color: '#93B483', rotation: 285 }
]

const propTypes = {
  size: PropTypes.string
}

const Spinner = props =>
  <SpinnerContainer size={props.size}>
    {spinnerDots.map(({ color, rotation }) =>
      <SpinnerLayer key={color} rotation={rotation}>
        <SpinnerDot color={color} rotation={rotation} size={props.size} />
      </SpinnerLayer>
    )}
  </SpinnerContainer>

Spinner.propTypes = propTypes

export default Spinner

const SpinnerContainer = styled.div`
  position: relative;
  width: ${props => props.size};
  height: ${props => props.size};
  animation: ${spinAnimation(0)} 2s linear infinite;
`

SpinnerContainer.defaultProps = {
  size: '100px'
}

const SpinnerLayer = styled(AbsoluteFullSize)`
  transform: rotate(${props => props.rotation}deg);
`

const SpinnerDot = styled.span`
  position: relative;
  display: block;
  width: calc(${props => props.size} / 5);
  height: calc(${props => props.size} / 5);
  margin: 0 auto;
  border-radius: 50%;
  background: ${props => props.color};
  transform: rotate(${props => -props.rotation}deg);
  animation: ${props => spinAnimation(-props.rotation)} 2s linear infinite reverse;
  &::after {
    content: "";
    display: block;
    position: absolute;
    top: 15%;
    right: 10%;
    width: 40%;
    height: 40%;
    background: radial-gradient(circle at center, white 0%, transparent 100%);
    border-radius: 50%;
  }
`

SpinnerDot.defaultProps = {
  size: '100px'
}
