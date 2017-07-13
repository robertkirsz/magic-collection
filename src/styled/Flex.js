import styled from 'styled-components'

// Flex mixin to be used inside other styled-component declarations
export const flex = (direction, wrap, justifyContent, alignItems, alignContent) => (`
  display: flex;
  flex-direction: ${direction || 'row'};
  flex-wrap: ${wrap || 'nowrap'};
  justify-content: ${justifyContent || 'flex-start'};
  align-items: ${alignItems || 'stretch'};
  align-content: ${alignContent || 'stretch'};
`)

// Standalone flex styled-component
const Flex = styled.div`
  display: ${props => props.inline ? 'inline-flex' : 'flex'};
  flex-direction: ${props => {
    if (props.rowReverse) return 'rowReverse'
    if (props.column) return 'column'
    if (props.columnReverse) return 'columnReverse'
    return 'row'
  }};
  flex-wrap: ${props => props.wrap || 'nowrap'};
  justify-content: ${props => props.justifyContent || 'flex-start'};
  align-items: ${props => props.alignItems || 'stretch'};
  align-content: ${props => props.alignContent || 'stretch'};
`

export default Flex
