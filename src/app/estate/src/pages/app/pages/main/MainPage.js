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
    SafeAreaView,
} from 'react-native';
import ModelItemView from './ModelItemView'

import { NavigationPage, SegmentedBar, Label, SegmentedView, Button, Carousel } from 'app-3rd/teaset';
import { BimFileEntry, AuthorityManager } from 'app-entry';//图纸模型选择及展示入口
var { width, height } = Dimensions.get("window");
export default class extends NavigationPage {
    constructor() {
        super();
    };
   
    _loadQualityForm = () => {
        let navigator = this.props.navigation;
        storage.projectIdVersionId = '';
        storage.fileId = '';
        storage.bimToken = {};

        storage.pushNext(navigator, "QualityMainPage", {top:true})

    }
    _loadEquipmentForm = () => {
        let navigator = this.props.navigation;
        storage.projectIdVersionId = '';
        storage.fileId = '';
        storage.bimToken = {};

        storage.pushNext(navigator, "EquipmentMainPage", {top:true})

    }
    //图纸
    _fileChoose = () => {
        let navigator = this.props.navigation;
        BimFileEntry.chooseBlueprintFromHome(navigator);
    }
    //模型预览
    _moduleChoose = () => {
        let navigator = this.props.navigation;
        BimFileEntry.chooseQualityModelFromHome(navigator);
    }

    //质检项目
    _checkPointChoose = () => {
        let navigator = this.props.navigation;
        storage.projectIdVersionId = '';
        storage.pushNext(navigator, "CheckPointListPage", {top:true});

    }
    //模型
    _projectChoose = () => {
        let navigator = this.props.navigation;
        BimFileEntry.chooseQualityModelFromHome(navigator);
    }


    componentDidMount() {
        //请求数据
        // this.fetchData();
        // console.log("componentDidMount")
    }
    fetchData = () => {
        this.render()
    }
    scrollToPage = (index) => {
        if (parseInt('' + index) != parseInt('' + this.refs.carousel.activeIndex)) {
            this.refs.carousel.scrollToPage(index);
        }
    }
    render() {
        let qShow = AuthorityManager.isQualityBrowser()
        let eShow = AuthorityManager.isEquipmentBrowser()
        if(!(qShow || eShow)) {
           return <SafeAreaView style={[styles.container, { backgroundColor: '#ecf0f1' }]}>
           <StatusBar barStyle="light-content" translucent={false} backgroundColor="#00baf3" />
           <View style={{flex:1,alignItems:'center',justifyContent:'center',flexDirection:'column'}}>
           <Text style={styles.text}> 敬请期待 </Text>
           </View>
           </SafeAreaView>
        }

        return (
            <View style={{ backgroundColor: '#FFFFFE' }}>
                <StatusBar barStyle="light-content" translucent={false} backgroundColor="#00baf3" />
                <ImageBackground style={{ height: 203, marginTop:44}} resizeMode='contain' source={require('app-images/icon_main_page_top_bg.png')}>
                    <Carousel ref={'carousel'} style={{ height: 203 }} carousel={false} scrollEnabled={false}>
                    {
                        qShow ? <View style={styles.topImageView}>
                        <Image style={[styles.topImage,{width:121,height:87}]} source={require('app-images/icon_main_page_top_quality.png')} />
                        </View>
                        : null
                    }
                     {
                        eShow ? 
                        <View style={styles.topImageView}>
                        <Image style={[styles.topImage,{width:27,height:74}]} source={require('app-images/icon_main_page_top_equipment.png')} />
                        </View>
                        : null
                    }
                    </Carousel>
                </ImageBackground>
                <SegmentedView style={{ flex: 0, height: 400, backgroundColor: '#f8f8f8' }} onChange={(index) => { this.scrollToPage(index) }} bounces={true} type={'carousel'}>
                    {
                        qShow ? 
                            <SegmentedView.Sheet title='质量检查'>
                                <View style={styles.tabContent}>
                                    <ModelItemView source={require('app-images/icon_main_pager_zjqd.png')} onPress={() => this._loadQualityForm()} title="质检清单" />
                                    <View style={styles.spliteItem} />
                                    <ModelItemView source={require('app-images/icon_main_pager_blueprint.png')} onPress={() => this._fileChoose()} title="图纸" />
                                    <View style={styles.spliteItem} />
                                    <ModelItemView source={require('app-images/icon_main_pager_model.png')} onPress={() => this._projectChoose()} title="模型" />
                                    <View style={styles.spliteItem} />
                                    <ModelItemView source={require('app-images/icon_main_pager_module.png')} onPress={() => this._checkPointChoose()} title="质检项目" />
                                    <View style={styles.spliteItem} />
                                </View>
                            </SegmentedView.Sheet>
                         : null
                    }
                     {
                        eShow ? 
                    <SegmentedView.Sheet title='材设进场'>
                        <View style={styles.tabContent}>
                            <ModelItemView source={require('app-images/icon_main_pager_csjc.png')} onPress={() => this._loadEquipmentForm()} title="材设清单" />
                            <View style={styles.spliteItem} />
                            <ModelItemView source={require('app-images/icon_main_pager_equipment_model.png')} onPress={() => this._moduleChoose()} title="模型预览" />
                        </View>
                    </SegmentedView.Sheet>
                    : null
                }
                </SegmentedView>
            </View>

        );
    }
};

var styles = StyleSheet.create({
    style_fogotText: {
        color: 'green',
    },
    topImageView: {
        width: width,
        height: 203,
        alignItems: 'center',
        justifyContent: 'center',
    },
    topImage: {
    },
    spliteItem: {
        width: 10,
    },
    tabContent: {
        alignItems: 'center',
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'flex-start',
        // flex: 1,
        marginLeft: 20,
        marginTop: 40,
        marginRight: 20,
        marginBottom: 40,
        backgroundColor: '#f8f8f8',
    },
    container:{
        flex:1,
      },
      text:{
        fontSize:18,
        color:'gray'
      },
});