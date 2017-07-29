import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { ManaBadge } from './'
import { manaLettersToIcons } from '../utils'

const propTypes = { card: PropTypes.object.isRequired }

const CardDetails = ({ card }) =>
  <StyledCardDetails>
    <ul>
      <li>
        {card.name} <ManaBadge manaCost={card.manaCost} />
      </li>
      <li>
        {card.type}
      </li>
      {card.text &&
        <li className="text" dangerouslySetInnerHTML={{ __html: manaLettersToIcons(card.text) }} />}
      {card.power &&
        card.toughness &&
        <li>
          {card.power} / {card.toughness}
        </li>}
    </ul>
  </StyledCardDetails>

CardDetails.propTypes = propTypes

export default CardDetails

const StyledCardDetails = styled.div`
  > .text {
    white-space: pre-line;
  }
  > ul {
    margin: 0;
    padding: 0;
    list-style: none;
    > li:not(:first-of-type) {
      margin-top: 5px;
    }
  }
`
