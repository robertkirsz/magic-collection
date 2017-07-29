// -------------------
// Main dropdown menu
// -------------------

import styled from 'styled-components'
import List from './List'

export default styled(List).attrs({
  className: 'DropdownMenu'
})`
  align-items: stretch;
  position: absolute;
  top: 100%;
  right: 0;
  background: white;
  border-bottom-right-radius: var(--borderRadius);
  border-bottom-left-radius: var(--borderRadius);
  box-shadow: var(--shadow);
  z-index: 15;

  > * {
    padding: 1rem;
    border-top: 1px solid #ddd;
  }
`
