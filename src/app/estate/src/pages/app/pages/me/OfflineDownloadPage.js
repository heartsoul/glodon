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

import {CircleProgressBar} from 'app-components'

var { width, height } = Dimensions.get("window");
//离线数据下载
export default class extends Component {
  
  static navigationOptions = {
    title: '离线数据下载',

  };

  constructor() {
      super();
      this.state ={
        showAll:true,
        showLoaded:false,
        showLoading:false,
      }
  };
  
//进入离线数据下载
  _gotoDownloadPage = () => {
    let navigator = this.props.navigation;
    storage.pushNext(navigator, "ChangeProjectPage")
    // storage.pushNext(navigator, "TenantPage",{change:true})
    // ToOnlineDialog.show(this.props.navigation);
  }

  //点击全部
  _clickAll=()=>{
    this.setState((pre)=>{
      return {
        ...pre,
        showAll:true,
        showLoaded:false,
        showLoading:false,
      };
    })
  }
  //点击已下载
  _clickLoaded=()=>{
    this.setState((pre)=>{
      return {
        ...pre,
        showAll:false,
        showLoaded:true,
        showLoading:false,
      };
    })
  }
  //点击下载中
  _clickLoading=()=>{
    this.setState((pre)=>{
      return {
        ...pre,
        showAll:false,
        showLoaded:false,
        showLoading:true,
      };
    })
  }

  //全部 的view
  allView = null;
  //已下载的view
  loadedView = null;
  //下载中的view
  loadingView = null;
  _getContentView=()=>{
    if(this.state.showAll){
      if(this.allView==null){
        this.allView = (<AllView />);
      }
      return this.allView;
    }
    if(this.state.showLoaded){
      if(this.loadedView==null){
        this.loadedView = (<LoadedView />);
      }
      return this.loadedView;
    }

    if(this.state.showLoading){
      if(this.loadingView==null){
        this.loadingView=(<LoadingView />);
      }
      return this.loadingView;
    }
    return null;
  }


  render() {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" translucent={false} backgroundColor="#00baf3" />
        <View style={{flexDirection:'row',backgroundColor:'#ffffff'}}>
          <TopItemView title={'全部'} isShowLine={this.state.showAll} num={0} onPress={this._clickAll} />
          <TopItemView title={'已下载'} isShowLine={this.state.showLoaded} num={3355} onPress={this._clickLoaded} />
          <TopItemView title={'下载中'} isShowLine={this.state.showLoading} num={33} onPress={this._clickLoading} />
        </View>
        <View style={{height:10}}></View>
        {
          this._getContentView()
        }
      </SafeAreaView>
    );
  }
};

//全部-内容页面
class AllView extends Component{

  //点击质检清单
  _clickQuality=()=>{

  }
  //点击材设
  _clickEquipment=()=>{

  }
  //点击模型
  _clickModel=()=>{

  }
  //点击图纸
  _clickBlueprint=()=>{

  }

 

  render(){
    return (
      <View style={{backgroundColor:'#f9f9f9'}} >
        <MineItemView icon = {require('app-images/home/icon_main_subscribe_selected.png')} title='质检清单' onPress={()=>this._clickQuality()}></MineItemView>
        <View style={styles.mineItemLine}></View>
        <MineItemView icon = {require('app-images/icon_offline_download_equipment.png')} title='材设进场清单' onPress={()=>this._clickEquipment()}></MineItemView>
        <View style={styles.mineItemLine}></View>
        <MineItemView icon = {require('app-images/icon_offline_download_model.png')} title='模型' onPress={()=>this._clickModel()}></MineItemView>
        <View style={styles.mineItemLine}></View>
        <MineItemView icon = {require('app-images/icon_offline_download_blueprint.png')} title='图纸' onPress={()=>this._clickBlueprint()}></MineItemView>
        <View style={{height:10}}></View>
        <BasicDataItemView icon = {require('app-images/icon_offline_download_basic.png')} title='基础数据包' ></BasicDataItemView>
      </View>
    );
  }
}


//已下载-内容页面
class LoadedView extends Component{

  //点击质检清单
  _clickQuality=()=>{

  }
  //点击材设
  _clickEquipment=()=>{

  }
  //点击模型
  _clickModel=()=>{

  }
  //点击图纸
  _clickBlueprint=()=>{

  }

