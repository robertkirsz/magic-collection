import React from 'react'
import PropTypes from 'prop-types'
// --- Components ---
import { CardContainer } from '../styled'

const ShowMoreButton = ({ cardsLimit, cardsNumber, onClick }) =>
  <Container onClick={onClick}>
    <div>
      <i className="fa fa-search-plus" />
      <span className="cardsNumber">
        {cardsLimit} / {cardsNumber}
      </span>
    </div>
  </Container>

ShowMoreButton.propTypes = {
  cardsLimit: PropTypes.number.isRequired,
  cardsNumber: PropTypes.number.isRequired,
  onClick: PropTypes.func.isRequired
}

export default ShowMoreButton

const Container = CardContainer.extend`
  > div {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    border: 2px dashed;
    color: #BBB;
    cursor: pointer;
    transition: color var(--transitionTime);
    &:hover { color: #555; }
    .fa { font-size: 4em; }
    .cardsNumber {
      font-size: 1.5em;
      margin-top: 0.5em;
    }
  }
`
