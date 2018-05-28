'use strict';
import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    StatusBar,
    TouchableHighlight,
    Image,
    ImageBackground,
    Dimensions,
    SafeAreaView,
} from 'react-native';
import ModelItemView from './ModelItemView'
import * as CheckVersionManager from "./../../pages/me/checkVerson";

import { NavigationPage, SegmentedBar, Label, SegmentedView, Button, Carousel } from 'teaset';
import { BimFileEntry, AuthorityManager } from 'app-entry';//图纸模型选择及展示入口

import {ToOnlineDialog} from 'app-components';
import OfflineStateUtil from '../../../../common/utils/OfflineStateUtil';

var { width, height } = Dimensions.get("window");
export default class extends Component {
    constructor() {
        super();
        this.state={
            isShowOfflineHint:true,
        }
    };

    _loadQualityForm = () => {
        let navigator = this.props.navigation;
        storage.projectIdVersionId = '';
        storage.fileId = '';
        storage.bimToken = {};

        storage.pushNext(navigator, "QualityMainPage", { top: true })

    }
    _loadEquipmentForm = () => {
        let navigator = this.props.navigation;
        storage.projectIdVersionId = '';
        storage.fileId = '';
        storage.bimToken = {};

        storage.pushNext(navigator, "EquipmentMainPage", { top: true })

    }
    //图纸
    _fileChoose = () => {
        let navigator = this.props.navigation;
        BimFileEntry.chooseBlueprintFromHome(navigator);
    }
    //模型预览
    _moduleChoose = () => {
        let navigator = this.props.navigation;
        BimFileEntry.chooseEquipmentModelFromHome(navigator);
    }

    //质检项目
    _checkPointChoose = () => {
        let navigator = this.props.navigation;
        storage.projectIdVersionId = '';
        storage.pushNext(navigator, "CheckPointListPage", { top: true });

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
        CheckVersionManager.checkVersion("auto")
    }
    fetchData = () => {
        this.render()
    }
    scrollToPage = (index) => {
        console.log("index ============= " + index)
        index = (index == 0) ? 1 : 0;//Carousel 默认显示最后一张，所以交换一下索引
        if (!this.refs.carousel) {
            return;
        }
        if (this.refs.carousel && parseInt('' + index) != parseInt('' + this.refs.carousel.activeIndex)) {
            this.refs.carousel.scrollToPage(index);
        }
    }

    renderCarouselView = (qShow, eShow) => {
        if (qShow && eShow) {
            return (
                <Carousel startIndex={1} ref={'carousel'} style={{ height: 203 }} carousel={false} scrollEnabled={false}>
                    <View style={styles.topImageView}>
                        <Image style={[styles.topImage, { width: 121, height: 87 }]} source={require('app-images/icon_main_page_top_equipment.png')} />
                    </View>
                    <View style={styles.topImageView}>
                        <Image style={[styles.topImage, { width: 27, height: 74 }]} source={require('app-images/icon_main_page_top_quality.png')} />
                    </View>
                </Carousel>
            );
        } else if (eShow) {
            return (
                <Carousel ref={'carousel'} style={{ height: 203 }} carousel={false} scrollEnabled={false}>
                    <View style={styles.topImageView}>
                        <Image style={[styles.topImage, { width: 121, height: 87 }]} source={require('app-images/icon_main_page_top_equipment.png')} />
                    </View>
                </Carousel>
            );
        } else if (qShow) {
            return (
                <Carousel ref={'carousel'} style={{ height: 203 }} carousel={false} scrollEnabled={false}>
                    <View style={styles.topImageView}>
                        <Image style={[styles.topImage, { width: 27, height: 74 }]} source={require('app-images/icon_main_page_top_quality.png')} />
                    </View>
                </Carousel>
            );
        }
        return null;

    }

    //关闭离线标记
    closeOfflineHintView =()=>{
        this.setState((pre)=>{
            return {isShowOfflineHint:false}
        })
    }

    //离线标记
    offlineHintView =()=>{
        //如果是离线模式 需要显示离线标记
        let isOnline = OfflineStateUtil.isOnLine();
        if(isOnline){
            return null;
        }
        if(!this.state.isShowOfflineHint){
            return null;
        }
        return (
                <View style={{ width:347,height:26,flexDirection:'row',alignItems:'center',alignSelf:'center'}}>
                    <Image source={require('app-images/icon_offline_main_page_blue.png')} style={{width:12,height:10,marginLeft:10}}/>
                    <TouchableHighlight onPress={()=>{ToOnlineDialog.show(this.props.navigation);}}>
                        <Text style={{color:'#666666',fontSize:12,marginLeft:6}} >当前网络不畅，已进入</Text>
                    </TouchableHighlight>
                    <TouchableHighlight style={{flex:1}} onPress={()=>{ToOnlineDialog.show(this.props.navigation);}}>
                        <Text style={{color:'#00baf3',fontSize:12}} >离线模式</Text>
                    </TouchableHighlight>
                    <TouchableHighlight onPress={()=>{this.closeOfflineHintView();}}>
                        <Image source={require('app-images/icon_category_item_close.png')} style={{width:7,height:7,marginRight:10,marginLeft:5}}/>
                    </TouchableHighlight>
                </View>
        );
    }

