'use strict';
import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  Button,
  SafeAreaView
} from 'react-native';
import * as USERAPI from "../../../login/api+user";
export default class extends React.Component {
  static navigationOptions = {
    title: '我',
    headerTintColor:"#FFF",
    headerStyle:{backgroundColor:"#00baf3"}
  };
  constructor() {
      super();
    };
    _logout=()=>{
      global.storage.logout();
      USERAPI.loginOut().then(()=>{
        USERAPI.uaaLoginOut().then(()=>{

        });
        global.storage.gotoLogin();
      });

    }
  render() {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: '#ecf0f1' }]}>
      <StatusBar barStyle="light-content" translucent={false} backgroundColor="#00baf3" />
      <View>
      <Text> 我 </Text>
      <Button title="退出" onPress={()=>{this._logout()}}></Button>
      </View>
      </SafeAreaView>
    );
  }
};

var styles = StyleSheet.create({
    
});