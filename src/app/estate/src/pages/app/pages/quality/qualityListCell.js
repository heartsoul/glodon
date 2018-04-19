'use strict';
import React, {Component,PureComponent} from "react";
import {Animated, StyleSheet, Text, View ,Image,
     Button,TouchableOpacity,Dimensions} from "react-native";
import * as API from "app-api"; 
import {StatusActionButton} from "app-components"
var { width, height } = Dimensions.get("window");

import {AuthorityManager} from "app-entry"; 

const projectImage =  require("app-images/icon_choose_project_item.png");
const projectTimeImage = require("app-images/icon_time_black.png");


export default class QualityListCell extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            item: props.item,
            index: props.index,
        }
    }
    render() {
        return this.renderItem(this.state.item,this.state.index);
    }
    _toQcStateShowColor = (qcState)=> {
        // console.log(qcState);
        let ret = API.toQcStateShowColor(qcState);
        // console.log(ret);

        if(ret == 'red') {
            return 1;
        }
        if(ret == 'orange') {
            return 2;
        }
        return 0;
    }
    _toDetail = (item) => {
        // 未提交状态就进入编辑
        if(item.value.qcState === API.QC_STATE_STAGED) {
            storage.pushNext(null,"NewPage",{"item":item});
        } else {
            storage.pushNext(null,"QualityDetailPage",{"item":item});
        }
    }
    renderItem = (item,index) => {
        return (
            <TouchableOpacity activeOpacity={0.5} onPress={()=>{this._toDetail(item)}}>
                <View style={[styles.containerView,]}>
                    <View style={[styles.contentHeaderView]}>
                        <Image
                            source={projectTimeImage}
                            style={styles.imageTime} />
                        <Text style={styles.contentTime}>{item.value.showTime}</Text>
                        {
                            this._toQcStateShowColor(item.value.qcState) == 1 ? (
                                <Text style={[styles.contentStatus, { color: 'red' }]}>{item.value.qcStateShow}</Text>
                            ) : (this._toQcStateShowColor(item.value.qcState) == 2 ? (
                                <Text style={[styles.contentStatus, { color: 'orange' }]}>{item.value.qcStateShow}</Text>

                            ) : (
                                    <Text style={[styles.contentStatus]}>{item.value.qcStateShow}</Text>
                                ))
                        }
                    </View>
                    <View style={[styles.contentView, index % 2 == 1 ? {} : styles.contentView_border]}>

                        {
                            item.url == undefined ? (<Image
                                source={projectImage}
                                style={styles.image} />) : (<Image
                                    source={{ uri: item.url }}
                                    style={styles.image} />)
                        }

                        <Text style={styles.content}>{item.value.description}</Text>
                    </View>
                    {
                        ((AuthorityManager.isQualityCheckSubmit() && AuthorityManager.isMe(item.value.creatorId))) ? (
                            <View style={[styles.contentActionView]} >
                            <View style={{width:20}}></View>
                            <StatusActionButton color="green" width={80} onClick={() => { alert('提交') }} text="提交"/>
                            <View style={{width:20}}></View>
                            <StatusActionButton color="red"  width={80} onClick={() => { alert('删除') }} text="删除"/>
                            </View>
                        ) : (
                            null
                        ) 
                    }
                </View>
            </TouchableOpacity>
        );
  }