    render() {
        let qShow = AuthorityManager.isQualityBrowser()
        let eShow = AuthorityManager.isEquipmentBrowser()
        if (!(qShow || eShow)) {
            return <SafeAreaView style={[styles.container, { backgroundColor: '#ecf0f1' }]}>
                <StatusBar barStyle="light-content" translucent={false} backgroundColor="#00baf3" />
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
                    <Text style={styles.text}> 未授权，请联系管理员获取！ </Text>
                </View>
            </SafeAreaView>
        }

        return (
            <SafeAreaView>
            <ScrollView style={{ backgroundColor: '#f8f8f8' }}>
                <StatusBar barStyle="light-content" translucent={false} backgroundColor="#00baf3" />
                <View style={{ backgroundColor: '#ffffff' }}>
                {
                    this.offlineHintView()
                }
                <ImageBackground style={{ height: 203, marginTop: 44, backgroundColor: '#ffffff' }} resizeMode='contain' source={require('app-images/icon_main_page_top_bg.png')}>
                    {
                        this.renderCarouselView(qShow, eShow)
                    }
                </ImageBackground>
                </View>
                <SegmentedView barStyle={{left:width/2-100,width:200,height:40, alignItems: 'center', justifyContent: 'center'}} style={{ height: 300, backgroundColor: '#FFFFFF',}} onChange={(index) => { this.scrollToPage(index) }} bounces={true} type={'carousel'}>
                    {
                        qShow ?
                            <SegmentedView.Sheet title='质量检查' activeTitleStyle={{fontSize:16}} titleStyle={{color:'#333333',fontSize:16}} style={{backgroundColor: '#f8f8f8'}}>
                                <View style={styles.tabContent}>
                                    <View style={styles.spliteItem} />
                                    <View style={styles.spliteItem} />
                                    <ModelItemView source={require('app-images/icon_main_pager_zjqd.png')} onPress={() => this._loadQualityForm()} title="质检清单" />
                                    <View style={styles.spliteItem} />
                                    <ModelItemView source={require('app-images/icon_main_pager_blueprint.png')} onPress={() => this._fileChoose()} title="图纸" />
                                    <View style={styles.spliteItem} />
                                    <ModelItemView source={require('app-images/icon_main_pager_model.png')} onPress={() => this._projectChoose()} title="模型" />
                                    <View style={styles.spliteItem} />
                                    <ModelItemView source={require('app-images/icon_main_pager_module.png')} onPress={() => this._checkPointChoose()} title="质检项目" />
                                    <View style={styles.spliteItem} />
                                    <View style={styles.spliteItem} />
                                </View>
                            </SegmentedView.Sheet>
                            : null
                    }
                    {
                        eShow ?
                            <SegmentedView.Sheet title='材设进场' activeTitleStyle={{fontSize:16}} titleStyle={{color:'#333333',fontSize:16}} style={{backgroundColor: '#f8f8f8'}}>
                                <View style={styles.tabContent}>
                                    <View style={styles.spliteItem} />
                                    <View style={styles.spliteItem} />
                                    <ModelItemView source={require('app-images/icon_main_pager_csjc.png')} onPress={() => this._loadEquipmentForm()} title="材设清单" />
                                    <View style={styles.spliteItem} />
                                    <ModelItemView source={require('app-images/icon_main_pager_equipment_model.png')} onPress={() => this._moduleChoose()} title="模型预览" />
                                    <View style={styles.spliteItem} />
                                    <View style={styles.spliteItem} />
                                </View>
                            </SegmentedView.Sheet>
                            : null
                    }
                </SegmentedView>
            </ScrollView>
</SafeAreaView>
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
        height: 80,
    },
    tabContent: {
        alignItems: 'center',
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'flex-start',
        // flex: 1,
        marginLeft: 0,
        marginTop: 28,
        marginRight: 0,
        marginBottom: 28,
        backgroundColor: '#f8f8f8',
    },
    container: {
        flex: 1,
    },
    text: {
        fontSize: 18,
        color: 'gray'
    },
});