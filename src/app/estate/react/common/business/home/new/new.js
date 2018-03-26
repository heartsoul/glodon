'use strict';
import PropTypes from 'prop-types';
import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  Switch,
  requireNativeComponent,
} from 'react-native';
var Dimensions = require("Dimensions");
var { width, height } = Dimensions.get("window");
import { SegmentedView, ListRow, Label, ActionSheet } from 'teaset';
import ImageChooserView from './ImageChooserView';
import * as UPLOADAPI from "../../service/api/api+upload"; 
var ReactNative = require('ReactNative');

const REF_PHOTO = 'gldPhoto';

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
    // let fileData = [
    //     {"path" : "file:///storage/emulated/0/pic.png", "name" : "pic.png", "length" : 107815},
    //     {"path" : "file:///storage/emulated/0/pic2.png", "name" : "pic2.png", "length" : 61365}
    // ];
    // UPLOADAPI.upLoadFiles(fileData,(code,result)=>{
    //     alert(result)
    // });
    this.refs[REF_PHOTO]._loadFile((files)=>{
        if(files){
            UPLOADAPI.upLoadFiles(files,(code,result)=>{
                alert(result)//上传图片的结果
            });
        }
    });
  }
  constructor() {
      super();
    };
  
  render() {
    var region = {
      latitude: 37.48,
      longitude: -122.16,
      latitudeDelta: 0.1,
      longitudeDelta: 0.1,
    };
    return (
      <View>
        <StatusBar barStyle="light-content" translucent={false} backgroundColor="#00baf3" />
        <ListRow title='检查单位' accessory='indicator' onPress={()=>{}} />
        <ListRow title='施工单位' accessory='indicator' onPress={()=>{}} />
        <ListRow title='责任人' accessory='indicator' onPress={()=>{}} />
      <ImageChooserView style={{ top:0,left:0,width:width,height:100 }} backgroundColor="#00baf3" onChange={()=>alert('收到!')} />
      <ListRow title='质检项目' accessory='indicator' onPress={()=>{}} />
      <ListRow title='关联图纸' accessory='indicator' onPress={()=>{}} />
      <ListRow title='关联模型' accessory='indicator' onPress={()=>{}} />
      <ImageChooserView ref ={ REF_PHOTO } style={{ top:0,left:0,width:width,height:100 }} backgroundColor="#00baf3" onChange={()=>alert('收到!')} />
      
       </View>
      
    );
  }
};

var styles = StyleSheet.create({
    
});