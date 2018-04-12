// MenuView.js

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { View, ScrollView } from 'react-native'

import Theme from '../../../teaset/themes/Theme'
import Overlay from '../Overlay/Overlay'
import MenuItem from './MenuItem'

export default class MenuView extends Overlay.PopoverView {
  static propTypes = {
    ...Overlay.PopoverView.propTypes,
    items: PropTypes.arrayOf(
      PropTypes.shape({
        title: PropTypes.string,
        icon: PropTypes.oneOfType([
          PropTypes.element,
          PropTypes.shape({ uri: PropTypes.string }),
          PropTypes.number,
          PropTypes.oneOf(['none', 'empty']),
        ]),
        onPress: PropTypes.func,
      })
    ).isRequired,
    shadow: PropTypes.bool,
  }

  static defaultProps = {
    ...Overlay.PopoverView.defaultProps,
    direction: 'down',
    align: 'center',
    showArrow: false,
    shadow: true,
  }

  static Item = MenuItem

  onItemPress(item) {
    this.close(false)
    item.onPress && item.onPress()
  }

  buildProps() {
    let {
      popoverStyle,
      directionInsets,
      shadow,
      items,
      children,
      ...others
    } = this.props

    const menuStyle = {
      backgroundColor: Theme.menuColor,
    }
    if (shadow) {
      Object.assign(menuStyle, {
        shadowColor: Theme.menuShadowColor,
        shadowOffset: { width: 1, height: 1 },
        shadowOpacity: 0.5,
        shadowRadius: 2,
      })
    }
    popoverStyle = [menuStyle].concat(popoverStyle)

    if (!directionInsets && directionInsets !== 0) {
      directionInsets = Theme.menuDirectionInsets
    }

    let iconDefault = 'none'
    for (const item of items) {
      if (item.icon) {
        iconDefault = 'empty'
        break
      }
    }
    children = []
    for (let i = 0; items && i < items.length; ++i) {
      const item = items[i]
      const { title, icon } = item
      const style = i === 0 ? { borderTopWidth: 0 } : null
      children.push(
        <this.constructor.Item
          key={`item${i}`}
          style={style}
          title={title}
          icon={icon || iconDefault}
          onPress={() => this.onItemPress(item)}
        />
      )
    }

    this.props = {
      popoverStyle,
      directionInsets,
      shadow,
      items,
      children,
      ...others,
    }

    super.buildProps()
  }
}
