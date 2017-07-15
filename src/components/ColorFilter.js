import React from 'react'
import PropTypes from 'prop-types'
// --- Helpers ---
import cn from 'classnames'

const ColorCheckbox = props =>
  <span
    className={cn('icon', 'ms', 'ms-cost', `ms-${props.symbol}`, { unchecked: !props.checked })}
    onClick={props.changeColor(props.color, !props.checked)}
  />

ColorCheckbox.propTypes = {
  color: PropTypes.string.isRequired,
  symbol: PropTypes.string.isRequired,
  checked: PropTypes.bool.isRequired,
  changeColor: PropTypes.func.isRequired
}

const ColorFilter = ({ colors, onColorChange }) =>
  <div className="color-filter">
    <ColorCheckbox color="White" symbol="w" checked={colors.White} changeColor={onColorChange} />
    <ColorCheckbox color="Blue" symbol="u" checked={colors.Blue} changeColor={onColorChange} />
    <ColorCheckbox color="Black" symbol="b" checked={colors.Black} changeColor={onColorChange} />
    <ColorCheckbox color="Red" symbol="r" checked={colors.Red} changeColor={onColorChange} />
    <ColorCheckbox color="Green" symbol="g" checked={colors.Green} changeColor={onColorChange} />
    <ColorCheckbox color="Colorless" symbol="c" checked={colors.Colorless} changeColor={onColorChange} />
  </div>

ColorFilter.propTypes = {
  colors: PropTypes.object.isRequired,
  onColorChange: PropTypes.func.isRequired
}

export default ColorFilter