//   renderActionBar = (itemData, index) => {
//     let item = itemData.value;
//     API.QUALITY_CHECK_LIST_SHOW_REPAIR
//     switch(item.qcState) {
//         case API.QC_STATE_STAGED: {
//             return (
//                 <View style={[styles.contentActionView]} >
//                                 <View style={{width:20}}></View>
//                                 <StatusActionButton color="green" width={80} onClick={() => { alert('提交') }} text="提交"/>
//                                 <View style={{width:20}}></View>
//                                 <StatusActionButton color="red"  width={80} onClick={() => { alert('删除') }} text="删除"/>
//                                 </View>
//             )
//         }
//         break;
//         case API.QC_STATE_STAGED: {
//             return (
//                 <View style={[styles.contentActionView]} >
//                                 <View style={{width:20}}></View>
//                                 <StatusActionButton color="green" width={80} onClick={() => { alert('提交') }} text="提交"/>
//                                 <View style={{width:20}}></View>
//                                 <StatusActionButton color="red"  width={80} onClick={() => { alert('删除') }} text="删除"/>
//                                 </View>
//             )
//         }
//         break;
//         case API.QC_STATE_STAGED: {
//             return (
//                 <View style={[styles.contentActionView]} >
//                                 <View style={{width:20}}></View>
//                                 <StatusActionButton color="green" width={80} onClick={() => { alert('提交') }} text="提交"/>
//                                 <View style={{width:20}}></View>
//                                 <StatusActionButton color="red"  width={80} onClick={() => { alert('删除') }} text="删除"/>
//                                 </View>
//             )
//         }
//         break;
//         case API.QC_STATE_STAGED: {
//             return (
//                 <View style={[styles.contentActionView]} >
//                                 <View style={{width:20}}></View>
//                                 <StatusActionButton color="green" width={80} onClick={() => { alert('提交') }} text="提交"/>
//                                 <View style={{width:20}}></View>
//                                 <StatusActionButton color="red"  width={80} onClick={() => { alert('删除') }} text="删除"/>
//                                 </View>
//             )
//         }
//         break;
//         case API.QC_STATE_STAGED: {
//             return (
//                 <View style={[styles.contentActionView]} >
//                                 <View style={{width:20}}></View>
//                                 <StatusActionButton color="green" width={80} onClick={() => { alert('提交') }} text="提交"/>
//                                 <View style={{width:20}}></View>
//                                 <StatusActionButton color="red"  width={80} onClick={() => { alert('删除') }} text="删除"/>
//                                 </View>
//             )
//         }
//         break;
//         case API.QC_STATE_STAGED: {
//             return (
//                 <View style={[styles.contentActionView]} >
//                                 <View style={{width:20}}></View>
//                                 <StatusActionButton color="green" width={80} onClick={() => { alert('提交') }} text="提交"/>
//                                 <View style={{width:20}}></View>
//                                 <StatusActionButton color="red"  width={80} onClick={() => { alert('删除') }} text="删除"/>
//                                 </View>
//             )
//         }
//         break;
//         case API.QC_STATE_STAGED: {
//             return (
//                 <View style={[styles.contentActionView]} >
//                                 <View style={{width:20}}></View>
//                                 <StatusActionButton color="green" width={80} onClick={() => { alert('提交') }} text="提交"/>
//                                 <View style={{width:20}}></View>
//                                 <StatusActionButton color="red"  width={80} onClick={() => { alert('删除') }} text="删除"/>
//                                 </View>
//             )
//         }
//         break;
//         case API.QC_STATE_STAGED: {
//             return (
//                 <View style={[styles.contentActionView]} >
//                                 <View style={{width:20}}></View>
//                                 <StatusActionButton color="green" width={80} onClick={() => { alert('提交') }} text="提交"/>
//                                 <View style={{width:20}}></View>
//                                 <StatusActionButton color="red"  width={80} onClick={() => { alert('删除') }} text="删除"/>
//                                 </View>
//             )
//         }
//         break;
//     }
//     return null;
//   }
//   renderItemA {
   

