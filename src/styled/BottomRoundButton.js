import styled from 'styled-components'

const BottomRoundButton = styled.button`
  width: 40px;
  height: 40px;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 50%;
  border: none;
  font-size: 1.5em;
  box-shadow: 0 3px 5px rgba(0, 0, 0, 0.3);
  transition: color 0.3s;
  pointer-events: auto;
  cursor: pointer;
  color: ${props => props.active ? 'lime' : 'inherit'};
`

export default BottomRoundButton
