// ---------------------
// Main input component
// ---------------------

import styled from 'styled-components'

export default styled.button.attrs({
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
  transition: border-color 0.3s;
  &:focus { border-color: #A2A7AB; }
`
