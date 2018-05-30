import React from 'react';
import { StyleSheet, Button, View, Text, Image, TouchableOpacity, Dimensions } from 'react-native';
import { withNavigation } from 'app-3rd/react-navigation';
import * as API from 'app-api'
import { BarItems } from "app-components"
import { BimFileEntry, AuthorityManager } from 'app-entry';

import QualityList from './qualityList'

class RightBarButtons extends React.Component {
  _onSearchPress = (navigation) => {
    // console.log(navigation);
    navigation.navigate("QualitySearchPage")
  }
  _onNewPress = (navigation) => {
    AuthorityManager.isQualityCreate() ? BimFileEntry.newSelect(navigation) : null;
  }
  render() {
    return <BarItems navigation={this.props.navigation}>
    <BarItems.RightBarItem navigation={this.props.navigation} imageStyle={{width:24,height:24}} imageSource={require('app-images/icon_search_white.png')} navigation={this.props.navigation}
      onPress={(navigation) => this._onSearchPress(this.props.navigation)} />
  {
    AuthorityManager.isQualityCreate() ?
      <BarItems.RightBarItem  navigation={this.props.navigation} imageStyle={{width:24,height:24}} imageSource={require('app-images/icon_camera_white.png')} navigation={this.props.navigation}
        onPress={(navigation) => this._onNewPress(this.props.navigation)} /> : null
  }
</BarItems>
  }
}
export default class extends React.Component {
  static navigationOptions = ({ navigation, screenProps }) => ({
    headerTitle: <BarItems.TitleBarItem text='质检清单'/>,
    // gesturesEnabled:false,
    headerRight: (
      <RightBarButtons navigation={navigation} />
    ),
    headerLeft: (
      <BarItems top={navigation.getParam('top')} navigation={navigation} currentItem={API.APP_QUALITY} />
    ),
  });
  render() {
    return <QualityList navigation={this.props.navigation} />;
  }
};

const styles = StyleSheet.create({
  barItem: {
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'nowrap',
    justifyContent: 'flex-start',
    width: 70,
  },
  barItemImage: {
    width: 24,
    height: 24,
    resizeMode:'contain'
  },
  spliteItem: {
    width: 10,
  },
});