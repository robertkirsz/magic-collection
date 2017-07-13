import React from 'react'
import PropTypes from 'proptypes'
import cn from 'classnames'

const ColorCheckbox = ({ color, symbol, checked, changeColor }) => (
  <span
    className={cn('icon', 'ms', 'ms-cost', `ms-${symbol}`, { 'unchecked': !checked })}
    onClick={() => { changeColor(color, !checked) }}
  />
)

ColorCheckbox.propTypes = {
  color: PropTypes.string,
  symbol: PropTypes.string,
  checked: PropTypes.bool,
  changeColor: PropTypes.func
}

const ColorFilter = ({ colors, onColorChange }) => (
  <div className="color-filter">
    <ColorCheckbox color="White" symbol="w" checked={colors.White} changeColor={onColorChange} />
    <ColorCheckbox color="Blue" symbol="u" checked={colors.Blue} changeColor={onColorChange} />
    <ColorCheckbox color="Black" symbol="b" checked={colors.Black} changeColor={onColorChange} />
    <ColorCheckbox color="Red" symbol="r" checked={colors.Red} changeColor={onColorChange} />
    <ColorCheckbox color="Green" symbol="g" checked={colors.Green} changeColor={onColorChange} />
    <ColorCheckbox color="Colorless" symbol="c" checked={colors.Colorless} changeColor={onColorChange} />
  </div>
)

ColorFilter.propTypes = {
  colors: PropTypes.object,
  onColorChange: PropTypes.func
}

export default ColorFilter
