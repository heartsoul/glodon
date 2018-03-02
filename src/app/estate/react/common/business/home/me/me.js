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
    title: '我',
  };
  constructor() {
      super();
    };
  render() {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: '#ecf0f1' }]}>
      <StatusBar
          barStyle="light-content"
          backgroundColor="#ecf0f1"
        />
      <View>
      <Text> 我 </Text>
      </View>
      </SafeAreaView>
    );
  }
};

var styles = StyleSheet.create({
    
});