//     switch (item.qcState){
//         case CommonConfig.QC_STATE_STAGED:
//             color = R.color.c_f39b3d;
//             statusText = "待提交";
//             sHolder.mBottomPreant.setVisibility(View.GONE);
//             sHolder.mBottomLineView.setVisibility(View.GONE);
//             sHolder.mRepairBtn.setVisibility(View.GONE);
//             sHolder.mReviewBtn.setVisibility(View.GONE);
//             if(AuthorityManager.isQualityCheckSubmit() && AuthorityManager.isMe(item.creatorId)){
//                 sHolder.mSubmitBtn.setVisibility(View.VISIBLE);
//                 sHolder.mBottomPreant.setVisibility(View.VISIBLE);
//                 sHolder.mBottomLineView.setVisibility(View.VISIBLE);
//             }else{
//                 sHolder.mSubmitBtn.setVisibility(View.GONE);
//             }
//             if(AuthorityManager.isQualityCheckDelete() && AuthorityManager.isMe(item.creatorId)){
//                 sHolder.mDeleteBtn.setVisibility(View.VISIBLE);
//                 sHolder.mBottomPreant.setVisibility(View.VISIBLE);
//                 sHolder.mBottomLineView.setVisibility(View.VISIBLE);
//             }else{
//                 sHolder.mDeleteBtn.setVisibility(View.GONE);
//             }
//             break;
//         case CommonConfig.QC_STATE_UNRECTIFIED:
//             color = R.color.c_f33d3d;
//             statusText = "待整改";
//             sHolder.mBottomPreant.setVisibility(View.GONE);
//             sHolder.mBottomLineView.setVisibility(View.GONE);
//             sHolder.mSubmitBtn.setVisibility(View.GONE);
//             sHolder.mDeleteBtn.setVisibility(View.GONE);
//             if(AuthorityManager.isCreateRepair()&& AuthorityManager.isMe(item.responsibleUserId)) {
//                 sHolder.mRepairBtn.setVisibility(View.VISIBLE);
//                 sHolder.mBottomPreant.setVisibility(View.VISIBLE);
//                 sHolder.mBottomLineView.setVisibility(View.VISIBLE);
//             }else{
//                 sHolder.mRepairBtn.setVisibility(View.GONE);
//             }
//             sHolder.mReviewBtn.setVisibility(View.GONE);
//             break;
//         case CommonConfig.QC_STATE_UNREVIEWED:
//             color = R.color.c_f33d3d;
//             statusText = "待复查";
//             sHolder.mBottomPreant.setVisibility(View.GONE);
//             sHolder.mBottomLineView.setVisibility(View.GONE);
//             sHolder.mSubmitBtn.setVisibility(View.GONE);
//             sHolder.mDeleteBtn.setVisibility(View.GONE);
//             sHolder.mRepairBtn.setVisibility(View.GONE);
//             if(AuthorityManager.isCreateReview()&& AuthorityManager.isMe(item.creatorId)) {
//                 sHolder.mReviewBtn.setVisibility(View.VISIBLE);
//                 sHolder.mBottomPreant.setVisibility(View.VISIBLE);
//                 sHolder.mBottomLineView.setVisibility(View.VISIBLE);
//             }else{
//                 sHolder.mReviewBtn.setVisibility(View.GONE);
//             }
//             break;
//         case CommonConfig.QC_STATE_INSPECTED:
//             sHolder.mBottomPreant.setVisibility(View.GONE);
//             sHolder.mBottomLineView.setVisibility(View.GONE);
//             color = R.color.c_28d575;
//             statusText = "已检查";
//             break;
//         case CommonConfig.QC_STATE_REVIEWED:
//             sHolder.mBottomPreant.setVisibility(View.GONE);
//             sHolder.mBottomLineView.setVisibility(View.GONE);
//             color = R.color.c_28d575;
//             statusText = "已复查";
//             break;
//         case CommonConfig.QC_STATE_DELAYED:
//             sHolder.mBottomPreant.setVisibility(View.GONE);
//             sHolder.mBottomLineView.setVisibility(View.GONE);
//             sHolder.mDeleteBtn.setVisibility(View.GONE);
//             sHolder.mSubmitBtn.setVisibility(View.GONE);
//             color = R.color.c_f33d3d;
//             if(AuthorityManager.isCreateRepair()&& AuthorityManager.isMe(item.responsibleUserId)) {
//                 sHolder.mRepairBtn.setVisibility(View.VISIBLE);
//                 sHolder.mBottomPreant.setVisibility(View.VISIBLE);
//                 sHolder.mBottomLineView.setVisibility(View.VISIBLE);
//             }else{
//                 sHolder.mRepairBtn.setVisibility(View.GONE);
//             }
//             statusText = "已延迟";
//             break;
//         case CommonConfig.QC_STATE_ACCEPTED:
//             sHolder.mBottomPreant.setVisibility(View.GONE);
//             sHolder.mBottomLineView.setVisibility(View.GONE);
//             color = R.color.c_28d575;
//             statusText = "已验收";
//             break;
//     }
//     sHolder.mStatusView.setText(statusText);
//     sHolder.mStatusView.setTextColor(mContext.getResources().getColor(color));

