'use strict';
import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  SafeAreaView
} from 'react-native';
export default class extends React.Component {
  static navigationOptions = {
    title: '消息1',
    headerTintColor:"#FFF",
    headerStyle:{backgroundColor:"#00baf3"},
  };
  
  constructor() {
      super();
    };
  render() {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: '#ecf0f1' }]}>
      <View>
      <StatusBar barStyle="light-content" translucent={false} backgroundColor="#00baf3" />
      <Text> 消息 </Text>
      </View>
      </SafeAreaView>
      
    );
  }
};

var styles = StyleSheet.create({
    
});