import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

const mapStateToProps = ({ user }) => ({ user })

const ProfileView = ({ user }) => (
  <main className="profile-view">
    <pre>{JSON.stringify(user, null, 2)}</pre>
  </main>
)

ProfileView.propTypes = {
  user: PropTypes.object
}

export default connect(mapStateToProps)(ProfileView)
