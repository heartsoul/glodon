'use strict';
import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  Button,
  SafeAreaView,
  Image,
  TouchableOpacity 
} from 'react-native';
import {loginOut, uaaLoginOut} from "app-api";
import {NavigationPage} from 'teaset'

var Dimensions = require("Dimensions");
var { width, height } = Dimensions.get("window");
var name = '' ;

export default class extends NavigationPage {
  
  static navigationOptions = {
    title: '',
    headerTintColor:"#FFF",
    headerStyle:{backgroundColor:"#00baf3"}
  };
  constructor() {
      super();
  };
  
  componentDidMount = () => {
    console.log("componentDidMount");
    if(global.storage.userInfo.accountInfo){
        name = global.storage.userInfo.accountInfo.name;
    }
  };

  _logout=()=>{
    global.storage.logout();
    loginOut().then(()=>{
      uaaLoginOut().then(()=>{

      });
      global.storage.gotoLogin();
    });

  }
  _gotoSetting=()=>{
    let navigator = this.props.navigation;
    global.storage.pushNext(navigator,'SettingPage');
  }
  _gotoTask=()=>{
      
  }
  _gotoPlan=()=>{

  }
  render() {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" translucent={false} backgroundColor="#00baf3" />
        <View>
          <View style={{backgroundColor:'#00baf3'}}>
            <Image source={require('app-images/icon_mine_default_header.png')} style={styles.mineAvatar}/>
        
            <Text style={styles.mineName}>{name}</Text>

            <Image source={require('app-images/icon_mine_wave.png')} style={styles.mineWave}/>

          </View>
          <View style={{backgroundColor:'#ffffff'}}>
            <MineItemView icon = {require('app-images/icon_mine_permission.png')} title='我的任务' onPress={()=>this._gotoTask()}></MineItemView>
            <View style={styles.mineItemLine}></View>
          
            <MineItemView icon = {require('app-images/icon_mine_plan.png')} title='我的计划' onPress={()=>this._gotoPlan()}></MineItemView>
            <View style={styles.mineItemLine}></View>
          
            <MineItemView icon = {require('app-images/icon_mine_setting.png')} title='设置' onPress={()=>this._gotoSetting()}></MineItemView>

          </View>

        </View>
      </SafeAreaView>
    );
  }
};

class MineItemView extends Component{
    
    render(){
      return(
        <TouchableOpacity onPress={()=>{ this.props.onPress()}}>
          <View style={styles.mineItemContainer}>
            <Image source={this.props.icon} style={styles.mineItemIcon}/>
            <Text style={styles.mineItemText}>{this.props.title} </Text>
            <Image source={require('app-images/icon_arrow_right_gray.png')} style={styles.mineItemArrow}/>
          </View>
        </TouchableOpacity>

      );
    }

}

var styles = StyleSheet.create({
    container:{
      backgroundColor:'#f5f8f9',
      width:width,
      height:height
    },
    mineAvatar:{
      width:90,
      height:90,
      alignSelf:'center',
      marginTop:7
    },
    mineName:{
      marginTop:7,
      alignSelf:'center',
      fontSize:22,
      color:'#ffffff'
    },
    mineWave:{
      width:width,
      height:37,
      alignSelf:'center',
      marginTop:20
    },

    mineItemContainer:{
      height:50,
      alignItems:'center',
      flexDirection:'row',
      backgroundColor:'#ffffff'
    },
    mineItemIcon:{
      width:24,
      height:24,
      marginLeft:22
    },
    mineItemText:{
      marginLeft:17,
      flex:1,
      fontSize:14,
      color:'#6f899b',
    },
    mineItemArrow:{
      width:5,
      height:12,
      marginRight:20
    },
    mineItemLine:{
      height:1,
      marginLeft:22,
      backgroundColor:'#f7f7f7'
    }
    
});