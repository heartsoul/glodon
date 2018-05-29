'use strict';
import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  SafeAreaView,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions
} from 'react-native';
import WideButton from "../../../app/components/WideButton";
import OfflineStateUtil from '../../../../common/utils/OfflineStateUtil'

var { width, height } = Dimensions.get("window");
var name = '离线管理支持您在没有网络状态下完成查阅单据、浏览模型、图纸，编辑业务单据等基本业务操作。为了便于您更好的离线体验，请选择下列必备的数据预先下载至您的手机上。' ;
//离线管理
export default class extends Component {
  
  static navigationOptions = {
    title: '离线管理',

  };

  constructor() {
      super();
      
  };
  
//进入离线数据下载
  _gotoDownloadPage = () => {
    let navigator = this.props.navigation;
    storage.pushNext(navigator, "ChangeProjectPage")
    // storage.pushNext(navigator, "TenantPage",{change:true})
    // ToOnlineDialog.show(this.props.navigation);
  }
  //离线进程跟踪
  _gotoOfflineManage=()=>{
    // let navigator = this.props.navigation;
    // storage.pushNext(navigator,'SettingPage');
  }
  //进入离线模式
  _gotoOfflineMode=()=>{
    OfflineStateUtil.toOffLine();
    storage.gotoMainPage(this.props.navigation);
  }
 

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" translucent={false} backgroundColor="#00baf3" />
        <ScrollView bounces={false} >
          <View style={{backgroundColor:'#ffffff'}} >
            <Image source={require('app-images/icon_offline_manage_bg.png')} style={styles.mineAvatar}/>
            <Text style={styles.mineName}>{name}</Text>
          </View>
          <View style={{backgroundColor:'#F9F9F9',height:10,flex:1}} />
          <MineItemView icon = {require('app-images/icon_offline_manage_download.png')} title='离线数据下载' onPress={()=>this._gotoDownloadPage()}></MineItemView>
          <View style={styles.mineItemLine}></View>
          <MineItemView icon = {require('app-images/icon_offline_manage_trace.png')} title='离线进程跟踪' onPress={()=>this._gotoOfflineManage()}></MineItemView>
          <View style={styles.mineItemLine}></View>
          
           <WideButton text="进入离线模式" onClick={()=>{this._gotoOfflineMode();}} style={{ marginTop: 50, width: 297,height:40, alignSelf: "center" }} />
          
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
      backgroundColor:'#F9F9F9',
      width:width,
      height:height
    },
    mineAvatar:{
      width:308,
      height:115,
      alignSelf:'center',
      marginTop:32
    },
    mineName:{
      marginTop:13,
      alignSelf:'center',
      fontSize:13,
      color:'#597385',
      marginLeft:46,
      marginRight:46,
      marginBottom:20
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
      width:30,
      height:30,
      marginLeft:10
    },
    mineItemText:{
      marginLeft:10,
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