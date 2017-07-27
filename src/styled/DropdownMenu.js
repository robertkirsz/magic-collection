// -------------------
// Main dropdown menu
// -------------------

import styled from 'styled-components'
import List from './List'

export default styled(List)`
  align-items: stretch;
  position: absolute;
  top: 100%;
  right: 0;
  background: white;
  border-bottom-right-radius: 4px;
  border-bottom-left-radius: 4px;
  box-shadow: var(--shadow);
  z-index: 15;

  > * {
    padding: 16px;
    border-top: 1px solid #ddd;
  }
`
