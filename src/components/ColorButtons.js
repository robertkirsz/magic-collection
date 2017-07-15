// ------------------------------------------- //
// Buttons for filtering cards by color groups //
// ------------------------------------------- //

import React from 'react'
import PropTypes from 'prop-types'
// --- Helpers ---
import cn from 'classnames'
import _every from 'lodash/every'

const ColorButtons = props =>
  <div className="color-buttons btn-toolbar" role="toolbar">
    <div className="btn-group btn-group-sm" role="group">
      <button className={cn('btn btn-default', { active: _every(props.colors, c => c) })} onClick={props.toggleAll}>
        All
      </button>
      <button className={cn('btn btn-default', { active: _every(props.colors, c => !c) })} onClick={props.toggleNone}>
        None
      </button>
    </div>
    <div className="btn-group btn-group-sm" role="group">
      <button
        className={cn('btn btn-default', { active: props.monocoloredOnly })}
        title="Only monocolored cards"
        onClick={props.handleChangeMonocolored}
      >
        Mono
      </button>
      <button
        className={cn('btn btn-default', { active: props.multicoloredOnly })}
        title="Only multicolored cards"
        onClick={props.handleChangeMulticolored}
      >
        Multi
      </button>
    </div>
  </div>

ColorButtons.propTypes = {
  colors: PropTypes.object.isRequired,
  monocoloredOnly: PropTypes.bool.isRequired,
  multicoloredOnly: PropTypes.bool.isRequired,
  toggleAll: PropTypes.func.isRequired,
  toggleNone: PropTypes.func.isRequired,
  handleChangeMonocolored: PropTypes.func.isRequired,
  handleChangeMulticolored: PropTypes.func.isRequired
}

export default ColorButtons
