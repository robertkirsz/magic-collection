import React from 'react'
import PropTypes from 'proptypes'
import cn from 'classnames'

const CmcTypeButton = ({ thisType, activeType, onChange, label }) => (
  <button
    className={
      cn(
        'cmc-filter__button btn btn-default',
        { 'active': activeType === thisType }
      )
    }
    title={thisType} // TODO: capitalize
    onClick={() => { onChange(thisType) }}
  >
    {label}
  </button>
)

CmcTypeButton.propTypes = {
  thisType: PropTypes.string,
  activeType: PropTypes.string,
  label: PropTypes.string,
  onChange: PropTypes.func
}

const CmcFilter = ({ cmcValue, cmcType, changeCmcValue, changeCmcType }) => (
  <div className="cmc-filter form-group form-inline">
    <div className="input-group">
      <div className="input-group-addon" title="Converted Mana Cost">CMC</div>
      <input
        className="cmc-filter__input form-control"
        type="number"
        min="0"
        max="30"
        step="1"
        value={cmcValue}
        onChange={e => { changeCmcValue(parseInt(e.target.value || 0, 10)) }}
      />
      <div className="input-group-btn">
        <CmcTypeButton
          thisType="minimum"
          label="Min"
          activeType={cmcType}
          onChange={changeCmcType}
        />
        <CmcTypeButton
          thisType="exactly"
          label="Exactly"
          activeType={cmcType}
          onChange={changeCmcType}
        />
        <CmcTypeButton
          thisType="maximum"
          label="Max"
          activeType={cmcType}
          onChange={changeCmcType}
        />
      </div>
    </div>
  </div>
)

CmcFilter.propTypes = {
  cmcValue: PropTypes.number,
  cmcType: PropTypes.string,
  changeCmcValue: PropTypes.func,
  changeCmcType: PropTypes.func
}

export default CmcFilter
