'use strict';
import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  Button,
  SafeAreaView,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions
} from 'react-native';
import {loginOut, uaaLoginOut} from "app-api";
import {NavigationPage} from 'app-3rd/teaset'
import * as CONSTANTS from 'app-api';
import { fail } from 'assert';
var { width, height } = Dimensions.get("window");
var name = '' ;

export default class extends Component {
  
  static navigationOptions = {
    title: '',
    header: null
  };

  constructor() {
      super();
      if(storage.loadUserInfo().accountInfo){
        name = storage.loadUserInfo().accountInfo.name;
    }
  };
  
  componentDidMount = () => {
    // console.log("componentDidMount");
    
  };

  _gotoTenantChoose = () => {
    let navigator = this.props.navigation;
    storage.projectIdVersionId = '';
    // storage.pushNext(navigator, "ChangeProjectPage")
    storage.pushNext(navigator, "TenantPage",{change:true})
  }
  _gotoSetting=()=>{
    let navigator = this.props.navigation;
    storage.pushNext(navigator,'SettingPage');
  }
  _gotoTask=()=>{
      
  }
  _gotoPlan=()=>{

  }
  render() {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" translucent={false} backgroundColor="#00baf3" />
        <ScrollView bounces={false}>
          <View style={{backgroundColor:'#00baf3'}}>
            <Image source={require('app-images/icon_mine_default_header.png')} style={styles.mineAvatar}/>
        
            <Text style={styles.mineName}>{name}</Text>

            <Image source={require('app-images/icon_mine_wave.png')} style={styles.mineWave}/>

          </View>
          <View style={{backgroundColor:'#f5f8f9'}}>
          <View style={{backgroundColor:'#ffffff'}}>
            <MineItemView icon = {require('app-images/icon_mine_permission.png')} title='我的任务' onPress={()=>this._gotoTask()}></MineItemView>
            <View style={styles.mineItemLine}></View>
          
            <MineItemView icon = {require('app-images/icon_mine_plan.png')} title='我的计划' onPress={()=>this._gotoPlan()}></MineItemView>
            <View style={styles.mineItemLine}></View>
            <MineItemView icon = {require('app-images/icon_mine_setting.png')} title='设置' onPress={()=>this._gotoSetting()}></MineItemView>
          </View>
          <View style={{ height: 20 }}></View>
          <View style={{backgroundColor:'#ffffff'}}>
            <View style={styles.mineItemLine}></View>
            <MineItemView icon={require('app-images/icon_setting_change_project.png')} title='切换项目' onPress={() => this._gotoTenantChoose()} ></MineItemView>
          </View>
          <View style={{height:60,width:'100%'}} />
          </View>
        </ScrollView>
        <View style={{height:60,width:'100%'}} />
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
      color:'#325771',
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