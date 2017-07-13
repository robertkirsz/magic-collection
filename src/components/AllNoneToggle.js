import React from 'react'
import PropTypes from 'proptypes'
import _every from 'lodash/every'

const AllNoneToggle = ({ colors, toggleAll, toggleNone }) => {
  const allChecked = _every(colors, c => c)
  const noneChecked = _every(colors, c => !c)

  return (
    <div className="all-none-checkboxes">
      <label>
        <input
          type="radio"
          name="allNone"
          value="all"
          checked={allChecked}
          onChange={toggleAll}
        />
          All
      </label>
      <label>
        <input
          type="radio"
          name="allNone"
          value="none"
          checked={noneChecked}
          onChange={toggleNone}
        />
          None
      </label>
    </div>
  )
}

AllNoneToggle.propTypes = {
  colors: PropTypes.object,
  toggleAll: PropTypes.func,
  toggleNone: PropTypes.func
}

export default AllNoneToggle
