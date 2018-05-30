'use strict';
import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  SafeAreaView
} from 'react-native';
import { BarItems, LoadingView } from "app-components";

export default class extends React.Component {

  
  static navigationOptions = {
    headerTitle: <BarItems.TitleBarItem text='订阅'/>,
    headerRight:<View/>,
  };
  constructor() {
    super();
  };
render() {
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: '#ecf0f1' }]}>
    <StatusBar barStyle="light-content" translucent={false} backgroundColor="#00baf3" />
    <View style={{flex:1,alignItems:'center',justifyContent:'center',flexDirection:'column'}}>
    <Text style={styles.text}> 敬请期待 </Text>
    </View>
    </SafeAreaView>
    
  );
}
};

var styles = StyleSheet.create({
  container:{
    flex:1,
  },
  text:{
    fontSize:18,
    color:'gray'
  },
});