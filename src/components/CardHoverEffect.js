import React, { Component } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
// --- Helpers ---
import _includes from 'lodash/includes'

export default class CardHoverEffect extends Component {
  static propTypes = {
    children: PropTypes.element,
    hoverAnimation: PropTypes.bool,
    onMouseEnter: PropTypes.func,
    onMouseLeave: PropTypes.func,
    onMouseMove: PropTypes.func
  }

  static defaultProps = {
    onMouseEnter: () => {},
    onMouseLeave: () => {},
    onMouseMove: () => {}
  }

  containerElement = null
  contentElement = null
  shineElement = null

  componentDidMount () {
    const w = this.containerElement.clientWidth
    this.containerElement.style.transform = 'perspective(' + w * 3 + 'px)'
  }

  shouldComponentUpdate () {
    return false
  }

  handleMouseMove = e => {
    if (!this.props.hoverAnimation) return
    // This covers situation where "mouseMove" happens without "mouseEnter"
    if (!_includes(this.contentElement.className, ' over')) this.handleMouseEnter()

    const { pageX, pageY } = e
    const offsets = this.containerElement.getBoundingClientRect()
    const w = this.containerElement.clientWidth
    const h = this.containerElement.clientHeight
    const wMultiple = 320 / w
    const offsetX = 0.52 - (pageX - offsets.left) / w
    const offsetY = 0.52 - (pageY - offsets.top) / h
    const dy = pageY - offsets.top - h / 2
    const dx = pageX - offsets.left - w / 2
    const yRotate = (offsetX - dx) * (0.07 * wMultiple)
    const xRotate = (dy - offsetY) * (0.1 * wMultiple)
    let imgCSS = 'rotateX(' + xRotate + 'deg) rotateY(' + yRotate + 'deg)'
    const arad = Math.atan2(dy, dx)
    let angle = arad * 180 / Math.PI - 90

    const rect = offsets
    const cardX = pageX - rect.left // x position within the element
    const cardY = pageY - rect.top // y position within the element

    this.props.onMouseMove({ pageX, pageY, cardX, cardY })

    if (angle < 0) angle = angle + 360

    if (this.contentElement.className.indexOf(' over') !== -1) {
      imgCSS += ' scale3d(1.07, 1.07, 1.07)'
    }

    this.contentElement.style.transform = imgCSS

    this.shineElement.style.background =
      'linear-gradient(' +
      angle +
      'deg, rgba(255, 255, 255, ' +
      (pageY - offsets.top) / h * 0.4 +
      ') 0%,rgba(255, 255, 255, 0) 80%)'
    this.shineElement.style.transform =
      'translateX(' + offsetX + 'px) translateY(' + offsetY + 'px)'
  }

  handleMouseEnter = () => {
    this.props.onMouseEnter()
    if (!this.props.hoverAnimation) return
    this.contentElement.className += ' over'
  }

  handleMouseLeave = () => {
    this.props.onMouseLeave()
    if (!this.props.hoverAnimation) return
    this.contentElement.className = this.contentElement.className.replace(' over', '')
    this.contentElement.style.transform = ''
    this.shineElement.style.cssText = ''
  }

  render () {
    return (
      <StyledCardHoverEffect
        innerRef={o => {
          this.containerElement = o
        }}
        className="card-hover-effect"
        onClick={this.handleMouseLeave}
        onMouseMove={this.handleMouseMove}
        onMouseEnter={this.handleMouseEnter}
        onMouseLeave={this.handleMouseLeave}
      >
        <div
          className="container"
          ref={o => {
            this.contentElement = o
          }}
        >
          <div
            className="shine"
            ref={o => {
              this.shineElement = o
            }}
          />
          <div className="content">
            {this.props.children}
          </div>
          <div className="shadow" />
        </div>
      </StyledCardHoverEffect>
    )
  }
}

const StyledCardHoverEffect = styled.div`
  border-radius: 4%;
  transform-style: preserve-3d;

  > .container {
    position: relative;
    width: 100%;
    height: 100%;
    border-radius: 4%;
    transition: all 0.2s ease-out;
    &.over > .shadow {
      box-shadow: 0 45px 100px rgba(14, 21, 47, 0.4), 0 16px 40px rgba(14, 21, 47, 0.4);
    }

    > .shine {
      position: absolute;
      top: 0;
      right: 0;
      left: 0;
      bottom: 0;
      border-radius: 4%;
      background: linear-gradient(135deg, rgba(255, 255, 255, 0.25) 0%, rgba(255, 255, 255, 0) 60%);
      pointer-events: none;
      z-index: 3;
    }

    > .content {
      position: relative;
      width: 100%;
      height: 100%;
      border-radius: 4%;
      transform-style: preserve-3d;
      transition: transform 0.2s;
      z-index: 2;
    }

    > .shadow {
      position: absolute;
      top: 5%;
      left: 5%;
      width: 90%;
      height: 90%;
      transition: all 0.2s ease-out;
      box-shadow: 0 8px 30px rgba(14, 21, 47, 0.6);
      z-index: 1;
    }
  }
`
