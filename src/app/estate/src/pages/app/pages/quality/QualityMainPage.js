import React from 'react';
import { StyleSheet, Button, View, Text, Image, TouchableOpacity, Dimensions } from 'react-native';
import { withNavigation } from 'app-3rd/react-navigation';
import * as API from 'app-api'
import { LeftBarButtons } from "app-components"
import { BimFileEntry, AuthorityManager } from 'app-entry';

import QualityList from './qualityList'

class RightBarButtons extends React.Component {
  _onSearchPress = (navigation) => {
    // console.log(navigation);
    navigation.navigate("SearchPage")
  }
  _onNewPress = (navigation) => {
    AuthorityManager.isQualityCreate() ? BimFileEntry.newSelect(navigation) : null;
  }
  render() {
    return <View style={{
      alignItems: 'center',
      flexDirection: 'row',
      flexWrap: 'nowrap',
      justifyContent: 'flex-end',
      width: 70,
    }}>
      <TouchableOpacity onPress={() => this._onSearchPress(this.props.navigation)} >
        <Image style={styles.barItemImage} source={require('app-images/icon_search_white.png')} />
      </TouchableOpacity>
      <View style={styles.spliteItem} />
      {
        AuthorityManager.isQualityCreate() ?
          <TouchableOpacity onPress={() => this._onNewPress(this.props.navigation)} >
            <Image style={styles.barItemImage} source={require('app-images/icon_camera_white.png')} />
          </TouchableOpacity> : null
      }
      {
        AuthorityManager.isQualityCreate() ? <View style={styles.spliteItem} /> : null
      }
    </View>
  }
}
export default class extends React.Component {
  static navigationOptions = ({ navigation, screenProps }) => ({
    title: '质检清单',
    // gesturesEnabled:false,
    headerRight: (
      <RightBarButtons navigation={navigation} />
    ),
    headerLeft: (
      <LeftBarButtons top={navigation.getParam('top')} navigation={navigation} currentItem={API.APP_QUALITY} />
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