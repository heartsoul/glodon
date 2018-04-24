/**
 * Created by JokAr on 2017/4/12.
 */
'use strict';
import React, { Component } from "react";
import {
    ActivityIndicator, 
    Text, 
    View, 
    Image
} from "react-native";
import PropTypes from 'prop-types'

import { BimFileEntry } from "app-entry";
import * as API from "app-api";

import QualityInfoCellItem from "./QualityInfoCellItem";
import QualityInfoItem from "./QualityInfoItem"
 
export default class QualityDetailView extends Component {
    
    constructor(props) {
        super(props);
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
        // const {fetchData} = this.props;
        // const {item} = this.props.navigation.state.params;
        // fetchData(item.value.id);
    }

    componentWillUnmount () {
        // const {resetData} = this.props;
        // resetData();
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

    renderProgressInfoItem = (progressInfo, index) => {
        
        if (progressInfo.files.length <= 0) {
            return <View key={"renderProgressInfoItem" + index} style={{ marginTop: 10 }}>
                <QualityInfoCellItem userName={progressInfo.handlerName + '-' + progressInfo.handlerTitle} actionDate={API.formatUnixtimestamp(progressInfo.commitTime)} showType="user"
                    actionText={progressInfo.billType} actionColor={API.toBillTypeColor(progressInfo.billType)} onAction={() => { this.onAction(progressInfo) }} />
                <QualityInfoCellItem description={progressInfo.description} descriptionDate={progressInfo.handleDate ? "整改期" + API.formatUnixtimestampSimple(progressInfo.handleDate) : null} showType="description" />
                <QualityInfoItem showType="line" />
            </View>
        }
        if (progressInfo.files.length == 1) {
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
    render = () => {
        const { inspectionInfo, progressInfos } = this.props.qualityInfo;
        return (
            <View>
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
            </View>
        );
    }
}

QualityDetailView.propTypes = {
    qualityInfo: PropTypes.any.isRequired,
  }