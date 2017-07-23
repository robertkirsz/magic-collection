import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
// --- Helpers ---
import cn from 'classnames'

const ColorCheckbox = props =>
  <StyledColorCheckbox
    className={cn('ms', 'ms-cost', `ms-${props.symbol}`, { unchecked: !props.checked })}
    onClick={props.changeColor(props.color, !props.checked)}
  />

ColorCheckbox.propTypes = {
  color: PropTypes.string.isRequired,
  symbol: PropTypes.string.isRequired,
  checked: PropTypes.bool.isRequired,
  changeColor: PropTypes.func.isRequired
}

const ColorFilter = ({ colors, onColorChange }) =>
  <StyledColorFilter>
    <ColorCheckbox color="White" symbol="w" checked={colors.White} changeColor={onColorChange} />
    <ColorCheckbox color="Blue" symbol="u" checked={colors.Blue} changeColor={onColorChange} />
    <ColorCheckbox color="Black" symbol="b" checked={colors.Black} changeColor={onColorChange} />
    <ColorCheckbox color="Red" symbol="r" checked={colors.Red} changeColor={onColorChange} />
    <ColorCheckbox color="Green" symbol="g" checked={colors.Green} changeColor={onColorChange} />
    <ColorCheckbox color="Colorless" symbol="c" checked={colors.Colorless} changeColor={onColorChange} />
  </StyledColorFilter>

ColorFilter.propTypes = {
  colors: PropTypes.object.isRequired,
  onColorChange: PropTypes.func.isRequired
}

export default ColorFilter

const StyledColorFilter = styled.div`
  grid-area: colors-area;
  display: flex;
  justify-content: space-between;
  align-self: center;
`

const StyledColorCheckbox = styled.span`
  font-size: 30px !important;
  cursor: pointer;
  transition: all var(--transitionTime);
  &.unchecked {
    background: transparent;
    opacity: 0.4;
  }
`
