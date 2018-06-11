'use strict';
import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  SafeAreaView,
  Dimensions
} from 'react-native';
import { BarItems, LoadingView } from "app-components";
import { WebView } from "app-3rd";
var {
  height: deviceHeight,
  width: deviceWidth
} = Dimensions.get('window');
export default class extends React.Component {

  static navigationOptions = {
    headerTitle: <BarItems.TitleBarItem text='关于'/>,
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
      <Text style={styles.text}> BIM协同 v1.0 </Text>
      {/* <WebView bounces={false}
                        ref="webview"
                        onNavigationStateChange={() => this.onNavigationStateChange}
                        scalesPageToFit={true}
                        javaScriptEnabled={true}
                        domStorageEnabled={false}
                        onLoadEnd={() => { }}
                        source={{ uri: 'http://10.1.71.84/' }}
                        style={{ width: deviceWidth, height: deviceHeight }}>
                    </WebView> */}
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