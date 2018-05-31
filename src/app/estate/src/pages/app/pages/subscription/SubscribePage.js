'use strict';
import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  SafeAreaView
} from 'react-native';
import { BarItems, LoadingView, NoDataView } from "app-components";

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
    <NoDataView text="暂无数据" image={NoDataView.NoDataImage} />
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