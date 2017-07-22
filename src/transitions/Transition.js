import React from 'react'
import PropTypes from 'prop-types'
import CSSTransition from 'react-transition-group/CSSTransition'

const propTypes = {
  children: PropTypes.element,
  in: PropTypes.bool.isRequired,
  classNames: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object
  ]),
  startMounted: PropTypes.bool,
  stayMounted: PropTypes.bool,
  timeout: PropTypes.number
}

const defaultProps = {
  timeout: 300
}

const Transition = ({ children, startMounted, stayMounted, ...props }) =>
  <CSSTransition
    mountOnEnter={!startMounted}
    unmountOnExit={!stayMounted}
    {...props}
  >
    {children}
  </CSSTransition>

Transition.propTypes = propTypes
Transition.defaultProps = defaultProps

export default Transition
