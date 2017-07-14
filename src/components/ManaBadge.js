import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
// --- Helpers ---
import { manaLettersToArray } from '../utils'

const propTypes = { manaCost: PropTypes.string }

const ManaBadge = ({ manaCost }) =>
  manaCost !== undefined
    ? <Container>
      {manaLettersToArray(manaCost).map((className, i) => <i key={i} className={className} />)}
    </Container>
    : null

ManaBadge.propTypes = propTypes

export default ManaBadge

const Container = styled.span`
  i:not(:first-child) {
    margin-left: 3px;
  }
`
