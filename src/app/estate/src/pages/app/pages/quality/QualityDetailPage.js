/**
 * Created by JokAr on 2017/4/12.
 */
'use strict';
import React, { Component } from "react";
import {
    ActivityIndicator, Animated, SectionList, FlatList,
    ScrollView, StyleSheet, Text, View, StatusBar, Image,
    RefreshControl, Button, TouchableHighlight, TouchableOpacity, Dimensions
} from "react-native";
import { connect } from 'react-redux' // 引入connect函数
import { List } from 'antd-mobile';
import { Label } from 'app-3rd/teaset';

import { BimFileEntry, AuthorityManager } from "app-entry";
import * as API from "app-api";

import QualityInfoCellItem from "./QualityInfoCellItem";
import QualityInfoItem from "./QualityInfoItem"
import * as actions from '../../actions/qualityInfoAction'
var { width, height } = Dimensions.get("window");
 
class QualityDetailPage extends Component {
    static navigationOptions = ({navigation, screenProps}) => ({
        title: navigation.state.params.title?navigation.state.params.title : '详情',
        tabBarVisible: false,
        headerTintColor: "#FFF",
        headerStyle: { backgroundColor: "#00baf3" },
        gesturesEnabled: false,
        headerRight:navigation.state.params.rightTitle ? (  
            <Label  onPress={()=>navigation.state.params.rightNavigatePress()} style={{marginRight:10, color:'#FFFFFF', textAlign:"center"}} >  
                {navigation.state.params.rightTitle}
        </Label>  ): null
    })
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            //网络请求状态
            error: false,
            errorInfo: "",
            qualityInfo: null,
        }
    }
    // shouldComponentUpdate(nextProps, nextState) {
    //     if (nextProps.error || nextProps.isLoading) {
    //       return true;
    //     }
    //     return true
    // }

    updateNavBar = (inspectionInfo) =>{
        let power = false;
            let title = "";
            if(inspectionInfo.inspectionType == API.TYPE_INSPECTION[0]) {
                title = API.TYPE_INSPECTION_NAME[0]
            } else if(inspectionInfo.inspectionType == API.TYPE_INSPECTION[1]) {
                title = API.TYPE_INSPECTION_NAME[1]
            }
            let rightTitle = null;
            
            if(inspectionInfo.qcState == API.QC_STATE_UNRECTIFIED) {
                // 整改
                power = (AuthorityManager.isCreateRectify()&& AuthorityManager.isMe(inspectionInfo.responsibleUserId))
                if(power) {
                    rightTitle = API.TYPE_NEW_NAME[0]
                }
            } else if(inspectionInfo.qcState == API.QC_STATE_UNREVIEWED) {
                // 检查
                power = (AuthorityManager.isCreateReview()&& AuthorityManager.isMe(inspectionInfo.creatorId)) 
                if(power) {
                    rightTitle = API.TYPE_NEW_NAME[1]
                }
            }

            this.props.navigation.setParams({title:title,rightTitle:rightTitle, rightNavigatePress:this._rightAction }) 
    }

    onAction = (inspectionInfo) => {
        // "qualityCheckpointId": 5200014,
        // "qualityCheckpointName": "墙面",
        // alert(progressInfo.billType);
        storage.pushNext(null, "QualityStatardsPage", { 'qualityCheckpointId': inspectionInfo.qualityCheckpointId, 'qualityCheckpointName': inspectionInfo.qualityCheckpointName });
    }
    onCheckPointAction = (inspectionInfo) => {
        // "qualityCheckpointId": 5200014,
        // "qualityCheckpointName": "墙面",
        // alert(progressInfo.billType);
        storage.pushNext(null, "QualityStatardsPage", { 'qualityCheckpointId': inspectionInfo.qualityCheckpointId, 'qualityCheckpointName': inspectionInfo.qualityCheckpointName });
    }

    onOpenDrawingAction = (inspectionInfo) => {
        // "drawingGdocFileId": "be645ab6d5204fd19bda437c7a21b1d2",
        // "drawingName": "基础图.dwg",
        // "drawingPositionX": "2475.5999755859375",
        // "drawingPositionY": "948.800048828125",
        // alert(inspectionInfo.drawingName);
        // alert(progressInfo.drawingName);
        // alert(progressInfo.drawingName);
        // alert(progressInfo.drawingName);
        // storage.pushNext(null, "RelevantBlueprintPage", { title: inspectionInfo.drawingName, fileId: inspectionInfo.drawingGdocFileId, pageType: 1, relevantBluePrint: { "data": inspectionInfo } });
        BimFileEntry.showBlueprintFromDetail(null, inspectionInfo.drawingGdocFileId, inspectionInfo.drawingName, inspectionInfo.drawingPositionX, inspectionInfo.drawingPositionY)

    }

    onOpenModleAction = (inspectionInfo) => {
        // "buildingId": 0,
        // "buildingName": null,
        // "elementId": "318370",
        // "elementName": "常规 - 150mm",
        // "gdocFileId": "a5b812dff199438dba5bacee0b373497",
        // alert(inspectionInfo.gdocFileId);
        // storage.pushNext(null, "RelevantModlePage", { title: inspectionInfo.elementName, fileId: inspectionInfo.gdocFileId, pageType: 1, relevantBluePrint: { "data": inspectionInfo } });
        BimFileEntry.showModelFromDetail(null, inspectionInfo.gdocFileId, inspectionInfo.elementId);
    }

    componentDidMount() {
        const {fetchData} = this.props;
        const {item} = this.props.navigation.state.params;
        fetchData(item.value.id);
    }

    componentWillUnmount () {
        const {resetData} = this.props;
        resetData();
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

    renderFirstProgressInfoItem = (inspectionInfo) => {
        let progressInfo = {
            "id": inspectionInfo.id,
            "code": inspectionInfo.code,
            "billType": API.toBillType(inspectionInfo.inspectionType),
            "lastRectificationDate": inspectionInfo.lastRectificationDate,
            "handleDate": inspectionInfo.updateTime,
            "handlerId": inspectionInfo.creatorId,
            "handlerName": inspectionInfo.creatorName,
            "handlerTitle": inspectionInfo.responsibleUserTitle,
            "commitTime": inspectionInfo.commitTime,
            "files": inspectionInfo.files
        };
        return this.renderProgressInfoItem(progressInfo, '-11');
    }

    _rightAction = () => {

    }
    renderProgressInfoItem = (progressInfo, index) => {
        
        if (progressInfo.files.size <= 0) {
            return <View key={"renderProgressInfoItem" + index} style={{ marginTop: 10 }}>
                <QualityInfoCellItem userName={progressInfo.handlerName + '-' + progressInfo.handlerTitle} actionDate={API.formatUnixtimestamp(progressInfo.commitTime)} showType="user"
                    actionText={progressInfo.billType} actionColor={API.toBillTypeColor(progressInfo.billType)} onAction={() => { this.onAction(progressInfo) }} />
                <QualityInfoCellItem description={progressInfo.description} descriptionDate={progressInfo.handleDate ? "整改期" + API.formatUnixtimestampSimple(progressInfo.handleDate) : null} showType="description" />
                <QualityInfoItem showType="line" />
            </View>
        }
        if (progressInfo.files.size == 1) {
            return (
                <View key={"renderProgressInfoItem" + index} style={{ marginTop: 10 }}>
                    <QualityInfoCellItem userName={progressInfo.handlerName} actionDate={API.formatUnixtimestamp(progressInfo.commitTime)} showType="user"
                        actionText={progressInfo.billType} actionColor={API.toBillTypeColor(progressInfo.billType)} onAction={() => { this.onAction(progressInfo) }} />
                    <QualityInfoCellItem description={progressInfo.description} descriptionDate={progressInfo.handleDate ? "整改期" + API.formatUnixtimestampSimple(progressInfo.handleDate) : null} showType="description" />
                    <QualityInfoCellItem url={progressInfo.files[0].url} showType="image" />
                    <QualityInfoItem showType="line" />
                </View>
            );
        }
        let urls = [];
        progressInfo.files.map((file, index) => {
            urls.push(file.url);
        })

        return <View key={"renderProgressInfoItem" + index} style={{ marginTop: 10 }}>
            <QualityInfoCellItem userName={progressInfo.handlerName} actionDate={API.formatUnixtimestamp(progressInfo.commitTime)} showType="user"
                actionText={progressInfo.billType} actionColor={API.toBillTypeColor(progressInfo.billType)} onAction={() => { this.onAction(progressInfo) }} />
            <QualityInfoCellItem description={progressInfo.description} descriptionDate={progressInfo.handleDate ? "整改期" + API.formatUnixtimestamp(progressInfo.handleDate) : null} showType="description" />
            <QualityInfoCellItem urls={urls}
                showType="images" />
            <QualityInfoItem showType="line" />
        </View>
    }
    renderData = () => {
        const { inspectionInfo, progressInfos } = this.props.qualityInfo;
        this.updateNavBar(inspectionInfo)
        return (
            <ScrollView style={{ backgroundColor: '#FFFFFF' }}>
                <View style={{ marginTop: 10 }}>
                    <QualityInfoItem leftTitle={inspectionInfo.inspectionType === 'inspection' ? "施工单位：" : "施工单位："} content={inspectionInfo.constructionCompanyName} />
                    <QualityInfoItem leftTitle="责任人：" content={inspectionInfo.inspectionCompanyName} />
                    {
                        inspectionInfo.qualityCheckpointId > 0 ? (
                            <QualityInfoItem leftTitle="质检项目：" showType="info" onClick={() => { this.onCheckPointAction(inspectionInfo) }} content={inspectionInfo.qualityCheckpointName} />

                        ) : (
                                <QualityInfoItem leftTitle="质检项目：" showType="info" content={inspectionInfo.qualityCheckpointName} />
                            )
                    }
                    <QualityInfoItem leftTitle="现场描述：" content={inspectionInfo.description} />
                    <QualityInfoItem leftTitle="保存时间：" content={API.formatUnixtimestamp(inspectionInfo.updateTime)} />
                    <QualityInfoItem leftTitle="提交时间：" content={API.formatUnixtimestamp(inspectionInfo.commitTime)} />
                    <QualityInfoItem leftTitle="关联图纸：" showType="link" onClick={() => {
                        this.onOpenDrawingAction(inspectionInfo);
                    }} content={inspectionInfo.drawingName} />
                    <QualityInfoItem leftTitle="关联模型：" showType="link" onClick={() => {
                        this.onOpenModleAction(inspectionInfo);
                    }} content={inspectionInfo.elementName} />
                    <QualityInfoItem showType="line" />
                </View>
                {
                    this.renderFirstProgressInfoItem(inspectionInfo)
                }
                {
                    progressInfos.map((progressInfo, index) => {
                        return this.renderProgressInfoItem(progressInfo, index);
                    })
                }

            </ScrollView>
        );
    }
    render() {
        // 第一次加载等待的view
        if (this.props.isLoading && !this.props.error) {
            return this.renderLoadingView();
        } else
            if (this.props.error) {
                //请求失败view
                return this.renderErrorView(this.props.error);
            }
        //加载数据
        return this.renderData();
    }
}

const styles = StyleSheet.create({

});

export default connect(
    state => ({
        qualityInfo: state.qualityInfo.data,
        isLoading: state.qualityInfo.isLoading,
        item:state.qualityInfo.item,
        error:state.qualityInfo.error
    }),
    dispatch => ({
      fetchData: (fileId) =>{
        if(dispatch) {
          dispatch(actions.fetchData(fileId))
        }
      },
      resetData: () =>{
        if(dispatch) {
          dispatch(actions.reset())
        }
      },
    })
  )(QualityDetailPage)