import styled from 'styled-components'

const ModalContent = styled.div`
  width: ${props => props.width};
  max-width: 90vw;
  padding: 1rem;
  background-color: white;
  border-radius: var(--borderRadius);
  box-shadow: 0 2px 8px rgba(0, 0, 0, .33);
`

ModalContent.defaultProps = {
  width: '300px'
}

export default ModalContent
