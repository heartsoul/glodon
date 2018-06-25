'use strict';
import React, { Component, PureComponent } from "react";
import {
    Animated, StyleSheet, Text, View, Image,
    Button, TouchableOpacity, Dimensions
} from "react-native";

import * as API from "app-api";
import { StatusActionButton, ActionModal } from "app-components"
var { width, height } = Dimensions.get("window");

import { BimFileEntry, AuthorityManager } from "app-entry";
import OfflineStateUtil from '../../../../common/utils/OfflineStateUtil';
import DirManager from '../../../offline/manager/DirManager';

const projectImage = require("app-images/icon_default_image.png");
const projectTimeImage = require("app-images/icon_time_black.png");


export default class QualityListCell extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            item: props.item,
            index: props.index,
            image:props.item.image?props.item.image:projectImage
        }
    }
    render() {
        return this.renderItem(this.state.item, this.state.index);
    }

    // 提交
    _onSubmitAction = (item, index) => {
        // BimFileEntry.showNewReviewPage(null,item.value.qualityCheckListId,API.CREATE_TYPE_REVIEW); 
        this.props.onCellAction(item,index,'submit');
    }

    // 检查单 整改单  复查单  新建 编辑    提交
    _onNewSubmitAction = (item, index,qcState) => {
        // BimFileEntry.showNewReviewPage(null,item.value.qualityCheckListId,API.CREATE_TYPE_REVIEW); 
        this.props.onCellAction(item,index,'submit'+qcState);
    }
    // 删除
    _onDeleteAction = (item, index) => {
        ActionModal.alertConfirm('是否确认删除？', "删除当前数据后，数据不可恢复哦！", { text: '取消'}, { text: '删除', onPress:()=>{
            this.props.onCellAction(item,index,'delete');
        } });
    }
    // 检查单 整改单  复查单  新建 编辑 删除 
    _onNewDeleteAction = (item, index,qcState) => {
        ActionModal.alertConfirm('是否确认删除？', "删除当前数据后，数据不可恢复哦！", { text: '取消'}, { text: '删除', onPress:()=>{
            this.props.onCellAction(item,index,'delete'+qcState);
        } });
    }
    // 检查
    _onInspectAction = (item, index) => {

    }
    // 复查
    _onReviewAction = (item, index) => {
        BimFileEntry.showNewReviewPage(null,item.value.id,API.CREATE_TYPE_REVIEW);
    }
    // 整改
    _onRectifyAction = (item, index) => {
        BimFileEntry.showNewReviewPage(null,item.value.id,API.CREATE_TYPE_RECTIFY);
    }
    // 验收
    _onAcceptAction = (item, index) => {

    }

    _toDetail = (item) => {
        let power = AuthorityManager.isQualityCheckSubmit() && AuthorityManager.isMe(item.value.creatorId);
        // 未提交状态就进入编辑
        if ((item.value.qcState === API.QC_STATE_STAGED && power)||(item.value.qcState === API.QC_STATE_Q_NEW_SAVE)||(item.value.qcState === API.QC_STATE_Q_EDIT_SAVE)) {
            storage.pushNext(null, "NewPage", { "item": item });
        } else {
            storage.pushNext(null, "QualityDetailPage", { "item": item });
        }
    }
    renderItem = (item, index) => {
        let barItem = this.renderActionBar(item, index);
        let bToolbar = barItem ? true : false;
        return (
            <TouchableOpacity activeOpacity={0.5} onPress={() => { this._toDetail(item) }}>
                <View style={[styles.containerView,]}>
                    <View style={[styles.contentHeaderView]}>
                        <Image source={projectTimeImage} style={styles.imageTime} />
                        <Text style={styles.contentTime}>{item.value.showTime}</Text>
                        <Text style={[styles.contentStatus, { color: API.toQcStateShowColor(item.value.qcState) }]}>{item.value.qcStateShow}</Text>
                    </View>
                    <View style={[styles.contentView, !bToolbar? styles.contentView_border:{}]}>
                        {
                            this.renderImage(item)
                        }
                        <Text style={styles.content}>{item.value.description}</Text>
                    </View>
                    {barItem}
                </View>
            </TouchableOpacity>
        );
    }
    componentWillMount = () => {
        let item = this.props.item;
        if (item &&(!item.image) && item.value.files && item.value.files.length > 0 && item.value.files[0].objectId) {
            if(!OfflineStateUtil.isOnLine()){
                let dm = new DirManager();
                let path  = 'file://'+dm.getImagePathById(item.value.files[0].objectId);
                item.image = {uri:path};
                        this.setState({
                            image:{uri:path}
                        })
            }else{
                API.getBimFileUrlThumbnail(item.value.files[0].objectId,(success,url)=>{
                    if(success) {
                        item.image = {uri:url};
                        this.setState({
                            image:{uri:url}
                        })
                    }
                });
            }
            
        }
        
    }
    renderImage = (item) => {
        // let imageSource = projectImage;
        // if (item.value.files && item.value.files.length > 0 && item.value.files[0].url && item.value.files[0].url.length>1) {
        //     imageSource = { uri: item.value.files[0].url };
        // }
        // console.log(JSON.stringify(this.state.image))
        return (<Image source={this.state.image} style={[styles.image]} />)
    }
    // 提交 & 删除
    renderSubmitAndDeleteAction = (item, index) => {
        if (!AuthorityManager.isMe(item.value.creatorId)) {
            return null;
        }
        let bSubmit = AuthorityManager.isQualityCheckSubmit();
        let bDelete = AuthorityManager.isQualityCheckDelete();
        if (!(bSubmit || bDelete)) {
            return null;
        }
        return (
            <View style={[styles.contentActionView]}>
                {
                    bSubmit ? (<StatusActionButton color={API.toBillTypeColor(API.BILL_TYPE_ITEM_SUBMIT)} style={{elevation:0,width:58, height:28, borderWidth:0.5,borderColor:API.toBillTypeColor(API.BILL_TYPE_ITEM_SUBMIT), marginRight:14}}
                        onClick={() => { this._onSubmitAction(item, index) }} text={API.BILL_TYPE_ITEM_SUBMIT} />) : (null)
                }
                {
                    bDelete ? (<StatusActionButton color={API.toBillTypeColor(API.BILL_TYPE_ITEM_DELETE)} style={{elevation:0,width:58, height:28, borderWidth:0.5,borderColor:API.toBillTypeColor(API.BILL_TYPE_ITEM_DELETE), marginRight:14}}
                        onClick={() => { this._onDeleteAction(item, index) }} text={API.BILL_TYPE_ITEM_DELETE} />) : (null)
                }
            </View>
        )
    }


    //item=
    //                          { key: '5202034',
    // I/ReactNativeJS(28901):    value:
    // I/ReactNativeJS(28901):    { id: 5202034,
    // I/ReactNativeJS(28901):      code: 'ZLJC_20180611_005',
    // I/ReactNativeJS(28901):      qcState: 'resave',
    // I/ReactNativeJS(28901):      projectId: 5213135,
    // I/ReactNativeJS(28901):      inspectionDate: 1528646400000,
    // I/ReactNativeJS(28901):      lastRectificationDate: 1536595200000,
    // I/ReactNativeJS(28901):      description: '444444',
    // I/ReactNativeJS(28901):      inspectionType: 'inspection',
    // I/ReactNativeJS(28901):      creatorId: 5200286,
    // I/ReactNativeJS(28901):      responsibleUserId: 5200299,
    // I/ReactNativeJS(28901):      updateTime: 1528698597000,
    // I/ReactNativeJS(28901):      files: [],
    // I/ReactNativeJS(28901):      needRectification: true,
    // I/ReactNativeJS(28901):      showTime: '2018-06-11 06:29:57',
    // I/ReactNativeJS(28901):      index: 1,
    // I/ReactNativeJS(28901):      qcStateShow: '保存 待同步' } }
    // 检查单 整改单  复查单  新建 编辑 保存  
    renderDeleteAction = (item, index,qcState) => {
        switch(qcState){
            case API.QC_STATE_Q_NEW_SAVE: //检查单 新建   保存
            case API.QC_STATE_Q_EDIT_SAVE: //检查单 编辑   保存
            case API.QC_STATE_REVIEW_NEW_SAVE: //复查单 新建   保存
            case API.QC_STATE_REVIEW_EDIT_SAVE: //复查单 编辑   保存
                if (!AuthorityManager.isMe(item.value.creatorId)) {
                    return null;
                }
            break;
            case API.QC_STATE_REPAIR_NEW_SAVE: //整改单 新建   保存
            case API.QC_STATE_REPAIR_EDIT_SAVE: //整改单 编辑   保存
                if (!AuthorityManager.isMe(item.value.responsibleUserId)) {
                    return null;
                }
            break;
        }
        
        let bSubmit = true;
        let bDelete = true;
        // let bSubmit = AuthorityManager.isQualityCheckSubmit();
        // let bDelete = AuthorityManager.isQualityCheckDelete();
        if (!(bSubmit || bDelete)) {
            return null;
        }
        return (
            <View style={[styles.contentActionView]}>
                {
                    bSubmit ? (<StatusActionButton color={API.toBillTypeColor(API.BILL_TYPE_ITEM_SUBMIT)} style={{elevation:0,width:58, height:28, borderWidth:0.5,borderColor:API.toBillTypeColor(API.BILL_TYPE_ITEM_SUBMIT), marginRight:14}}
                        onClick={() => { this._onNewSubmitAction(item, index,qcState) }} text={API.BILL_TYPE_ITEM_SUBMIT} />) : (null)
                }
                {
                    bDelete ? (<StatusActionButton color={API.toBillTypeColor(API.BILL_TYPE_ITEM_DELETE)} style={{elevation:0,width:58, height:28, borderWidth:0.5,borderColor:API.toBillTypeColor(API.BILL_TYPE_ITEM_DELETE), marginRight:14}}
                        onClick={() => { this._onNewDeleteAction(item, index,qcState) }} text={API.BILL_TYPE_ITEM_DELETE} />) : (null)
                }
            </View>
        )
    }

    // 整改
    renderRectifyAction = (item, index) => {
        if (AuthorityManager.isCreateRectify() && AuthorityManager.isMe(item.value.responsibleUserId)) {
            return (
                <View style={[styles.contentActionView]}>
                    <StatusActionButton color={API.toQcStateShowColor(item.value.qcState)}  style={{elevation:0,width:70, height:28, borderWidth:0.5, borderColor:API.toQcStateShowColor(item.value.qcState), marginRight:14}}
                        onClick={() => { this._onRectifyAction(item, index) }} text={API.TYPE_NEW_NAME_RECTIFY} />
                </View>
            )
        }
        return null;
    }
    // 复查
    renderReviewAction = (item, index) => {
        if (AuthorityManager.isCreateReview() && AuthorityManager.isMe(item.value.creatorId)) {
            return (
                <View style={[styles.contentActionView]}>
                    <StatusActionButton color={API.toQcStateShowColor(item.value.qcState)} style={{elevation:0,width:70, height:28, borderWidth:0.5,borderColor:API.toQcStateShowColor(item.value.qcState), marginRight:14}}
                        onClick={() => { this._onReviewAction(item, index) }} text={API.TYPE_NEW_NAME_REVIEW} />
                </View>
            )
        }
        return null;
    }
    // 操作条
    renderActionBar = (item, index) => {
        switch (item.value.qcState) {
            case API.QC_STATE_STAGED: {//待提交
                return this.renderSubmitAndDeleteAction(item, index)
            }
                break;
            case API.QC_STATE_UNRECTIFIED: {//待整改
                return this.renderRectifyAction(item, index)
            }
                break;
            case API.QC_STATE_UNREVIEWED: {//待复查
                return this.renderReviewAction(item, index)
            }
                break;
            case API.QC_STATE_DELAYED: {//已延迟
                return this.renderRectifyAction(item, index)
            }
                break;
                case API.QC_STATE_Q_NEW_SAVE: //检查单 新建   保存
                case API.QC_STATE_Q_EDIT_SAVE: //检查单 编辑   保存
                case API.QC_STATE_REPAIR_NEW_SAVE: //整改单 新建   保存
                case API.QC_STATE_REPAIR_EDIT_SAVE: //整改单 编辑   保存
                case API.QC_STATE_REVIEW_NEW_SAVE: //复查单 新建   保存
                case API.QC_STATE_REVIEW_EDIT_SAVE: //复查单 编辑   保存
            { 
                return this.renderDeleteAction(item, index,item.value.qcState)
            }
                break;
            default:
                break;
        }
    }
}

