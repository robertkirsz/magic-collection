// ---------------------
// Main input component
// ---------------------

import styled from 'styled-components'

export default styled.button.attrs({
  className: 'Button',
  type: 'button'
})`
  display: inline-flex;
  justify-content: center;
  align-items: center;
  padding: 8px;
  background: white;
  border: 1px solid #E2E8ED;
  box-shadow: var(--shadow);
  border-radius: var(--borderRadius);
  transition: all var(--transitionTime);
  &:focus:not(:active) { border-color: #A2A7AB; }
  &:active {
    transform: scale(0.95);
    box-shadow: var(--shadow-1);
  }
`
