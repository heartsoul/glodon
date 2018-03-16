'use strict';
import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  TouchableHighlight,
  Image,
} from 'react-native';
import { SegmentedBar, Label, SegmentedView, Button, Carousel } from 'teaset';
//import * as USERAPI from "../../login/api+user";
import { NavigationPage } from 'teaset'
var Dimensions = require("Dimensions");
var { width, height } = Dimensions.get("window");
export default class extends NavigationPage {
  static navigationOptions = {
    title: '首页',
    headerTintColor: "#FFF",
    headerStyle: { backgroundColor: "#00baf3" },
    tabBarVisible: true
  };
  constructor() {
    super();
  };
  _loadUserInfo = () => {
     let navigator = this.props.navigation;
    // if (navigator) {
    //   navigator.navigate("TenantList");
    // }
    global.storage.pushNext(navigator,"TenantPage")
  }
  _loadProjectInfo = () => {
    let navigator = this.props.navigation;

    // if (navigator) {
    //   navigator.navigate("ProjectList");
    // }
    global.storage.pushNext(navigator,"ProjectPage");
  }
  _loadQuality = () => {
    let navigator = this.props.navigation;

    // if (navigator) {
    //   navigator.navigate("QualityMain");
    // }
    global.storage.projectIdVersionId = '';
    global.storage.fileId = '';
    global.storage.bimToken = {};

    global.storage.pushNext(navigator,"QualityMainPage")
   
  }

  _fileChoose = () => {
    let navigator = this.props.navigation;

    // if (navigator) {
    //   navigator.navigate("QualityMain");
    // }
    global.storage.projectIdVersionId = '';
    global.storage.pushNext(navigator,"BimFileChooserPage");
  }

  

  componentDidMount() {
    //请求数据
    this.fetchData();
  }
  fetchData = () => {
    console.log(global.storage.loadTenant);
    console.log(global.storage.loadProject);

    if (global.storage.loadTenant && global.storage.loadProject) {

    } else {
      // this._loadUserInfo();
    }

  }
  scrollToPage = (index) => {
    if(parseInt(''+index) != parseInt(''+this.refs.carousel.activeIndex)) {
      this.refs.carousel.scrollToPage(index);
    }
  }
  render() {
    return (
      <View>
        <StatusBar barStyle="light-content" translucent={false} backgroundColor="#00baf3" />
        <Carousel ref={'carousel'} style={{ height: 238 }} carousel={false} scrollEnabled={false}>
          <Image style={styles.topImage} resizeMode='cover' source={require('./img/1.jpg')} />
          <Image style={styles.topImage} resizeMode='cover' source={require('./img/2.jpg')} />
        </Carousel>
        <SegmentedView style={{flex: 0,height:400}} onChange={(index) => { this.scrollToPage(index) }} bounces={true} type={'carousel'}>
          <SegmentedView.Sheet title='质量检查'>
          <View style={styles.tabContent}>
            <Button type={'primary'} size={'md'} onPress={() => this._loadQuality()} style={{ height: 50, marginBottom:40}} title="质检清单" />
            <View style={styles.spliteItem} />
            <Button type={'primary'} size={'md'} onPress={() => this._fileChoose()} style={{ height: 50 }} title="图纸" />
            <View style={styles.spliteItem} />
            <Button type={'primary'} size={'md'} style={{ height: 50 }} title="模型" />
            <View style={styles.spliteItem} />
            <Button type={'primary'} size={'md'} style={{ height: 50 }} title="质检项目" />
            <View style={styles.spliteItem} />
            <Button type={'primary'} size={'md'} onPress={() => this._loadUserInfo()} style={{ height: 50 }} title="选择租户" />
          </View>
          </SegmentedView.Sheet>
          <SegmentedView.Sheet title='材设进场'>
          <View style={styles.tabContent}>
            <Button type={'primary'} size={'md'} style={{ height: 50 }} title="模型" />
            <View style={styles.spliteItem} />
            <Button type={'primary'} size={'md'} style={{ height: 50 }} title="质检项目" />
          </View>
          </SegmentedView.Sheet>
        </SegmentedView>
        {/* <SegmentedBar onChange={(index) => { this.scrollToPage(index) }} justifyItem='scrollable'>
          <SegmentedBar.Item title='质量检查' />
          <SegmentedBar.Item title='材设进场' />
        </SegmentedBar>
        <Carousel ref={'carouselContent'} style={{ height: 238 }} onChange={(index) => this.scrollToPage(index)} carousel={false} scrollEnabled={false}>
          <View style={styles.tabContent}>
            <Button type={'primary'} size={'md'} onPress={() => this._loadQuality()} style={{ height: 50 }} title="质检清单" />
            <View style={styles.spliteItem} />
            <Button type={'primary'} size={'md'} onPress={() => this._loadQuality()} style={{ height: 50 }} title="图纸" />
            <View style={styles.spliteItem} />
            <Button type={'primary'} size={'md'} style={{ height: 50 }} title="模型" />
            <View style={styles.spliteItem} />
            <Button type={'primary'} size={'md'} style={{ height: 50 }} title="质检项目" />
            <View style={styles.spliteItem} />
            <Button type={'primary'} size={'md'} onPress={() => this._loadUserInfo()} style={{ height: 50 }} title="选择租户" />
          </View>
          <View style={styles.tabContent}>
            <Button type={'primary'} size={'md'} style={{ height: 50 }} title="模型" />
            <View style={styles.spliteItem} />
            <Button type={'primary'} size={'md'} style={{ height: 50 }} title="质检项目" />
          </View>
        </Carousel> */}
      </View>

    );
  }
};

var styles = StyleSheet.create({
  style_fogotText: {
    color: 'green',
  },
  topImage: {
    width: width,
    height: 238,
  },
  spliteItem: {
    width: 10,
  },
  tabContent: {
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent:'flex-start',
    // flex: 1,
    marginLeft: 20,
    marginTop: 40,
    marginRight: 20,
    marginBottom: 40
  },

});