 //基础数据包是否已下载
 _showBasicView=()=>{
   let isShow = true;
   if(isShow){
     return (
      <BasicDataItemView icon = {require('app-images/icon_offline_download_basic.png')} title='基础数据包' totalNum={55} progress={5} ></BasicDataItemView>
     );
   }
   return null;
 }

  render(){
    return (
      <View style={{backgroundColor:'#f9f9f9'}} >
        <MineItemView icon = {require('app-images/home/icon_main_subscribe_selected.png')} title='质检清单' onPress={()=>this._clickQuality()}></MineItemView>
        <View style={styles.mineItemLine}></View>
        <MineItemView icon = {require('app-images/icon_offline_download_equipment.png')} title='材设进场清单' onPress={()=>this._clickEquipment()}></MineItemView>
        <View style={styles.mineItemLine}></View>
        <MineItemView icon = {require('app-images/icon_offline_download_model.png')} title='模型' onPress={()=>this._clickModel()}></MineItemView>
        <View style={styles.mineItemLine}></View>
        <MineItemView icon = {require('app-images/icon_offline_download_blueprint.png')} title='图纸' onPress={()=>this._clickBlueprint()}></MineItemView>
        <View style={{height:10}}></View>
        {
          this._showBasicView()
        }
      </View>
    );
  }
}


//下载中-内容页面
class LoadingView extends Component{
  render(){
    return (
      <Text >ssssss</Text>
    );
  }
}

//横条的item   全部   已下载   下载中
class TopItemView extends Component{
    
  //title
  _showTitle=()=>{
    let isShowLine = this.props.isShowLine;
    if(isShowLine){
      return (
        <Text style={{fontSize:14,color:'#00baf3',marginTop:15}}>{this.props.title} </Text>
      );
    }
    return (
      <Text style={{fontSize:14,color:'#6f899b',marginTop:15}}>{this.props.title} </Text>
    );
  }
  //蓝色线
  _showLine=()=>{
    let isShowLine = this.props.isShowLine;
    if(isShowLine){
      return (
        <View style={{width:42,height:2,backgroundColor:'#00baf3',marginTop:6}} />
      );
    }
    return (
      <View style={{width:42,height:2,backgroundColor:'#ffffff',marginTop:6}} />
    );
  }

  //红点数字
  _showNum =()=>{
    let num = this.props.num;
    if(num>0){
      let str =' '+num+' ';
      if(num>999){
        num = 999
        str = ' '+num+'+ ';
      }
      return (
        <Text style={{fontSize:10,color:'#ffffff',borderRadius:27,backgroundColor:'#ff460d',height:16,marginTop:16}}>{str}</Text>
      );
    }
    return null;
  }
  render(){
    
    return(
      <TouchableOpacity onPress={()=>{ this.props.onPress()}}>
        <View style={{width:width/3,height:51,flexDirection:'row',justifyContent:'center'}}>
          <View style={{alignItems:'center',justifyContent:'flex-end'}}>
            {
              this._showTitle()
            }
            {
              this._showLine()
            }
         </View>
         {
           this._showNum()
         }
        </View>
      </TouchableOpacity>

    );
  }

}


//内容横条   质检清单   材设进场  模型   图纸
class MineItemView extends Component{
  // <MineItemView icon = {require('app-images/icon_offline_manage_download.png')} title='离线数据下载' onPress={()=>this._gotoDownloadPage()}></MineItemView>
  // <View style={styles.mineItemLine}></View>
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

//基础数据包item
class BasicDataItemView extends Component{
  // <MineItemView icon = {require('app-images/icon_offline_manage_download.png')} title='离线数据下载' onPress={()=>this._gotoDownloadPage()}></MineItemView>
  // <View style={styles.mineItemLine}></View>
  _startDownload =()=>{
    console.log('startDownload')
  }
  _stopDownload =()=>{
    console.log('_stopDownload')
  }
    render(){
      return(
        <TouchableOpacity onPress={()=>{ this.props.onPress()}}>
          <View style={styles.mineItemContainer}>
            <Image source={this.props.icon} style={styles.mineItemIcon}/>
            <Text style={styles.mineItemText}>{this.props.title} </Text>
            <CircleProgressBar startDownload={this._startDownload} stopDownload={this._stopDownload} progress={this.props.progress} totalNum={this.props.totalNum}/>
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
      marginLeft:15
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
      marginRight:17
    },
    mineItemLine:{
      height:1,
      marginLeft:22,
      backgroundColor:'#f7f7f7'
    }
    
});