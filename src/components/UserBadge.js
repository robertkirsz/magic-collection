import React from 'react'
import PropTypes from 'proptypes'
import { connect } from 'react-redux'

const mapStateToProps = ({ user }) => ({ user })

const propTypes = { user: PropTypes.object }

const UserBadge = ({ user: { displayName, email, photoURL } }) => (
  <div
    className="user-badge"
    title={displayName || email}
    style={{ backgroundImage: `url(${photoURL})` }}
  >
    {!photoURL && <i className="fa fa-user" />}
  </div>
)

UserBadge.propTypes = propTypes

export default connect(mapStateToProps)(UserBadge)
