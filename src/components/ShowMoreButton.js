import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

const ShowMoreButton = ({ cardsLimit, cardsNumber, onClick }) =>
  <StyledShowMoreButton onClick={onClick}>
    <i className="fa fa-search-plus" />
    <span className="cardsNumber">
      {cardsLimit} / {cardsNumber}
    </span>
  </StyledShowMoreButton>

ShowMoreButton.propTypes = {
  cardsLimit: PropTypes.number.isRequired,
  cardsNumber: PropTypes.number.isRequired,
  onClick: PropTypes.func.isRequired
}

export default ShowMoreButton

const StyledShowMoreButton = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border: 2px dashed;
  border-radius: 4%;
  color: #BBB;
  cursor: pointer;
  transition: color var(--transitionTime);
  &:hover { color: #555; }

  .fa { font-size: 4rem; }

  .cardsNumber {
    font-size: 1.5rem;
    margin-top: 0.5rem;
  }
`
