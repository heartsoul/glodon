/**
 * Created by soul on 2018/4/12.
 */
'use strict';
import React, { Component, PureComponent } from "react";
import {
    ActivityIndicator, Animated, SectionList, FlatList,
    ScrollView, StyleSheet, Text, View, StatusBar, Image,
    RefreshControl, Button, TouchableHighlight, TouchableOpacity, Dimensions
} from "react-native";
import * as API from "app-api";
import QualityListCell from "./qualityListCell";
import { SegmentedBar,SegmentedView, Drawer, Label } from 'app-3rd/teaset';

var { width, height } = Dimensions.get("window");
// const AnimatedSectionList = Animated.createAnimatedComponent(SectionList);

//   drawer.close(); //如需要可代码手动关上抽屉
export default class QualityListView extends PureComponent {
    
    constructor(props) {
        super(props);
        console.log( "props.qcState:"+props.qcState+"props.loadData:"+props.loadData);
        this.state = {
            isLoading: false,
            //网络请求状态
            error: false,
            errorInfo: "",
            sectionArray: [],
            qcState: props.qcState,
            currentPage: 0,
            hasMore: false,
            refreshing: false,
            loadData:props.loadData,
        }
    }
    _sectionData=(index) =>{
        return this.state.sectionArray;
    }
    _keyExtractor = (item, index) => index;
    //网络请求
    fetchData = (qcState) => {
        this._fetchData(qcState, 0);
    }
    //网络请求
    _fetchData = (qcState, page) => {
        console.log("数据列表状态_fetchData："+qcState);
        // 这个是js的访问网络的方法
        API.getQualityInspectionAll(storage.loadProject(), qcState, page, 35).then(
            (responseData) => {

                // try {
                    let data = responseData.data.content;
                    let hasData = responseData.data.last == false;
                    let dataBlob = [];
                    let groupMap = new Map();
                    let i = 0, j = 0;
                    let sectionLob = [];
                    if (page != 0) {
                        groupMap = this.state.groupMap;
                    }
                    data.forEach(item => {
                        item.showTime = "" + API.formatUnixtimestamp(item.updateTime);
                        item.index = i;
                        item.qcStateShow = "" + API.toQcStateShow(item.qcState);
                        if (item.files && item.files.size > 0) {
                            item.url = item.files[0].url;
                            // console.log(item.url);
                        }
                        let groupTime = item.showTime.substring(0, 10);
                        let dataBlob = groupMap.get(groupTime);
                        if (dataBlob == undefined) {
                            dataBlob = [];
                            groupMap.set(groupTime, dataBlob);
                        }
                        dataBlob.push({
                            key: "" + item.id,
                            value: item,
                        });
                        i++;
                    });

                    groupMap.forEach(function (value, key, map) {
                        sectionLob.push({
                            key: key,
                            data: value,
                        });
                    });
                    
                    this.setState({
                        //复制数据源
                        sectionArray: sectionLob,
                        groupMap: groupMap,
                        isLoading: false,
                        refreshing: false,
                        currentPage: page + 1,
                        hasMore: hasData,
                    });
                     this.render();
                    data = null;
                    dataBlob = null;
                    sectionLob = null;
                    groupMap = null;
                // }
                // catch (err) {
                //     this.setState({
                //         isLoading: false,
                //         refreshing: false,
                //     });
                // }
            }
        ).catch(err => ({
            err
        }));
    }

    componentDidMount() {
        //请求数据
        // this._onRefresh();
        console.log("数据列表状态："+this.state.qcState);
        if(this.state.loadData === true) {
            this.fetchData(this.state.qcState);
        }
    }

    //加载等待的view
    renderLoadingView() {
        return (
            <View style={styles.container}>
                <StatusBar barStyle="light-content" translucent={false} backgroundColor="#00baf3" />
                <ActivityIndicator
                    animating={true}
                    style={[styles.gray, { height: 80 }]}
                    color='green'
                    size="large"
                />
            </View>
        );
    }

    //加载失败view
    renderErrorView(error) {
        this.setState({
            refreshing: false,
            isLoading: false,
        });
        return (
            <View style={styles.container}>
                <StatusBar barStyle="light-content" translucent={false} backgroundColor="#00baf3" />
                <Text>
                    Fail: {error}
                </Text>
            </View>
        );
    }

    //返回itemView
    renderItemView = ({ item, index }) => {
        return (
            <QualityListCell item={item} index={index} />
        );
    }
    numberOfRowsInSection = (section) =>{
        console.log("numberOfRowsInSection");
        let data = this.state.sectionArray[section];
        if(data != undefined && data.data != undefined) {
            console.log("numberOfRowsInSection:"+parseInt(''+data.data.length));
            return parseInt(''+data.data.length);
        }
        return 0;
    }
    
