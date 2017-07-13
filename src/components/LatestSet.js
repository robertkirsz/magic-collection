import React from 'react'
import PropTypes from 'proptypes'
import { connect } from 'react-redux'

export const LatestSet = ({ allCards }) => (
  <div className="latest-set">
    {allCards.latestSet.name}
    {' : '}
    {allCards.cardsNumber}
  </div>
)

LatestSet.propTypes = {
  allCards: PropTypes.object
}

const mapStateToProps = ({ allCards }) => ({ allCards })

export default connect(mapStateToProps)(LatestSet)
