
import React from 'react';
import { Button, View, Text } from 'react-native';
import { StackNavigator } from 'react-navigation'; // 1.0.0-beta.27
import Guide from './react/common/guide/guide';
import GLDLoginViewController from './react/common/login/login'
import HomePage from './react/common/business/home/home'
import TestPage from './react/common/business/home/test'
import BaseStorage from './react/common/base/store+base'
class HomeScreen extends React.Component {
  render() {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>Home Screen</Text>
        <Button
          title="Go to Details"
          onPress={() => this.props.navigation.navigate('Details')}
        />
      </View>
    );
  }
}

class DetailsScreen extends React.Component {
  render() {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>Details Screen</Text>
        <Button
          title="Go to Details... again"
          onPress={() => this.props.navigation.navigate('Guide')}
        />
        <Button
          title="Go back"
          onPress={() => this.props.navigation.goBack()}
        />
      </View>
    );
  }
}

const RootStack = StackNavigator(
  {
    Home: {
      screen: HomeScreen,
    },
    Details: {
      screen: DetailsScreen,
    },
    Guide: {
      screen: Guide,
    },
    Login: {
      screen: GLDLoginViewController
    },
    HomePage: {
      screen : HomePage
    },
  },
  {
    initialRouteName: global.storage.isGuide() ? 'Guide' : 'Login',
    headerMode:"none",
  }
);

export default class Nav extends React.Component {
  render() {
    return <RootStack />;
  }
}