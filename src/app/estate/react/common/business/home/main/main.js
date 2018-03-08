'use strict';
import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  TouchableHighlight
  
} from 'react-native';

//import * as USERAPI from "../../login/api+user";

export default class extends React.Component {
  static navigationOptions = {
    title: '首页',
    headerTintColor:"#FFF",
    headerStyle:{backgroundColor:"#00baf3"},
    tabBarVisible:true
  };
  constructor() {
      super();
    };
    _loadUserInfo = () => {
      let navigator = this.props.navigation;
        
          if (navigator) {
            navigator.navigate("TenantList");
          }
    }
    _loadProjectInfo = () => {
      let navigator = this.props.navigation;
        
          if (navigator) {
            navigator.navigate("ProjectList");
          }
    }
    _loadQuality = () => {
      let navigator = this.props.navigation;
        
          if (navigator) {
            navigator.navigate("QualityMain");
          }
    }
    

    componentDidMount() {
      //请求数据
      this.fetchData();
  }
  fetchData = ()=> {
    console.log(global.storage.loadTenant);
    console.log(global.storage.loadProject);

    if(global.storage.loadTenant && global.storage.loadProject) {

    } else {
      // this._loadUserInfo();
    }
    
  }
  render() {
    return (
      <View>
        <StatusBar
          barStyle="light-content"
          backgroundColor="#ecf0f1"
        />
      <Text> home </Text>
      <TouchableHighlight
            onPress={this._loadUserInfo}
            underlayColor="#0099f3"
            activeOpacity={0.75}
           // style={styles.style_fogotTextView}
          >
            <Text style={styles.style_fogotText}>选择租户 </Text>
          </TouchableHighlight>
          <TouchableHighlight
            onPress={this._loadProjectInfo}
            underlayColor="#0099f3"
            activeOpacity={0.75}
           // style={styles.style_fogotTextView}
          >
            <Text style={styles.style_fogotText}>选择项目 </Text>
          </TouchableHighlight>
          <TouchableHighlight
            onPress={this._loadQuality}
            underlayColor="#0099f3"
            activeOpacity={0.75}
           // style={styles.style_fogotTextView}
          >
            <Text style={styles.style_fogotText}>质检清单 </Text>
          </TouchableHighlight>

      </View>
      
    );
  }
};

var styles = StyleSheet.create({
    
});