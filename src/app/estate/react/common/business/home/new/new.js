'use strict';
import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  StatusBar
} from 'react-native';
export default class extends React.Component {
  static navigationOptions = {
    title: '我',
    headerTintColor:"#FFF",
    headerStyle:{backgroundColor:"#00baf3"}
  };
  constructor() {
      super();
    };
  render() {
    return (
      <View>
        <StatusBar barStyle="light-content" translucent={false} backgroundColor="#00baf3" />
      <Text> 新建 </Text>
      </View>
      
    );
  }
};

var styles = StyleSheet.create({
    
});