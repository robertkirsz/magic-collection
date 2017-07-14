// ------------------------------------------------------------------
// A simple list that takes care of applying margins to its children
// ------------------------------------------------------------------

import styled, { css } from 'styled-components'

const List = styled.div`
  display: flex;
  flex-direction: ${({ vertical }) => vertical ? 'column' : 'row'};
  justify-content: ${({ right, center }) => center ? 'center' : right ? 'flex-end' : 'flex-start'};
  align-items: ${({ vertical }) => vertical ? 'flex-start' : 'center'};
  ${({ wrap }) => wrap && css`flex-wrap: wrap;`}
  ${({ margin }) => margin && css`margin: ${margin};`}
  ${({ padding }) => padding && css`padding: ${padding};`}
  ${({ vertical, right, space }) => {
    if (vertical) return css`> *:not(:first-child) { margin-top: ${space}; }`
    if (right) return css`> *:not(:last-child) { margin-right: ${space}; }`
    else return css`> *:not(:first-child) { margin-left: ${space}; }`
  }}
`

List.defaultProps = { space: '8px' }

export default List