    numberOfSections = () =>{
        console.log("numberOfSections");
        let data = this.state.sectionArray;
        if(data != undefined) {
            console.log("numberOfSections:"+parseInt(''+data.length));
            return 19;//parseInt(''+data.length);
        }
        return 0;
    }
    heightForSection = (section) =>{
        return 30;
    }
    heightForCell = (section,row) =>{
        console.log("heightForCell");
        return row % 5 == 3 ? 18 : 12;
    }
    renderItem = (section,row) =>{
        return <View style={{flex:1}} ><Text>abc</Text></View>;
        // let sectionData = self.state.sectionArray.get(section);
        // let item = sectionData.data.get(row);
        // return (
        //     <QualityListCell style={{flex:1}}  item={item} index={row} />
        // );
    }
    renderSection = (section) =>{
        let sectionData = self.state.sectionArray.get(section);
        let txt = sectionData.key;
        return <View style={styles.groupHeaderView}>
            <View style={styles.headerLine}></View>
            <Text
                style={styles.groupTitle}>{txt}</Text>
        </View>
    }
    
    _sectionComp = (info) => {
        var txt = info.section.key;
        return <View style={styles.groupHeaderView}>
            <View style={styles.headerLine}></View>
            <Text
                style={styles.groupTitle}>{txt}</Text>
        </View>
    }
    _onFilter = (qcState) => {
        console.log("_onFilter"+qcState);
        this.setState({
            refreshing: true,
            currentPage: 0,
            hasMore: true,
            qcState: qcState,
        });
        this.fetchData(qcState);
    }
    _onEndReached = () => {
        if (this.state.refreshing || this.state.isLoading || this.state.hasMore == false) {
            return;
        }
        this.setState({
            refreshing: true,
        });
        this._fetchData(this.state.qcState, this.state.currentPage);
    }
    _onRefresh = () => {
        console.log("_onRefresh"+this.state.qcState);
        this._onFilter(this.state.qcState);
    }
    _onSegmentedBarChange = (index) => {
        this.setState({qcState: API.CLASSIFY_STATES[index] });
        this._onFilter(API.CLASSIFY_STATES[index]);
    }
    _emptyView = () => {
        return (<View style={{ alignItems: 'center', justifyContent: 'center', height: height - 44 - 20 - 49 }}><Text style={{ color: 'gray' }}>暂无数据</Text></View>);
    }
    _toTop = () =>{
        this.refs.sectionList.scrollToOffset({animated: true, offset:0});
    }
    renderData() {
        return (
        <SectionList
            ref='sectionList'
            sections={this.state.sectionArray}
            renderItem={this.renderItemView}
            // keyExtractor={this._keyExtractor}
            renderSectionHeader={this._sectionComp}
            // ItemSeparatorComponent={this._separator}
            stickySectionHeadersEnabled={true}
            onRefresh={this._onRefresh}
            refreshing={this.state.refreshing}
            onEndReached={this._onEndReached}
            onEndReachedThreshold={1}
            ListEmptyComponent={this._emptyView}
        />

        );
    }
    render() {
       // 第一次加载等待的view
        if (this.state.isLoading && !this.state.error) {
            return this.renderLoadingView();
        } else 
        if (this.state.error) {
            //请求失败view
            return this.renderErrorView(this.state.errorInfo);
        }
        //加载数据
        return this.renderData();
    }
}

const styles = StyleSheet.create({
    contentHeader: {
        // flex:1,
        height:30,
        top:0,
    },
    contentList: {
        // flex:1,
        // backgroundColor:'orange',
        //  height:120,
    },
    dataList: {
        // flex: 1,
        top:0, 
        height:height,
        backgroundColor:'green',
    },
    gray: {
        top: 100,
        left: width / 2 - 30,
        position: 'absolute',
    },
    topBtn: {
        width: 50,
        height: 25,
        backgroundColor: '#0007',
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        top: height - 100,
        left: width - 60,
        position: 'absolute',
    },
    topBtnText: {
        fontSize: 12,
        color: '#fff'
    },
    headerButton: {
        color: '#333333',
        fontSize: 14,
    },
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
        // height:180
    },

    groupHeaderView: {
        backgroundColor: '#fafafa',
        height: 30,
    },
    headerLine: {
        backgroundColor: '#e6e6e6',
        height: 1,
        top: 19,
        marginLeft: 20,
        marginRight: 20,
    },
    groupTitle: {
        height: 20,
        textAlign: 'center',
        textAlignVertical: 'center',
        color: '#999',
        fontSize: 14,
        width: 100,
        top: 10,
        left: width / 2 - 50,
        backgroundColor: '#fafafa',
    }
});