const styles = StyleSheet.create({
    contentActionView: {
        height: 50,
        alignItems: "center",
        alignContent: "center",
        flexDirection: 'row-reverse',
    },

    containerView: {
        flex: 1,
        borderRadius: 8,
        marginTop: 10,
        marginBottom: 10,
        marginLeft: 20,
        marginRight: 20,
        backgroundColor: '#FFF',
        elevation: 2.5, // android 
        shadowColor: "#333", // iOS
        shadowOffset: { width: 1.5, height: 5 }, // iOS
        shadowOpacity: 0.15, // iOS
        shadowRadius: 3, // iOS
    },
    contentHeaderView: {
        height: 44,
        alignItems: "center",
        alignContent: "center",
        flexDirection: 'row',
    },
    content: {
        marginTop: 14,
        marginLeft: 10,
        fontSize: 14,
        color: '#999999',
        flex:1,
    },
    contentView: {
        backgroundColor: '#fafafa',
        paddingRight:20,
        paddingBottom:14,
        alignContent: "center",
        flexDirection: 'row',
    },
    contentView_border: {
        borderBottomLeftRadius: 8,
        borderBottomRightRadius: 8,
    },
    image: {
        marginTop: 12,
        marginLeft: 14,
        width: 68,
        height: 68,
    },
    imageTime: {
        marginLeft: 13,
        width: 18.5,
        height: 18.5,
        resizeMode: 'contain'
    },
    contentTime: {
        marginLeft: 6.5,
        fontSize: 14,
        fontWeight:'100',
        color: '#333333',
    },
    contentStatus: {
        right: 14,
        top: 10,
        position: 'absolute',
        textAlign: 'right',
        fontSize: 15,
        color: 'green',
    },
});