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

const standardImage = require("app-images/icon_up_to_standard.png");
const notStandardImage = require("app-images/icon_not_up_to_standard.png");
const projectTimeImage = require("app-images/icon_time_black.png");

export default class EquipmentListCell extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            item: props.item,
            index: props.index,
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
    // 删除
    _onDeleteAction = (item, index) => {
        ActionModal.alertConfirm('是否确认删除？', "删除当前数据后，数据不可恢复哦！", { text: '取消'}, { text: '删除', onPress:()=>{
            this.props.onCellAction(item,index,'delete');
        } });
    }
    // 检查
    _onInspectAction = (item, index) => {

    }
    // 复查
    _onReviewAction = (item, index) => {
        BimFileEntry.showNewReviewPage(null,item.value.qualityCheckListId,API.CREATE_TYPE_REVIEW);
    }
    // 整改
    _onRectifyAction = (item, index) => {
        BimFileEntry.showNewReviewPage(null,item.value.qualityCheckListId,API.CREATE_TYPE_RECTIFY);
    }
    // 验收
    _onAcceptAction = (item, index) => {

    }

    _toDetail = (item) => {
        storage.pushNext(null, "EquipmentDetailPage", { "item": item });
    }
    renderItem = (item, index) => {
        let barItem = this.renderActionBar(item, index);
        let bToolbar = barItem ? true : false;
        let renderLine = bToolbar ? (<View style={{height:1, backgroundColor:'#fafafa'}}></View>) : null
        let hightlightData = this.searchHighlightData(this.props.keywords,item.value.facilityName);
        return (
            <TouchableOpacity activeOpacity={0.5} onPress={() => { this._toDetail(item) }}>
                <View style={[styles.containerView,]}>
                    <View style={[styles.contentHeaderView]}>
                        <Image source={projectTimeImage} style={styles.imageTime} />
                        <Text style={styles.contentTime}>进场日期：{API.formatUnixtimestampSimple(item.value.approachDate)}</Text>
                        <Text style={[styles.contentStatus, { color: item.value.qcStateColor }]}>{item.value.qcStateShow}</Text>
                    </View>
                    <View style={{height:1, backgroundColor:'#fafafa'}}></View>
                    <View style={[styles.contentView, !bToolbar? styles.contentView_border:{}]}>
                        <Text style={styles.content}>批号：{item.value.batchCode}</Text>
                        <Text style={styles.content}>编码：{item.value.facilityCode}</Text>
                        <Text style={styles.content}>名称：{
                            hightlightData.map((item, index)=>{
                                if(item.highlight){
                                    return <Text key={index} style={[styles.content,{color:"#00baf3"}]}>{item.text}</Text>
                                }else{
                                    return <Text key={index} style={styles.content}>{item.text}</Text>
                                }
                            })

                        }</Text>
                        
                        <View style={{height:10, backgroundColor:'#ffffff'}}></View>
                    </View>
                    {renderLine}
                    {barItem}
                    {this.renderImage(item)}
                </View>
            </TouchableOpacity>
        );
    }

    searchHighlightData = (keywords, content) => {
        let data = [];
        if( content && content.length > 0){
            if(keywords && keywords.length > 0){
                let len = keywords.length;
                let index = content.indexOf(keywords);
                while(index > -1){
                    let str1 = content.substring(0, index);
                    let str2 = content.substring(index,index+len);
                    data.push({highlight:false,text:str1})
                    data.push({highlight:true,text:str2})
                    content = content.substring(index+len);
                    index = content.indexOf(keywords);
                }
            }
            data.push({highlight:false,text:content})
        }
        return data;
    }

    renderImage = (item) => {
        // if(item.value.qcState != API.QC_STATE_EDIT) return;
        let imageSource = null
        if (item.value.committed === true) {
            if(item.value.qualified === true) {
                imageSource = standardImage;
            } else {
                imageSource = notStandardImage;
            }
            if(imageSource) {
                return (<Image source={imageSource} style={[styles.image]} />)
            }
        }
        
        return null
    }
    // 提交 & 删除
    renderSubmitAndDeleteAction = (item, index) => {
        // if (!AuthorityManager.isMe(item.value.creatorId)) {
        //     return null;
        // }
        let bSubmit = AuthorityManager.isEquipmentCreate();
        let bDelete = AuthorityManager.isEquipmentDelete();
        if (!(bSubmit || bDelete)) {
            return null;
        }
        return (
            <View style={[styles.contentActionView]}>
                {
                    bSubmit ? (<StatusActionButton color={API.toBillTypeColor(API.BILL_TYPE_ITEM_SUBMIT)} width={80} marginRight={20}
                        onClick={() => { this._onSubmitAction(item, index) }} text={API.BILL_TYPE_ITEM_SUBMIT} />) : (null)
                }
                {
                    bDelete ? (<StatusActionButton color={API.toBillTypeColor(API.BILL_TYPE_ITEM_DELETE)} width={80} marginRight={20}
                        onClick={() => { this._onDeleteAction(item, index) }} text={API.BILL_TYPE_ITEM_DELETE} />) : (null)
                }
            </View>
        )
    }

    // 操作条
    renderActionBar = (item, index) => {
        if (!item.value.committed === true) {
           return this.renderSubmitAndDeleteAction(item, index)
        }
        return null;
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
        height: 40,
        alignItems: "center",
        alignContent: "center",
        flexDirection: 'row',
    },
    content: {
        marginTop: 10,
        marginLeft: 20,
        fontSize: 15,
        color: '#666',
    },
    contentView: {
        left: 0,
        backgroundColor: '#ffffff',
        overflow: 'hidden',
        // alignItems: "center",
        // alignContent: "center",
        flexDirection: 'column',
    },
    contentView_border: {
        borderBottomLeftRadius: 8,
        borderBottomRightRadius: 8,
    },
    image: {
        marginTop: 16,
        width: 75,
        height: 75,
        right: 20,
        bottom: -7,
        position:'absolute',
        resizeMode:'contain',
    },
    imageTime: {
        marginLeft: 10,
        width: 20,
        height: 20,
    },
    contentTime: {
        marginLeft: 10,
        fontSize: 14,
        color: '#666',
    },
    contentStatus: {
        right: 10,
        top: 10,
        position: 'absolute',
        textAlign: 'right',
        fontSize: 15,
        color: 'green',
    },
});