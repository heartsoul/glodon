'use strict';
import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  TouchableHighlight,
  Image,
  ImageBackground,
  Dimensions,
} from 'react-native';
import ModelItemView from './ModelItemView'
import { NavigationPage,SegmentedBar, Label, SegmentedView, Button, Carousel } from 'app-3rd/teaset';

var { width, height } = Dimensions.get("window");
export default class extends NavigationPage {
  constructor() {
    super();
  };
  _loadUserInfo = () => {
     let navigator = this.props.navigation;
    // if (navigator) {
    //   navigator.navigate("TenantList");
    // }
    storage.pushNext(navigator,"TenantPage")
  }
  _loadProjectInfo = () => {
    let navigator = this.props.navigation;

    // if (navigator) {
    //   navigator.navigate("ProjectList");
    // }
    storage.pushNext(navigator,"ProjectPage");
  }
  _loadQualityForm = () => {
    let navigator = this.props.navigation;
    storage.projectIdVersionId = '';
    storage.fileId = '';
    storage.bimToken = {};

    storage.pushNext(navigator,"QualityMainPage")
   
  }
  _loadEquipmentForm = () => {
    let navigator = this.props.navigation;
    storage.projectIdVersionId = '';
    storage.fileId = '';
    storage.bimToken = {};

    storage.pushNext(navigator,"EquipmentMainPage")
   
  }

  _fileChoose = () => {
    let navigator = this.props.navigation;

    storage.projectIdVersionId = '';
    storage.pushNext(navigator,"BimFileChooserPage");
  }
  _moduleChoose = () => {
    let navigator = this.props.navigation;
    storage.projectIdVersionId = '';
    storage.pushNext(navigator,"ModelFileChooserPage");
  }
  _projectChoose = () => {
    let navigator = this.props.navigation;
    storage.projectIdVersionId = '';
    storage.pushNext(navigator,"ProjectChooserPage");
  }
  

  componentDidMount() {
    //请求数据
    this.fetchData();
  }
  fetchData = () => {
    console.log(storage.loadTenant);
    console.log(storage.loadProject);

    if (storage.loadTenant && storage.loadProject) {

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
      <View style={{backgroundColor:'#FFFFFE'}}>
        <StatusBar barStyle="light-content" translucent={false} backgroundColor="#00baf3" />
        <ImageBackground style={{ height: 238 }} resizeMode='center' source={require('app-images/icon_main_page_top_bg.png')}>
        <Carousel ref={'carousel'} style={{ height: 238 }} carousel={false} scrollEnabled={false}>
          <Image style={styles.topImage} resizeMode='center' source={require('app-images/icon_main_page_top_quality.png')} />
          <Image style={styles.topImage} resizeMode='center' source={require('app-images/icon_main_page_top_equipment.png')} />
        </Carousel>
        </ImageBackground>
        <SegmentedView style={{flex: 0,height:400,backgroundColor:'#f8f8f8'}} onChange={(index) => { this.scrollToPage(index) }} bounces={true} type={'carousel'}>
          <SegmentedView.Sheet title='质量检查'>
          <View style={styles.tabContent}>
            <ModelItemView source={require('app-images/icon_main_pager_zjqd.png')} onPress={() => this._loadQualityForm()} title="质检清单" />
            <View style={styles.spliteItem} />
            <ModelItemView source={require('app-images/icon_main_pager_blueprint.png')} onPress={() => this._fileChoose()} title="图纸" />
            <View style={styles.spliteItem} />
            <ModelItemView source={require('app-images/icon_main_pager_model.png')} onPress={() => this._projectChoose()} title="模型" />
            <View style={styles.spliteItem} />
            <ModelItemView source={require('app-images/icon_main_pager_module.png')} onPress={() => this._moduleChoose()} title="质检项目" />
            <View style={styles.spliteItem} />
            <Button type={'primary'} size={'md'} onPress={() => this._loadUserInfo()} style={{ height: 50 }} title="选择租户" />
          </View>
          </SegmentedView.Sheet>
          <SegmentedView.Sheet title='材设进场'>
          <View style={styles.tabContent}>
          <ModelItemView source={require('app-images/icon_main_pager_csjc.png')} onPress={() => this._loadEquipmentForm()} title="材设清单" />
            <View style={styles.spliteItem} />
            <ModelItemView source={require('app-images/icon_main_pager_equipment_model.png')} onPress={() => this._moduleChoose()} title="模型预览" />   
          </View>
          </SegmentedView.Sheet>
        </SegmentedView>
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
    marginBottom: 40,
    backgroundColor:'#f8f8f8',
  },

});