import React from 'react';
import PropTypes from 'prop-types'
import { StyleSheet, Button, View, Text, Image, TouchableOpacity, NativeModules, Dimensions } from 'react-native';
import GLDDrawerPaneView from "./GLDDrawerPaneView"

export default class LeftBarButtons extends React.Component {
  _onBackPress = (navigation) => {
    if(this.props.needBack) {
      this.props.needBack((needBack)=>{
        if(needBack) {
          storage.pop(navigation,1)
        }
      })
      return;
    }
    storage.pop(navigation,1)
  }

  _onMenuPress = (navigation) => {
    GLDDrawerPaneView.open(this.props.currentItem,navigation);
  }
  
  render = () => {
    return <View style={styles.barItem}>
      <View style={styles.spliteItem} />
      <TouchableOpacity onPress={() => this._onBackPress(this.props.navigation)} >
        <Image style={styles.barItemImage}  source={require('app-images/icon_back_white.png')} />
      </TouchableOpacity>
      {this.props.top === true ? 
      <View style={styles.spliteItem} />
      : null}
       {this.props.top === true ? 
      <TouchableOpacity onPress={() => this._onMenuPress(this.props.navigation)} >
        <Image style={styles.barItemImage} source={require('app-images/icon_quality_check_menu.png')} />
      </TouchableOpacity>
      : null}
    </View>
  }
}

LeftBarButtons.propTypes = {
  currentItem: PropTypes.string.isRequired,
  navigation:PropTypes.any,
  top:PropTypes.any,
  needBack:PropTypes.func, // 是否需要返回，不需要的话在回调函数中返回fasle
}
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