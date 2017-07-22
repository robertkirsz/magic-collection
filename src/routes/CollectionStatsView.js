import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { CollectionStats } from '../components'

const mapStateToProps = ({ user }) => ({ user })

const CollectionStatsView = ({ user }) => (
  <main className="collection-stats-view">
    <CollectionStats />
  </main>
)

CollectionStatsView.propTypes = {
  user: PropTypes.object
}

export default connect(mapStateToProps)(CollectionStatsView)
