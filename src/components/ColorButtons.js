import React from 'react'
import PropTypes from 'proptypes'
import cn from 'classnames'
import _every from 'lodash/every'

const ColorButtons = ({ colors, toggleAll, toggleNone, monocoloredOnly, multicoloredOnly, handleChangeMonocolored, handleChangeMulticolored }) => (
  <div className="color-buttons btn-toolbar" role="toolbar">
    <div className="btn-group btn-group-sm" role="group">
      <button className={cn('btn btn-default', { active: _every(colors, c => c) })} onClick={toggleAll}>All</button>
      <button className={cn('btn btn-default', { active: _every(colors, c => !c) })} onClick={toggleNone}>None</button>
    </div>
    <div className="btn-group btn-group-sm" role="group">
      <button
        className={cn('btn btn-default', { active: monocoloredOnly })}
        title="Only monocolored cards"
        onClick={handleChangeMonocolored}
      >
        Mono
      </button>
      <button
        className={cn('btn btn-default', { active: multicoloredOnly })}
        title="Only multicolored cards"
        onClick={handleChangeMulticolored}
      >
        Multi
      </button>
    </div>
  </div>
)

ColorButtons.propTypes = {
  colors: PropTypes.object,
  toggleAll: PropTypes.func,
  toggleNone: PropTypes.func,
  monocoloredOnly: PropTypes.bool,
  multicoloredOnly: PropTypes.bool,
  handleChangeMonocolored: PropTypes.func,
  handleChangeMulticolored: PropTypes.func
}

export default ColorButtons
