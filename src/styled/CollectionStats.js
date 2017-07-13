import styled from 'styled-components'

const CollectionStats = styled.div`
  display: flex;
  flex-flow: column nowrap;
  h2 { margin: 8px 0; }
  figure {
    display: inline-block;
    border: 1px solid;
    padding: 8px;
    &:not(:last-child) { margin-bottom: 8px; }
  }
`

export default CollectionStats
