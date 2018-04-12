// WheelItem.js

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { StyleSheet, View, Text, Animated, ViewPropTypes } from 'react-native'

import Theme from '../../../teaset/themes/Theme'

export default class WheelItem extends Component {
  static propTypes = {
    ...ViewPropTypes,
    index: PropTypes.number.isRequired,
    itemHeight: PropTypes.number.isRequired,
    wheelHeight: PropTypes.number.isRequired,
    currentPosition: PropTypes.any, // instanceOf(Animated)
  }

  static defaultProps = {
    ...Animated.View.defaultProps,
  }

  constructor(props) {
    super(props)
    this.lastPosition = null
    this.state = {
      translateY: new Animated.Value(100000),
      scaleX: new Animated.Value(1),
      scaleY: new Animated.Value(1),
    }
  }

  componentWillMount() {
    if (!this.positionListenerId) {
      this.positionListenerId = this.props.currentPosition.addListener(e => {
        this.handlePositionChange(e.value)
      })
      this.handlePositionChange(this.props.currentPosition._value)
    }
  }

  componentWillUnmount() {
    if (this.positionListenerId) {
      this.props.currentPosition.removeListener(this.positionListenerId)
      this.positionListenerId = null
    }
  }

  componentWillReceiveProps(nextProps) {
    const { itemHeight, wheelHeight, index } = this.props
    if (
      nextProps.index != index ||
      nextProps.itemHeight != itemHeight ||
      nextProps.wheelHeight != wheelHeight
    ) {
      this.handlePositionChange(nextProps.currentPosition._value, nextProps)
    }
  }

  calcProjection(diameter, point, width) {
    if (diameter == 0) return false
    const radius = diameter / 2
    const circumference = Math.PI * diameter
    const quarter = circumference / 4
    if (Math.abs(point) > quarter) return false
    const alpha = point / circumference * Math.PI * 2

    const pointProjection = radius * Math.sin(alpha)
    const distance = radius - radius * Math.sin(Math.PI / 2 - alpha)
    const eyesDistance = 1000
    const widthProjection = width * eyesDistance / (distance + eyesDistance)

    return { point: pointProjection, width: widthProjection }
  }

  handlePositionChange(value, props = null) {
    const { itemHeight, wheelHeight, index } = props || this.props

    if (!itemHeight || !wheelHeight) return
    if (this.lastPosition !== null && Math.abs(this.lastPosition - value) < 1)
      return

    const itemPosition = itemHeight * index
    const halfItemHeight = itemHeight / 2
    const top = itemPosition - value - halfItemHeight
    const bottom = top + itemHeight
    const refWidth = 100
    const p1 = this.calcProjection(wheelHeight, top, refWidth)
    const p2 = this.calcProjection(wheelHeight, bottom, refWidth)

    let ty = 10000,
      sx = 1,
      sy = 1
    if (p1 && p2) {
      const y1 = p1.point
      const y2 = p2.point
      ty = (y1 + y2) / 2
      sy = (y2 - y1) / itemHeight
      sx = (p1.width + p2.width) / 2 / refWidth
    }

    const { translateY, scaleX, scaleY } = this.state
    translateY.setValue(ty)
    scaleX.setValue(sx)
    scaleY.setValue(sy)
    this.lastPosition = value
  }

  render() {
    let {
      style,
      itemHeight,
      wheelHeight,
      index,
      currentPosition,
      children,
      ...others
    } = this.props
    const { translateY, scaleX, scaleY } = this.state
    style = [
      {
        backgroundColor: 'rgba(0, 0, 0, 0)',
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        justifyContent: 'center',
        transform: [{ scaleX }, { translateY }, { scaleY }],
      },
    ].concat(style)
    return (
      <Animated.View style={style} {...others}>
        {children}
      </Animated.View>
    )
  }
}
