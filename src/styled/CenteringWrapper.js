// -----------------------------------------------------------
// Wrapper component that takes-up all available space
// and centers it's children both vertically and horizontally
// -----------------------------------------------------------

import styled from 'styled-components'

export default styled.div`
  position: relative;
  display: flex;
  flex-direction: ${props => {
    if (props.row) return 'row'
    if (props.column || !props.row) return 'column'
  }};
  width: 100%; height: 100%;
  justify-content: center;
  align-items: center;
  padding: 0.5rem;
`
