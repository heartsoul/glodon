// TeaNavigator.js

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { View, Text } from 'react-native'

import TeaNavigatorScene from './TeaNavigatorScene'

// import {Navigator} from 'react-native-deprecated-custom-components';
// replace NavigatorScene, optimize the effect of the scene
Navigator.SceneConfigs = TeaNavigatorScene

export default class TeaNavigator extends Component {
  static propTypes = {
    rootView: PropTypes.element,
  }

  static defaultProps = {
    rootView: (
      <View
        style={{
          flex: 1,
          backgroundColor: 'white',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Text style={{ fontSize: 36, padding: 10 }}>Teaset</Text>
        <Text style={{ fontSize: 13, padding: 10 }}>
          <Text style={{ fontWeight: 'bold' }}>
            Set TeaNavigator.rootView to show main page.{'\n\n'}
          </Text>
          <Text style={{ color: '#ff7800' }}>class</Text>{' '}
          <Text style={{ color: '#3b5bb5' }}>Application</Text>{' '}
          <Text style={{ color: '#ff7800' }}>extends</Text> Component{' {\n\n'}
          {'  '}
          <Text style={{ color: '#3b5bb5' }}>render</Text>(){' {\n'}
          {'    '}
          <Text style={{ color: '#ff7800' }}>return</Text>{' '}
          {'<TeaNavigator rootView={YourRootView} />;\n'}
          {'  }\n\n'}
          {'}'}
        </Text>
      </View>
    ),
  }

  static SceneConfigs = TeaNavigatorScene

  static childContextTypes = {
    navigator: PropTypes.func,
  }
  _
  getChildContext() {
    return { navigator: () => this.navigator }
  }

  render() {
    const { rootView } = this.props
    return (
      <View style={{ flex: 1, backgroundColor: 'black' }}>
        <Text ref={v => (this.navigator = v)}>Title</Text>
      </View>
    )
  }
}
