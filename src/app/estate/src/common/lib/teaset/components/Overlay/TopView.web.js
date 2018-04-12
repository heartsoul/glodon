// TopView.js

import React, { Component } from 'react'
import { StyleSheet, AppRegistry, View, Animated } from 'react-native'
// import {Symbol} from 'core-js';

import Theme from '../../../teaset/themes/Theme'

class DeviceEventEmitter extends Object {
  static emit(key, value) {}
  static addListener(key, value) {}
  static removeAllListeners(key) {}
}

let keyValue = 0

export default class TopView extends Component {
  static add(element) {
    const key = ++keyValue
    DeviceEventEmitter.emit('addOverlay', { key, element })
    // alert(globalTopView);
    if (globalTopView) {
      globalTopView.add(element)
    } else {
    }
    return key
  }

  static remove(key) {
    if (globalTopView) {
      globalTopView.remove(key)
    }
    DeviceEventEmitter.emit('removeOverlay', { key })
  }

  static removeAll() {
    if (globalTopView) {
      globalTopView.removeAll(key)
    }
    DeviceEventEmitter.emit('removeAllOverlay', {})
  }

  static transform(transform, animated, animatesOnly = null) {
    if (globalTopView) {
      globalTopView.transform(transform, animated, animatesOnly)
    }
    DeviceEventEmitter.emit('transformRoot', {
      transform,
      animated,
      animatesOnly,
    })
  }

  static restore(animated, animatesOnly = null) {
    if (globalTopView) {
      globalTopView.restore(animated, animatesOnly)
    }
    DeviceEventEmitter.emit('restoreRoot', { animated, animatesOnly })
  }

  constructor(props) {
    super(props)
    this.state = {
      elements: [],
      translateX: new Animated.Value(0),
      translateY: new Animated.Value(0),
      scaleX: new Animated.Value(1),
      scaleY: new Animated.Value(1),
    }
  }

  componentWillMount() {
    DeviceEventEmitter.addListener('addOverlay', e => this.add(e))
    DeviceEventEmitter.addListener('removeOverlay', e => this.remove(e))
    DeviceEventEmitter.addListener('removeAllOverlay', e => this.removeAll(e))
    DeviceEventEmitter.addListener('transformRoot', e => this.transform(e))
    DeviceEventEmitter.addListener('restoreRoot', e => this.restore(e))
  }

  componentWillUnmount() {
    DeviceEventEmitter.removeAllListeners('addOverlay')
    DeviceEventEmitter.removeAllListeners('removeOverlay')
    DeviceEventEmitter.removeAllListeners('removeAllOverlay')
    DeviceEventEmitter.removeAllListeners('transformRoot')
    DeviceEventEmitter.removeAllListeners('restoreRoot')
  }

  add(e) {
    alert(`add${e}`)
    let { elements } = this.state
    elements = [e]
    this.setState({ elements })
  }

  remove(e) {
    const { elements } = this.state
    for (let i = elements.length - 1; i >= 0; --i) {
      if (elements[i].key === e.key) {
        elements.splice(i, 1)
        break
      }
    }
    this.setState({ elements })
  }

  removeAll(e) {
    const { elements } = this.state
    this.setState({ elements: [] })
  }

  transform(e) {
    alert(`transform:${e}`)
    const { translateX, translateY, scaleX, scaleY } = this.state
    const { transform, animated, animatesOnly } = e
    let tx = 0,
      ty = 0,
      sx = 1,
      sy = 1
    transform.map(item => {
      if (item && typeof item === 'object') {
        for (const name in item) {
          const value = item[name]
          switch (name) {
            case 'translateX':
              tx = value
              break
            case 'translateY':
              ty = value
              break
            case 'scaleX':
              sx = value
              break
            case 'scaleY':
              sy = value
              break
          }
        }
      }
    })
    if (animated) {
      const animates = [
        Animated.spring(translateX, { toValue: tx, friction: 9 }),
        Animated.spring(translateY, { toValue: ty, friction: 9 }),
        Animated.spring(scaleX, { toValue: sx, friction: 9 }),
        Animated.spring(scaleY, { toValue: sy, friction: 9 }),
      ]
      animatesOnly
        ? animatesOnly(animates)
        : Animated.parallel(animates).start()
    } else if (animatesOnly) {
      const animates = [
        Animated.timing(translateX, { toValue: tx, duration: 1 }),
        Animated.timing(translateY, { toValue: ty, duration: 1 }),
        Animated.timing(scaleX, { toValue: sx, duration: 1 }),
        Animated.timing(scaleY, { toValue: sy, duration: 1 }),
      ]
      animatesOnly(animates)
    } else {
      translateX.setValue(tx)
      translateY.setValue(ty)
      scaleX.setValue(sx)
      scaleY.setValue(sy)
    }
  }

  restore(e) {
    const { translateX, translateY, scaleX, scaleY } = this.state
    const { animated, animatesOnly } = e
    if (animated) {
      const animates = [
        Animated.spring(translateX, { toValue: 0, friction: 9 }),
        Animated.spring(translateY, { toValue: 0, friction: 9 }),
        Animated.spring(scaleX, { toValue: 1, friction: 9 }),
        Animated.spring(scaleY, { toValue: 1, friction: 9 }),
      ]
      animatesOnly
        ? animatesOnly(animates)
        : Animated.parallel(animates).start()
    } else if (animatesOnly) {
      const animates = [
        Animated.timing(translateX, { toValue: 0, duration: 1 }),
        Animated.timing(translateY, { toValue: 0, duration: 1 }),
        Animated.timing(scaleX, { toValue: 1, duration: 1 }),
        Animated.timing(scaleY, { toValue: 1, duration: 1 }),
      ]
      animatesOnly(animates)
    } else {
      translateX.setValue(0)
      translateY.setValue(0)
      scaleX.setValue(1)
      scaleY.setValue(1)
    }
  }

  render() {
    const { elements, translateX, translateY, scaleX, scaleY } = this.state
    const transform = [{ translateX }, { translateY }, { scaleX }, { scaleY }]
    elements.length ? alert(`render${elements[0].element}`) : {}
    // alert("render"+elements);
    globalTopView = this
    return (
      <View style={[{}, { backgroundColor: Theme.screenColor, flex: 1 }]}>
        <Animated.View style={{ flex: 1, transform }}>
          {this.props.children}
        </Animated.View>
        {elements.map((item, index) => (
          <View
            key={`topView${item.key}`}
            style={styles.overlay}
            pointerEvents="box-none"
          >
            {item.element}
          </View>
        ))}
      </View>
    )
  }
}
let globalTopView
var styles = StyleSheet.create({
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0)',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
})

if (!AppRegistry.registerComponentOld) {
  AppRegistry.registerComponentOld = AppRegistry.registerComponent
}

AppRegistry.registerComponent = function(appKey, componentProvider) {
  class RootElement extends Component {
    render() {
      const Component = componentProvider()
      alert(globalTopView)
      return (
        <TopView>
          <Component {...this.props} />
        </TopView>
      )
    }
  }

  return AppRegistry.registerComponentOld(appKey, () => RootElement)
}
