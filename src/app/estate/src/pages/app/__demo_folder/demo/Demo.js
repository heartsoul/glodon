'use strict';
import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  StatusBar,
} from 'react-native';
import DemoView from './DemoView';
export default class extends React.Component {
  static navigationOptions = ({navigation, screenProps}) => ({
    title: 'Demo',
  });
  constructor() {
      super();
    };
  
  render() {
    return (
      <View>
        <StatusBar barStyle="light-content" translucent={false} backgroundColor="#00baf3" />
      <Text> 自定义组件使用demo  </Text>
        <DemoView style={{ top:10,left:20,width:200,height:30 }} backgroundColor="#00baf3" onChange={()=>alert('收到')} />
      </View>
      
    );
  }
};

var styles = StyleSheet.create({
    
});