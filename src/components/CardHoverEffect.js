import React, { Component } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
// --- Helpers ---
import cn from 'classnames'
import _includes from 'lodash/includes'

let bd
let htm

export default class CardHoverEffect extends Component {
  static propTypes = {
    children: PropTypes.element,
    onClick: PropTypes.func,
    hoverAnimation: PropTypes.bool,
    onMouseEnter: PropTypes.func,
    onMouseLeave: PropTypes.func,
    onMouseMove: PropTypes.func
  }

  static defaultProps = {
    onClick: () => {},
    onMouseEnter: () => {},
    onMouseLeave: () => {},
    onMouseMove: () => {}
  }

  containerElement = null
  contentElement = null
  shineElement = null

  handleClick = () => {
    this.handleMouseLeave()
    if (this.props.onClick) this.props.onClick()
  }

  componentDidMount () {
    bd = document.getElementsByTagName('body')[0]
    htm = document.getElementsByTagName('html')[0]

    const w =
      this.containerElement.clientWidth ||
      this.containerElement.offsetWidth ||
      this.containerElement.scrollWidth
    this.containerElement.style.transform = 'perspective(' + w * 3 + 'px)'
  }

  handleMouseMove = e => {
    if (!this.props.hoverAnimation) return
    // This covers situation where "mouseMove" happens without "mouseEnter"
    if (!_includes(this.contentElement.className, ' over')) this.handleMouseEnter()

    const touchEnabled = false
    const bdst = bd.scrollTop || htm.scrollTop
    const bdsl = bd.scrollLeft
    const pageX = touchEnabled ? e.touches[0].pageX : e.pageX
    const pageY = touchEnabled ? e.touches[0].pageY : e.pageY
    const offsets = this.containerElement.getBoundingClientRect()
    const w =
      this.containerElement.clientWidth ||
      this.containerElement.offsetWidth ||
      this.containerElement.scrollWidth
    const h =
      this.containerElement.clientHeight ||
      this.containerElement.offsetHeight ||
      this.containerElement.scrollHeight
    const wMultiple = 320 / w
    const offsetX = 0.52 - (pageX - offsets.left - bdsl) / w
    const offsetY = 0.52 - (pageY - offsets.top - bdst) / h
    const dy = pageY - offsets.top - bdst - h / 2
    const dx = pageX - offsets.left - bdsl - w / 2
    const yRotate = (offsetX - dx) * (0.07 * wMultiple)
    const xRotate = (dy - offsetY) * (0.1 * wMultiple)
    let imgCSS = 'rotateX(' + xRotate + 'deg) rotateY(' + yRotate + 'deg)'
    const arad = Math.atan2(dy, dx)
    let angle = arad * 180 / Math.PI - 90

    this.props.onMouseMove({ pageX, pageY })

    if (angle < 0) angle = angle + 360

    if (this.contentElement.className.indexOf(' over') !== -1) imgCSS += ' scale3d(1.07,1.07,1.07)'

    this.contentElement.style.transform = imgCSS

    this.shineElement.style.background =
      'linear-gradient(' +
      angle +
      'deg, rgba(255, 255, 255, ' +
      (pageY - offsets.top - bdst) / h * 0.4 +
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
        className={cn('card-hover-effect', { clickable: !!this.props.onClick })}
        onClick={this.handleClick}
        onMouseMove={this.handleMouseMove}
        onMouseEnter={this.handleMouseEnter}
        onMouseLeave={this.handleMouseLeave}
        tabIndex="1"
      >
        <div
          className="container"
          ref={o => {
            this.contentElement = o
          }}
        >
          <div className="shadow" />
          <div className="content">
            {this.props.children}
          </div>
          <div
            className="shine"
            ref={o => {
              this.shineElement = o
            }}
          />
        </div>
      </StyledCardHoverEffect>
    )
  }
}

const StyledCardHoverEffect = styled.div`
  border-radius: 4%;
  transform-style: preserve-3d;
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
  &:hover {
    z-index: 1;
  }

  > .container {
    position: relative;
    width: 100%;
    height: 100%;
    border-radius: 4%;
    transition: all 0.2s ease-out;
    &.over > .shadow {
      box-shadow: 0 45px 100px rgba(14, 21, 47, 0.4), 0 16px 40px rgba(14, 21, 47, 0.4);
    }
    > .content {
      position: relative;
      width: 100%;
      height: 100%;
      border-radius: 4%;
      transform-style: preserve-3d;
      transition: transform 0.2s;
    }

    > .shadow {
      position: absolute;
      top: 5%;
      left: 5%;
      width: 90%;
      height: 90%;
      transition: all 0.2s ease-out;
      box-shadow: 0 8px 30px rgba(14, 21, 47, 0.6);
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
    }
  }
`