//     if(item.files!=null && item.files.size()>0){
//         ImageLoader.showImageCenterCrop(mContext,item.files.get(0).url,sHolder.mImageView,R.drawable.icon_default_image);
//     }else{
//         sHolder.mImageView.setImageBitmap(null);
//         sHolder.mImageView.setBackgroundResource(R.drawable.icon_default_image);
//     }
//     sHolder.mDesView.setText(item.description);


// }

// if (holder instanceof TimeHolder) {
//     TimeHolder tHolder = (TimeHolder) holder;
//     if (position == 0) {
//         tHolder.mTimeParent.setPadding(ScreenUtil.dp2px(20), ScreenUtil.dp2px(20), ScreenUtil.dp2px(20), 0);
//     } else {
//         tHolder.mTimeParent.setPadding(ScreenUtil.dp2px(20), ScreenUtil.dp2px(10), ScreenUtil.dp2px(20), 0);
//     }
//     if (item.timeType == 0) {
//         tHolder.mTodayView.setVisibility(View.VISIBLE);
//         tHolder.mBeforeView.setVisibility(View.GONE);
//         tHolder.mTodayView.setText("今天");
//     } else {
//         tHolder.mTodayView.setVisibility(View.GONE);
//         tHolder.mBeforeView.setVisibility(View.VISIBLE);
//         tHolder.mBeforeTextView.setText(DateUtil.getListDate(Long.parseLong(item.updateTime)));
//     }
// }
//   }
}

const styles = StyleSheet.create({
    contentActionView: {
        height:50,
        alignItems: "center",
        alignContent: "center",
        flexDirection:'row-reverse',
    },
    
    containerView:{
        flex: 1,
        borderRadius:8,
        marginTop: 10,
        
        marginBottom: 10,
        marginLeft: 20,
        marginRight: 20,
        backgroundColor: '#FFF',
        elevation:2.5, // android 
        shadowColor:"#333", // iOS
        shadowOffset:{width:1.5,height:5}, // iOS
        shadowOpacity:0.15, // iOS
        shadowRadius:3, // iOS
    },
    contentHeaderView:{
        height:40,
        alignItems: "center",
        alignContent: "center",
        flexDirection:'row',
    },
    content: {
        marginTop:10,
        marginLeft:10,
        fontSize: 15,
        color: 'black',
    },
    contentView: {
        left: 0,
        backgroundColor: '#fafafa',
        overflow:'hidden',
        // alignItems: "center",
        alignContent: "center",
        flexDirection:'row',
    },
    contentView_border: {
        borderBottomLeftRadius:8,
        borderBottomRightRadius:8,
    },
    image:{
        marginTop:10,
        marginBottom:10,
        marginLeft:10,
        width:60,
        height:60,
    },
    imageTime:{
        marginLeft:10,
        width:20,
        height:20,
    },
    contentTime: {
        marginLeft: 10,
        fontSize: 14,
        color: 'black',
    },
    contentStatus: {
        right: 10,
        top: 10,
        position:'absolute',
        textAlign:'right',
        fontSize: 15,
        color: 'green',
    },
});