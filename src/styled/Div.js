// -----------------------------
// An all-purpose div component
// -----------------------------

import styled, { css } from 'styled-components'

export default styled.div.attrs({
  className: 'Div'
})`
  ${''/* DISPLAY */}
  ${({ flex, block, inline }) => {
    if (inline) {
      if (block) return css`display: inline-block;`
      else if (flex) return css`display: inline-flex;`
      else return css`display: inline;`
    } else {
      if (flex) return css`display: flex;`
      if (block) return css`display: block;`
    }
  }}

  ${''/* FLEX */}
  ${({
    flex, rowReverse, column, columnReverse, wrap,
    justifyContent, alignItems, alignContent
  }) => {
    if (flex) {
      return css`
        flex-direction: ${() => {
          if (rowReverse) return 'row-reverse'
          if (column) return 'column'
          if (columnReverse) return 'column-reverse'
          return 'row'
        }};
        flex-wrap: ${wrap ? 'wrap' : 'nowrap'};
        justify-content: ${justifyContent || 'flex-start'};
        align-items: ${alignItems || 'stretch'};
        align-content: ${alignContent || 'stretch'};
      `
    }
  }}

  ${''/* FLEX ITEM */}
  ${({ flexNone, flexVal }) => {
    if (flexNone) return css`flex: none;`
    if (flexVal) return css`flex: ${flexVal};`
  }}
  ${({ alignSelf }) => alignSelf && css`align-self: ${alignSelf};`}

  ${''/* POSITION */}
  ${({ absolute, relative }) => {
    if (absolute) return css`position: absolute;`
    if (relative) return css`position: relative;`
  }}

  ${''/* LAYER */}
  ${({ layer }) => {
    if (layer) {
      return css`
        position: absolute;
        top: 0; right: 0; bottom: 0; left: 0;
      `
    }
  }}

  ${''/* SIZE */}
  ${({ width }) => width && css`width: ${width};`}
  ${({ height }) => height && css`height: ${height};`}
  ${({ margin }) => margin && css`margin: ${margin};`}
  ${({ padding }) => padding && css`padding: ${padding};`}
  ${({ square }) => square && css`width: ${square}; height: ${square};`}

  ${''/* MISC */}
  ${({ z, zIndex }) => (z || zIndex) && css`z-index: ${z || zIndex};`}
  ${({ clickable }) => clickable && css`cursor: pointer;`}
  ${({ noPointerEvents }) => noPointerEvents && css`pointer-events: none;`}
  ${({ spread }) => {
    if (spread) {
      return css`
        justify-content: space-between;
        align-items: center;
      `
    }
  }}
`
