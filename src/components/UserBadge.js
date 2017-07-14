import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import styled from 'styled-components'

const mapStateToProps = ({ user }) => ({ user })

const propTypes = { user: PropTypes.object }

const UserBadge = ({ user: { displayName, email, photoURL } }) =>
  <Container title={displayName || email} style={{ backgroundImage: `url(${photoURL})` }}>
    {!photoURL && <i className="fa fa-user" />}
  </Container>

UserBadge.propTypes = propTypes

export default connect(mapStateToProps)(UserBadge)

const Container = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: grey;
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  text-align: center;
  .fa {
    line-height: 40px;
    font-size: calc(40px / 2);
    color: #ddd;
  }
`
