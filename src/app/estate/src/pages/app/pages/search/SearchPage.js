'use strict';
import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  SafeAreaView,
  Dimensions
} from 'react-native';
import { SearchBar } from 'antd-mobile';
var { width, height } = Dimensions.get("window");

import SearchBarStyle from 'antd-mobile/lib/search-bar/style/index.native';
const ss =  {
  ...SearchBarStyle,
  inputWrapper:{
    ...SearchBarStyle.inputWrapper,
    backgroundColor:"#00baf3"
  }
}

export default class extends React.Component {
  static navigationOptions = {
    headerStyle:{marginLeft:-100,marginRight:-100,backgroundColor:"#efeff4"},
    headerLeft: <View ></View>,
    headerRight: <View></View>,
    headerTitle: <View style={{flex:1,alignItems:"center"}}>
    <View style={{width:width,alignItems:"center"}}>
      <SearchBar style={StyleSheet.create(ss).inputWrapper} placeholder="Search" />
    </View>
    </View>,
  };

  constructor() {
    super();
    // variables.search_bar_fill = "#00baf3";

  };
  componentDidMount() {
    console.log('====================================');
    console.log(SearchBarStyle.wrapper);
    console.log(StyleSheet.create(ss));
    console.log('====================================');
  }
  render() {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: '#ecf0f1' }]}>
        <StatusBar barStyle="light-content" translucent={false} backgroundColor="#00baf3" />
        <View style={{position:"absolute",marginTop:-44}}>
          <SearchBar placeholder="Search" maxLength={8} />

        </View>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
          <Text style={styles.text}> 敬请期待 </Text>
        </View>
      </SafeAreaView>

    );
  }
};

var styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  text: {
    fontSize: 18,
    color: 'gray'
  },
});