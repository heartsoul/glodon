'use strict';
import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  TouchableHighlight,
  Image,
} from 'react-native';
import {SegmentedView, Label,Projector,Button,Carousel} from 'teaset';
//import * as USERAPI from "../../login/api+user";
import Swiper from "./mainSwiper";
var Dimensions = require("Dimensions");
var { width, height } = Dimensions.get("window");
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
        <StatusBar barStyle="light-content" translucent={false} backgroundColor="#00baf3" />
      
      {/* <Text> ========================== </Text>
      <TouchableHighlight
            onPress={this._loadUserInfo}
            underlayColor="#0099f3"
            activeOpacity={0.75}
           // style={styles.style_fogotTextView}
          >
            <Text style={styles.style_fogotText}>》》选择租户 </Text>
          </TouchableHighlight>
          <Text> ========================== </Text>
          <Text> ========================== </Text>
          <TouchableHighlight
            onPress={this._loadProjectInfo}
            underlayColor="#0099f3"
            activeOpacity={0.75}
           // style={styles.style_fogotTextView}
          >
            <Text style={styles.style_fogotText}>》》选择项目 </Text>
          </TouchableHighlight>
          <Text> ========================== </Text>
          <Text> ========================== </Text>
          <TouchableHighlight
            onPress={this._loadQuality}
            underlayColor="#0099f3"
            activeOpacity={0.75}
           // style={styles.style_fogotTextView}
          >
            <Text style={styles.style_fogotText}>》》质检清单 </Text>
          </TouchableHighlight>
          <Text> ========================== </Text> */}
          {/* <Projector style={{height: 238}} index={0}>
  {this.renderSlide('#dff0d8')}
  {this.renderSlide('#d9edf7')}
  {this.renderSlide('#fcf8e3')}
  {this.renderSlide('#f2dede')}
</Projector> */}
<Carousel ref={'carousel'} style={{height: 238}} carousel={false} scrollEnabled={false}>
  <Image style={styles.topImage} resizeMode='cover' source={require('./img/1.jpg')} />
  <Image style={styles.topImage} resizeMode='cover' source={require('./img/2.jpg')} />
</Carousel>
          <SegmentedView type='projector' onChange={(index) => this.refs.carousel.scrollToNextPage()}>
  <SegmentedView.Sheet title='质量检查' badge={1}>
    <View style={{alignItems: 'center'}}>
    <View style={{height:20}}/>
    <TouchableHighlight
            onPress={this._loadQuality}
            underlayColor="#0099f3"
            activeOpacity={0.75}
           // style={styles.style_fogotTextView}
          >
            <Text style={styles.style_fogotText}>》》质检清单 </Text>
          </TouchableHighlight>
      <View style={{height:20}}/>
      <Button type={'primary'} size={'md'} onPress={() => alert('Hello world')} style={{height:50}} title="图纸"/>
      <View style={{height:20}}/>
      <Button type={'primary'} size={'md'} style={{height:50}} title="模型"/>
      <View style={{height:20}}/>
      <Button type={'primary'} size={'md'} style={{height:50}} title="质检项目"/>
      <View style={{height:20}}/>
      <TouchableHighlight
            onPress={this._loadUserInfo}
            underlayColor="#0099f3"
            activeOpacity={0.75}
           // style={styles.style_fogotTextView}
          >
            <Text style={styles.style_fogotText}>》》选择租户 </Text>
          </TouchableHighlight>

    </View>
  </SegmentedView.Sheet>
  <SegmentedView.Sheet title='材设进场'>
    <View style={{alignItems: 'center',}}>
    <View style={{height:20}}/>
      <Button type={'primary'} size={'md'} style={{height:50}} title="材设清单"/>
      <View style={{height:20}}/>
      <Button type={'primary'} size={'md'} style={{height:50}} title="模型预览"/>
    </View>
  </SegmentedView.Sheet>
</SegmentedView>
      </View>
      
    );
  }
};

var styles = StyleSheet.create({
  style_fogotText: {
    color:'green',
  },
  topImage:{
    width: width, 
    height: 238,
  }
});