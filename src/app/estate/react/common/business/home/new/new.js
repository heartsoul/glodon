'use strict';
import PropTypes from 'prop-types';
import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  Switch,
  Image,
  requireNativeComponent,
} from 'react-native';
var Dimensions = require("Dimensions");
var { width, height } = Dimensions.get("window");
import { SegmentedView, ListRow, Label, ActionSheet } from 'teaset';
import ImageChooserView from './ImageChooserView';

export default class extends React.Component {
  static navigationOptions = ({navigation, screenProps}) => ({
    title: '新建',
    headerTintColor:"#FFF",
    headerStyle:{backgroundColor:"#00baf3"},
    headerRight:(  
      <Text  onPress={()=>navigation.state.params.rightNavigatePress()} style={{marginRight:20, color:'#FFFFFF' , width:60, textAlign:"right"}} >  
          提交   
      </Text>  
    ),
    // headerLeft:(  
    //   <Text  onPress={()=>navigation.goBack()} style={{marginLeft:20, color:'#FFFFFF' , width:60, textAlign:"left"}} >  
    //       返回   
    //   </Text>  
    // )
  });
  componentDidMount=()=> {
    console.log(this.props.navigation.state.params);
    //请求数据
     this.props.navigation.setParams({rightNavigatePress:this._rightAction }) 
  }
  
  _rightAction = ()=> {
    console.log("执行_rightAction");
  }
  _onLoadFile = (files)=> {
    console.log("执行_onLoadFile");
  }

  constructor() {
      super();
    };
  
  render = ()=> {
    var region = {
      latitude: 37.48,
      longitude: -122.16,
      latitudeDelta: 0.1,
      longitudeDelta: 0.1,
    };
    var imageFile =  'file:///Users/glodon/Library/Developer/CoreSimulator/Devices/9EC654E0-7B20-41CC-8485-72EE206DB389/data/Containers/Data/Application/AB54A5A2-106F-4484-AEAB-C25A8C5316B9/Library/Caches/file/com.hackemist.SDWebImageCache.file/a2040c4d4a34d112fca87f7d22a83b5e.data';
    return (
      <View>
        <StatusBar barStyle="light-content" translucent={false} backgroundColor="#00baf3" />
        <ListRow title='检查单位' accessory='indicator' onPress={()=>{}} />
        <ListRow title='施工单位' accessory='indicator' onPress={()=>{}} />
        <ListRow title='责任人' accessory='indicator' onPress={()=>{}} />
      <ImageChooserView style={{ top:0,left:0,width:width,height:100 }} backgroundColor="#00baf3" onChange={()=>{}} onLoadFile={(files)=>{this._onLoadFile(files)}} />
      <ListRow title='质检项目' accessory='indicator' onPress={()=>{}} />
      <ListRow title='关联图纸' accessory='indicator' onPress={()=>{}} />
      <ListRow title='关联模型' accessory='indicator' onPress={()=>{}} />
      <Image source={{uri:imageFile}} style={{width:40,height:40}} />
       </View>
      
    );
  }
};

var styles = StyleSheet.create({
    
});