import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import styled from 'styled-components'
import faceIcon from '../assets/face-icon.svg'
import { Spinner } from '../components'

const mapStateToProps = ({ user }) => ({
  title: user.displayName || user.email,
  picture: user.photoURL,
  loading: user.authPending
})

const propTypes = {
  title: PropTypes.string,
  picture: PropTypes.string,
  loading: PropTypes.bool.isRequired,
  size: PropTypes.string,
  style: PropTypes.object,
  onClick: PropTypes.func
}

const defaultProps = {
  size: '40px',
  style: {},
  onClick: () => {}
}

const UserBadge = props =>
  <StyledUserBadge
    title={props.title}
    size={props.size}
    style={props.style}
    picture={props.picture}
    loading={props.loading}
    onClick={props.onClick}
  >
    {props.loading && <Spinner size={parseInt(props.size, 10) * 0.7 + 'px'} />}
  </StyledUserBadge>

UserBadge.propTypes = propTypes
UserBadge.defaultProps = defaultProps

export default connect(mapStateToProps)(UserBadge)

const StyledUserBadge = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: ${props => props.size};
  height: ${props => props.size};
  background: ${props => (props.loading ? 'none' : `url(${props.picture || faceIcon}) no-repeat center`)};
  background-size: ${props => (props.picture ? 'cover' : '70%')};
  border: 1px solid #e2e8ed;
  border-radius: 50%;
  box-shadow: inset 0 1px 3px 0 rgba(173, 173, 173, 0.75);
  cursor: pointer;
`
