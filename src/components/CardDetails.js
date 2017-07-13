import React from 'react'
import PropTypes from 'proptypes'
import { ManaBadge } from 'components'
import { manaLettersToIcons } from 'utils'

const propTypes = { card: PropTypes.object.isRequired }

const CardDetails = ({ card }) => {
  return (
    <div className="card-details">
      <ul>
        <li>{card.name} {<ManaBadge manaCost={card.manaCost} />}</li>
        <li>{card.type}</li>
        {card.text && <li className="card-details__text" dangerouslySetInnerHTML={{ __html: manaLettersToIcons(card.text) }} />}
        {card.power && card.toughness && <li>{card.power} / {card.toughness}</li>}
      </ul>
    </div>
  )
}

CardDetails.propTypes = propTypes

export default CardDetails
