import React from 'react'
import PropTypes from 'prop-types'
import cn from 'classnames'
import styled from 'styled-components'
// --- Components ---
import { Button, Input, Div } from '../styled'

const CmcTypeButton = ({ thisType, activeType, onChange, label }) =>
  <StyledCmcTypeButton
    className={cn({ active: activeType === thisType })}
    title={thisType} // TODO: capitalize
    onClick={() => { onChange(thisType) }}
  >
    {label}
  </StyledCmcTypeButton>

CmcTypeButton.propTypes = {
  thisType: PropTypes.string,
  activeType: PropTypes.string,
  label: PropTypes.string,
  onChange: PropTypes.func
}

const StyledCmcTypeButton = styled(Button)`
  opacity: 0.4;
  &.active { opacity: 1; }
`

const CmcFilter = ({ cmcValue, cmcType, changeCmcValue, changeCmcType }) =>
  <StyledCmcFilter>
    <Input
      type="number"
      min="0"
      max="30"
      step="1"
      value={cmcValue}
      onChange={e => { changeCmcValue(parseInt(e.target.value || 0, 10)) }}
    />
    <Div flex>
      <CmcTypeButton thisType="minimum" label="Min" activeType={cmcType} onChange={changeCmcType} />
      <CmcTypeButton thisType="exactly" label="Exactly" activeType={cmcType} onChange={changeCmcType} />
      <CmcTypeButton thisType="maximum" label="Max" activeType={cmcType} onChange={changeCmcType} />
    </Div>
  </StyledCmcFilter>

CmcFilter.propTypes = {
  cmcValue: PropTypes.number,
  cmcType: PropTypes.string,
  changeCmcValue: PropTypes.func,
  changeCmcType: PropTypes.func
}

export default CmcFilter

const StyledCmcFilter = styled.div`
  display: flex;
`
