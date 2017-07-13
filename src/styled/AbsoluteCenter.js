import styled from 'styled-components'
import { flex } from './Flex'

const AbsoluteCenter = styled.div`
  ${flex('column', 'nowrap', 'center', 'center')}
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background: ${props => props.background || 'none'};
`

export default AbsoluteCenter
