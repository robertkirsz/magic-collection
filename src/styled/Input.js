// ---------------------
// Main input component
// ---------------------

import styled from 'styled-components'

export default styled.input`
  width: 100%;
  padding: 8px;
  background: white;
  border: 1px solid #E2E8ED;
  box-shadow: inset var(--shadow);
  border-radius: var(--borderRadius);
  transition: border-color var(--transitionTime);
  &:focus { border-color: #A2A7AB; }
  &::placeholder { color: #A8B5BE; }
`
