// ------------------------------------------- //
// Buttons for filtering cards by color groups //
// ------------------------------------------- //

import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
// --- Helpers ---
import cn from 'classnames'
import _every from 'lodash/every'
// --- Components ---
import { Button } from '../styled'

const propTypes = {
  colors: PropTypes.object.isRequired,
  monocoloredOnly: PropTypes.bool.isRequired,
  multicoloredOnly: PropTypes.bool.isRequired,
  toggleAll: PropTypes.func.isRequired,
  toggleNone: PropTypes.func.isRequired,
  handleChangeMonocolored: PropTypes.func.isRequired,
  handleChangeMulticolored: PropTypes.func.isRequired
}

const ColorButtons = props =>
  <StyledColorButtons>
    <Button
      className={cn({ active: _every(props.colors, c => c) })}
      onClick={props.toggleAll}
    >
      All
    </Button>
    <Button
      className={cn({ active: _every(props.colors, c => !c) })}
      onClick={props.toggleNone}
    >
      None
    </Button>
    <Button
      className={cn({ active: props.monocoloredOnly })}
      title="Only monocolored cards"
      onClick={props.handleChangeMonocolored}
    >
      Mono
    </Button>
    <Button
      className={cn({ active: props.multicoloredOnly })}
      title="Only multicolored cards"
      onClick={props.handleChangeMulticolored}
    >
      Multi
    </Button>
  </StyledColorButtons>

ColorButtons.propTypes = propTypes

export default ColorButtons

const StyledColorButtons = styled.div`
  grid-area: color-buttons-area;

  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;

  button.active { text-decoration: underline; }
`
