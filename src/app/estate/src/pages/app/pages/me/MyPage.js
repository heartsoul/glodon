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
import {ToOnlineDialog} from 'app-components';
import WideButton from "../../../app/components/WideButton";

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
  
//切换项目
  _gotoTenantChoose = () => {
    let navigator = this.props.navigation;
    storage.projectIdVersionId = '';
    storage.pushNext(navigator, "ChangeProjectPage")
    // storage.pushNext(navigator, "TenantPage",{change:true})
    // ToOnlineDialog.show(this.props.navigation);
  }
  //到离线管理
  _gotoOfflineManage=()=>{
    let navigator = this.props.navigation;
    storage.pushNext(navigator,'OfflineManagePage');
  }
  //到我的任务
  _gotoTask=()=>{
      
  }
  //到我的计划
  _gotoPlan=()=>{

  }
  //到我的订阅
  _gotoSubscribe=()=>{

  }

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" translucent={false} backgroundColor="#00baf3" />
        <ScrollView bounces={false}>
          <View style={{backgroundColor:'#00baf3',marginBottom:20}}>
            <Image source={require('app-images/icon_mine_default_header.png')} style={styles.mineAvatar}/>
            <Text style={styles.mineName}>{name}</Text>
            <Image source={require('app-images/icon_mine_wave.png')} style={styles.mineWave}/>
          </View>
          <MineItemView icon = {require('app-images/icon_my_offline_manage.png')} title='离线管理' onPress={()=>this._gotoOfflineManage()}></MineItemView>
          <View style={styles.mineItemLine}></View>
          <MineItemView icon = {require('app-images/icon_my_missions.png')} title='我的任务' onPress={()=>this._gotoTask()}></MineItemView>
          <View style={styles.mineItemLine}></View>
          <MineItemView icon = {require('app-images/icon_my_plans.png')} title='我的计划' onPress={()=>this._gotoPlan()}></MineItemView>
          <View style={styles.mineItemLine}></View>
          <MineItemView icon = {require('app-images/icon_my_subscribe.png')} title='我的订阅' onPress={()=>this._gotoSubscribe()}></MineItemView>
          <View style={styles.mineItemLine}></View>
            
          <WideButton text="切换项目" onClick={()=>{this._gotoTenantChoose();}} style={{ marginTop: 50, width: 297,height:40, alignSelf: "center" }} />
            
          <View style={{height:35,width:'100%'}} />
        </ScrollView>
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
      backgroundColor:'#ffffff',
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