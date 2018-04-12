// KeyboardSpace.js
// from https://github.com/Andr3wHur5t/react-native-keyboard-spacer

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { StyleSheet, Platform, View } from 'react-native'

export default class KeyboardSpace extends Component {
  render() {
    return (
      <View
        style={[styles.keyboardSpace, { height: this.state.keyboardHeight }]}
      />
    )
  }
}

const styles = StyleSheet.create({
  keyboardSpace: {
    backgroundColor: 'rgba(0, 0, 0, 0)',
    left: 0,
    right: 0,
    bottom: 0,
  },
})
