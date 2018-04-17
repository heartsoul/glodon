/**
 * Created by JokAr on 2017/4/12.
 */
'use strict';
import React, { Component, PureComponent } from "react";
import {
    ActivityIndicator, Animated, SectionList, FlatList,
    ScrollView, StyleSheet, Text, View, StatusBar, Image,
    RefreshControl, Button, TouchableHighlight, TouchableOpacity, Dimensions
} from "react-native";
import * as API from "app-api";
import QualityDetailCell from "./QualityDetailCell";
import { List} from 'antd-mobile';
import { Label } from 'app-3rd/teaset';

import QualityInfoItem from "./QualityInfoItem"

var { width, height } = Dimensions.get("window");

export default class QualityDetailPage extends PureComponent {
    static navigationOptions = {
        title: '详情',
        tabBarVisible: false,
        headerTintColor: "#FFF",
        headerStyle: { backgroundColor: "#00baf3" },
        gesturesEnabled: false,
    };
    constructor(props) {
        super(props);
        // console.log( "props.qcState:"+props.qcState+"props.loadData:"+props.loadData);
        // this.state = {
        //     isLoading: false,
        //     //网络请求状态
        //     error: false,
        //     errorInfo: "",
        //     sectionArray: [],
        //     qcState: props.qcState,
        //     currentPage: 0,
        //     hasMore: false,
        //     refreshing: false,
        //     loadData:props.loadData,
        // }
    }
   
    componentDidMount() {
        
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
            <QualityDetailCell item={item} index={index} />
        );
    }
    
    renderInfo = (infoData) =>{
        let sectionData = self.state.sectionArray.get(section);
        let txt = sectionData.key;
        return <View style={styles.groupHeaderView}>
            <View style={styles.headerLine}></View>
            <Text
                style={styles.groupTitle}>{txt}</Text>
        </View>
    }
    
    _emptyView = () => {
        return (<View style={{ alignItems: 'center', justifyContent: 'center', height: height - 44 - 20 - 49 }}><Text style={{ color: 'gray' }}>暂无数据</Text></View>);
    }
   
    renderData() {
        return (
        <ScrollView>
            <List>
                <List.Item ><QualityInfoItem leftTitle="施工单位：" content="城建集团" /></List.Item>
                <List.Item ><QualityInfoItem leftTitle="责任人：" content="张大大" /></List.Item>
                <List.Item ><QualityInfoItem leftTitle="质检项目：" content="结构柱" /></List.Item>
                <List.Item ><QualityInfoItem leftTitle="现场描述：" content="现场检查内容描述1现场检查内容描述现场检查内容描述现场检查内容描述现场检查内容描述现场检查内容描述现场检查内容描述现场检查内容描述现场检查内容描述现场检查内容描述" /></List.Item>
                <List.Item ><QualityInfoItem leftTitle="保存时间：" content="2017-10-17 21:25:00" /></List.Item>
                <List.Item ><QualityInfoItem leftTitle="提交时间：" content="2017-10-18 21:25:00" /></List.Item>
                <List.Item ><QualityInfoItem leftTitle="关联图纸：" content="图纸号 JPGF-756" /></List.Item>
                <List.Item ><QualityInfoItem leftTitle="关联模型：" content="012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789" /></List.Item>
            </List>
        </ScrollView>
        );
    }
    render() {
       // 第一次加载等待的view
        // if (this.state.isLoading && !this.state.error) {
        //     return this.renderLoadingView();
        // } else 
        // if (this.state.error) {
        //     //请求失败view
        //     return this.renderErrorView(this.state.errorInfo);
        // }
        //加载数据
        return this.renderData();
    }
}

const styles = StyleSheet.create({
    
});