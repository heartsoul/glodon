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
import QualityInfoCellItem from "./QualityInfoCellItem";
import { List } from 'antd-mobile';
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
        this.state = {
            isLoading: true,
            //网络请求状态
            error: false,
            errorInfo: "",
            item: null,
        }
    }

    fetchData = () => {
        this.setState({
            isLoading: true,
            error: false,
            errorInfo: "",
            item: null,
        })
        let item = this.props.navigation.getParam('item');
        API.getQualityInspectionDetail(storage.loadProject(), item.value.id).then((responseData) => {
            console.log("getQualityInspectionDetail:" + responseData)

            this.setState({
                isLoading: false,
                error: false,
                errorInfo: "",
                item: responseData.data,
            });
        }).catch(err => {
            this.setState = {
                isLoading: false,
                error: err,
                errorInfo: err,
                item: null,
            };
        });
    }

    componentDidMount() {
        this.fetchData();
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

    renderInfo = (infoData) => {
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
        const { inspectionInfo, progressInfos } = this.state.item;
        return (
            <ScrollView style={{ backgroundColor: '#FFFFFF' }}>
                <View style={{ marginTop: 10 }}>
                    <QualityInfoItem leftTitle="施工单位：" content={inspectionInfo.constructionCompanyName} />
                    <QualityInfoItem leftTitle="责任人：" content={inspectionInfo.inspectionCompanyName} />
                    <QualityInfoItem leftTitle="质检项目：" showType="info" onClick={() => { alert(inspectionInfo.qualityCheckpointId) }} content={inspectionInfo.qualityCheckpointName} />
                    <QualityInfoItem leftTitle="现场描述：" content={inspectionInfo.description} />
                    <QualityInfoItem leftTitle="保存时间：" content={API.formatUnixtimestamp(inspectionInfo.updateTime)} />
                    <QualityInfoItem leftTitle="提交时间：" content={API.formatUnixtimestamp(inspectionInfo.commitTime)} />
                    <QualityInfoItem leftTitle="关联图纸：" showType="link" onClick={() => {
                        storage.pushNext(null, "RelevantBlueprintPage", { title: inspectionInfo.drawingName, fileId: inspectionInfo.drawingGdocFileId, pageType: 1, relevantBluePrint: {} });
                    }} content={inspectionInfo.drawingName} />
                    <QualityInfoItem leftTitle="关联模型：" showType="link" onClick={() => {
                        storage.pushNext(null, "RelevantModlePage", { title: "图纸号 JPGF-756", fileId: '122', pageType: 1, relevantBluePrint: {} });
                    }} content="构件 JPGF-123" />
                    <QualityInfoItem showType="line" />
                </View>

                {
                    progressInfos.map((progressInfo, index) => {
                        if (progressInfo.files.size <= 0) {
                            return <View style={{ marginTop: 10 }}>
                                <QualityInfoCellItem userName={progressInfo.handlerName} userImage="https://zos.alipayobjects.com/rmsportal/PZUUCKTRIHWiZSY.jpeg" actionDate={API.formatUnixtimestamp(progressInfo.commitTime)} showType="user"
                                    actionText={progressInfo.billType} actionColor="#00B5F2" onAction={() => { alert(3) }} />
                                <QualityInfoCellItem description={progressInfo.billType} descriptionDate={"整改期" + API.formatUnixtimestamp(progressInfo.handleDate)} showType="description" />
                                <QualityInfoItem showType="line" />
                            </View>
                        }
                        if (progressInfo.files.size == 1) {
                            return (
                                <View style={{ marginTop: 10 }}>
                                    <QualityInfoCellItem userName={progressInfo.handlerName} userImage="https://zos.alipayobjects.com/rmsportal/PZUUCKTRIHWiZSY.jpeg" actionDate={API.formatUnixtimestamp(progressInfo.commitTime)} showType="user"
                                        actionText={progressInfo.billType} actionColor="#00B5F2" onAction={() => { alert(3) }} />
                                    <QualityInfoCellItem description={progressInfo.billType} descriptionDate={"整改期" + API.formatUnixtimestamp(progressInfo.handleDate)} showType="description" />
                                    <QualityInfoCellItem url={progressInfo.files[0].url} showType="image" />
                                    <QualityInfoItem showType="line" />
                                </View>
                            );
                        }
                        let urls = [];
                        progressInfo.files.map((file, index) => {
                            urls.push(file.url);
                        })

                        return <View style={{ marginTop: 10 }}>
                            <QualityInfoCellItem userName={progressInfo.handlerName} userImage="https://zos.alipayobjects.com/rmsportal/PZUUCKTRIHWiZSY.jpeg" actionDate={API.formatUnixtimestamp(progressInfo.commitTime)} showType="user"
                                actionText={progressInfo.billType} actionColor="#00B5F2" onAction={() => { alert(3) }} />
                            <QualityInfoCellItem description={progressInfo.billType} descriptionDate={"整改期" + API.formatUnixtimestamp(progressInfo.handleDate)} showType="description" />
                            <QualityInfoCellItem urls={urls}
                                showType="images" />
                            <QualityInfoItem showType="line" />
                        </View>
                    })
                }

                <View style={{ marginTop: 10 }}>
                    <QualityInfoCellItem userName="刘明明-监理" userImage="https://zos.alipayobjects.com/rmsportal/PZUUCKTRIHWiZSY.jpeg" actionDate="2017-10-18 21:25:00" showType="user" actionText="检查" actionColor="#00B5F2" onAction={() => { alert(3) }} />
                    <QualityInfoCellItem description="三楼水管要调整" descriptionDate="整改期：2017-10-19" showType="description" />
                    <QualityInfoCellItem url='https://zos.alipayobjects.com/rmsportal/PZUUCKTRIHWiZSY.jpeg' showType="image" />
                    <QualityInfoItem showType="line" />
                </View>

                <View style={{ marginTop: 10 }}>
                    <QualityInfoCellItem userName="刘明明-监理" userImage="https://zos.alipayobjects.com/rmsportal/hqQWgTXdrlmVVYi.jpeg" actionDate="2017-10-18 21:25:00" showType="user" actionText="整改" actionColor="#F6AD5F" onAction={() => { alert(3) }} />
                    <QualityInfoCellItem description="三楼水管要调整" descriptionDate="整改期：2017-10-19" showType="description" />
                    <QualityInfoCellItem urls={['https://zos.alipayobjects.com/rmsportal/PZUUCKTRIHWiZSY.jpeg', 'https://zos.alipayobjects.com/rmsportal/hqQWgTXdrlmVVYi.jpeg']}
                        showType="images" />
                    <QualityInfoItem showType="line" />
                </View>
                <View style={{ marginTop: 10 }}>
                    <QualityInfoCellItem userName="刘明明-监理" userImage="https://zos.alipayobjects.com/rmsportal/hqQWgTXdrlmVVYi.jpeg" actionDate="2017-10-18 21:25:00" showType="user" actionText="检查" actionColor="#00B5F2" onAction={() => { alert(3) }} />
                    <QualityInfoCellItem description="三楼水管要调整" showType="description" />
                    <QualityInfoCellItem urls={['https://zos.alipayobjects.com/rmsportal/PZUUCKTRIHWiZSY.jpeg', 'https://zos.alipayobjects.com/rmsportal/hqQWgTXdrlmVVYi.jpeg']}
                        showType="images" />
                    <QualityInfoItem showType="line" />
                </View>
                <View style={{ marginTop: 10 }}>
                    <QualityInfoCellItem userName="刘明明-监理" userImage="https://zos.alipayobjects.com/rmsportal/hqQWgTXdrlmVVYi.jpeg" actionDate="2017-10-18 21:25:00" showType="user" actionText="检查" actionColor="#00B5F2" onAction={() => { alert(3) }} />
                    <QualityInfoCellItem description="三楼水管要调整" showType="description" />
                    <QualityInfoCellItem urls={['https://zos.alipayobjects.com/rmsportal/PZUUCKTRIHWiZSY.jpeg', 'https://zos.alipayobjects.com/rmsportal/hqQWgTXdrlmVVYi.jpeg']}
                        showType="images" />
                    <QualityInfoItem showType="line" />
                </View>

            </ScrollView>
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

});