import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { CollectionStats } from 'components'

const mapStateToProps = ({ user }) => ({ user })

const CollectionStatsView = ({ user }) => (
  <div className="collection-stats-view">
    <CollectionStats />
  </div>
)

CollectionStatsView.propTypes = {
  user: PropTypes.object
}

export default connect(mapStateToProps)(CollectionStatsView)
