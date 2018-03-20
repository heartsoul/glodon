
import React from 'react';
import { Button, View, Text } from 'react-native';
import { StackNavigator } from 'react-navigation'; // 1.0.0-beta.27
// import Guide from './react/common/guide/guide';
// import GLDLoginViewController from './react/common/login/login'
// import MainPage from './react/common/business/home/main'
// import TestPage from './react/common/business/home/test'
// import BaseStorage from './react/common/base/store+base'
// import ChoosePage from './react/common/business/navigation/chooseHome'
import * as GLD from './react/common/components'
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

// LoginPage,MainPage,BaseStorage,ChoosePage,TenantPage,ProjectPage,GuidePage,QualityMainPage
const RootStack = StackNavigator(
  {
    ChoosePage: {
      screen: GLD.TenantPage,
    },
    Guide: {
      screen: GLD.GuidePage,
    },
    Login: {
      screen: GLD.LoginPage
    },
    MainPage: {
      screen : GLD.MainPage
    },
    ProjectPage: {
      screen : GLD.ProjectPage
    },
    TenantPage: {
      screen : GLD.TenantPage
    },
    QualityMainPage: {
      screen : GLD.QualityMainPage
    },
    QualityMainPage: {
      screen : GLD.QualityMainPage
    },
    WebPage: {
      screen : GLD.WebPage
    },
    BimFileChooserPage: {
      screen : GLD.BimFileChooserPage
    },
    NewPage: {
      screen : GLD.NewPage
    },
  },
  {
    initialRouteName: global.storage.isGuide() ? 'Guide' : 'Login',
    // initialRouteName: 'MainPage',
    // headerMode:"none",
  },
);

export default class Nav extends React.Component {
  
  render() {
    return <RootStack />;
  }
}