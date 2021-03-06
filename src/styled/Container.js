import styled from 'styled-components'
import Div from './Div'

export default styled(Div).attrs({
  className: 'Container'
})`
  position: relative;
  width: 100%;
  max-width: var(--contentWidth);
  padding: 0 1rem;
`
