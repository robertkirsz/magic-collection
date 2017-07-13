import React from 'react'
import PropTypes from 'proptypes'

const MonoMultiToggle = ({
  monocoloredOnly, multicoloredOnly, handleChangeMonocolored, handleChangeMulticolored
}) => (
  <div className="mono-multi-checkboxes">
    <label>
      <input
        type="checkbox"
        name="monocolored"
        checked={monocoloredOnly}
        onChange={handleChangeMonocolored}
      />
        Monocolored only
    </label>
    <label>
      <input
        type="checkbox"
        name="multicolored"
        checked={multicoloredOnly}
        onChange={handleChangeMulticolored}
      />
        Multicolored only
    </label>
  </div>
)

MonoMultiToggle.propTypes = {
  monocoloredOnly: PropTypes.bool,
  multicoloredOnly: PropTypes.bool,
  handleChangeMonocolored: PropTypes.func,
  handleChangeMulticolored: PropTypes.func
}

export default MonoMultiToggle
