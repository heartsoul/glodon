import React from 'react';
import { StyleSheet, Button, View, Text, Image, TouchableOpacity, Dimensions } from 'react-native';
import { withNavigation } from 'app-3rd/react-navigation';
import * as API from 'app-api'
import { BarItems } from "app-components"
import { BimFileEntry, AuthorityManager } from 'app-entry';

import EquipmentList from './equipmentList'

class RightBarButtons extends React.Component {
  _onSearchPress = (navigation) => {
    // console.log(navigation);
    navigation.navigate("EquipmentSearchPage")
  }
  _onNewPress = (navigation) => {
    AuthorityManager.isEquipmentCreate() ? (storage.pushNext(navigation, "EquipmentDetailPage")) : null;
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
    title: '材设清单',
    headerRight: (
      <RightBarButtons navigation={navigation} />
    ),
    headerLeft: (
      <BarItems top={navigation.getParam('top')} navigation={navigation} currentItem={API.APP_EQUIPMENT} />
    ),
  });
  render() {
    return <EquipmentList navigation={this.props.navigation} />;
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