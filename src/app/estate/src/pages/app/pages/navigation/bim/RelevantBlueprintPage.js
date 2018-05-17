import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Dimensions,
    Text,
    View,
    Image,
    WebView,
    SafeAreaView,
    StatusBar,
    TouchableOpacity,
} from 'react-native';

import { Toast } from 'antd-mobile';

import * as AppConfig from "common-module";
import * as PageType from "./PageTypes";
import * as BimToken from "./BimFileTokenUtil";
import * as AuthorityManager from "./../project/AuthorityManager";
import * as API from "app-api";
import { ActionSheet } from 'app-3rd/teaset';
import { BimFileEntry } from "app-entry";

//获取设备的宽度和高度
var {
    height: deviceHeight,
    width: deviceWidth
} = Dimensions.get('window');
const cmdString = "\
function callMessage(action, data, callbackName) { \
  let actionIn = 'unknown'; let dataIn = {}; let callbackNameIn = 'defaultReturn';\
  if(action) { actionIn = action;} else {alert('无效调用');return;}\
  if(data) { dataIn = data;}\
  if(callbackName) { callbackNameIn = callbackName; } \
  let cmd = JSON.stringify({action:actionIn,data:dataIn,callback:callbackNameIn});\
  window.postMessage(cmd);\
}\
window.modelEvent = {\
  defaultReturn : function(data) {console.log('执行命令成功:'+data);},\
  invalidateToken : function() { callMessage('invalidateToken');},\
  getPosition : function(jsonData) { callMessage('getPosition', jsonData);},\
  getPositionInfo : function(jsonData) { callMessage('getPositionInfo', jsonData);},\
};\
document.addEventListener('message', function(e) {eval(e.data);});\
";

//关联图纸
export default class RelevantBlueprintPage extends Component {

    static navigationOptions = ({ navigation, screenProps }) => ({
        headerTitle: navigation.state.params.loadTitle ? navigation.state.params.loadTitle() : null,
        headerLeft: navigation.state.params.loadLeftTitle ? navigation.state.params.loadLeftTitle() : null,
        headerRight: navigation.state.params.loadRightTitle ? navigation.state.params.loadRightTitle() : null,
    });

    constructor(props) {
        super(props);
        this.state = {
            drawingPositionX: '',
            drawingPositionY: '',
            showFinishView: false,//显示完成
            name: '',
            pageType: PageType.PAGE_TYPE_NEW_QUALITY,// 0新建检查单 1检查单编辑状态 2详情查看  3图纸模式
            show: false,// true  不响应长按事件  false响应长按事件 (0、1、3响应 ，2 不响应)
            showCreateNoticeView: true,//新建提示弹窗
            showCreateButton: true,//显示创建按钮
            url: '',
        };
        this.props.navigation.setParams({ loadTitle: this.loadTitle, loadLeftTitle: this.loadLeftTitle, loadRightTitle: this.loadRightTitle })

    }
    loadTitle = () => {
        return (
            <Text style={{ color: '#ffffff', fontSize: 17, marginTop: 5, alignSelf: "center", flex: 1, textAlign: "center" }}>{this.state.drawingName ? this.state.drawingName : '图纸'}</Text>
        );
    }
    renderEditLeftTitle = () => {
        return (
            <View style={{ flexDirection: "row", alignItems: "center" }}>
                <TouchableOpacity onPress={() => { this.goBack() }}>
                    <Image source={require('app-images/icon_back_white.png')} style={{ width: 9, height: 20, marginLeft: 10 }} />
                </TouchableOpacity>

                {
                    //编辑状态的可以切换图纸
                    (this.state.pageType == PageType.PAGE_TYPE_EDIT_QUALITY) ? (
                        <TouchableOpacity onPress={() => { this.changeBluePrint() }}>
                            <Image source={require('app-images/icon_change_blueprint.png')} style={{ width: 25, height: 24, marginLeft: 20 }} />
                        </TouchableOpacity>
                    ) : (
                            null
                        )
                }
            </View>
        );
    }

    loadLeftTitle = () => {
        return (
            <View style={{ flexDirection: "row", alignItems: "center" }} >
                {
                    this.state.showFinishView ? (
                        <View>
                            <TouchableOpacity onPress={() => { this.removePosition() }}>
                                <Text style={{ color: '#ffffff', fontSize: 15, marginTop: 5, marginLeft: 20 }}>取消</Text>
                            </TouchableOpacity>
                        </View>
                    ) : (
                            this.renderEditLeftTitle()
                        )
                }
            </View>
        );
    }

    renderEditRightTitle = () => {
        if (this.state.showFinishView) {
            return (
                <View style={{ flex: 1, alignItems: "center" }}>
                    <TouchableOpacity onPress={() => { this.finish() }}>
                        <Text style={{ color: '#ffffff', fontSize: 15, marginTop: 5, marginRight: 20 }}>完成</Text>
                    </TouchableOpacity>
                </View>
            );
        } else if (this.state.showCreateButton) {
            return (
                <Text style={{ color: '#ffffff', fontSize: 15, marginRight: 20, marginTop: 5, }}>长按新建</Text>
            );
        }
        return null;
    }

    loadRightTitle = () => {
        if (this.state.pageType != PageType.PAGE_TYPE_DETAIL) {
            return this.renderEditRightTitle();
        }
        return null;
    }
    componentDidMount = () => {
        let params = this.props.navigation.state.params;

        let pageType = params.pageType;
        let relevantBlueprint = params.relevantBlueprint;

        let showFinishView = false;
        //编辑页进入直接显示完成页面
        if (pageType == PageType.PAGE_TYPE_EDIT_QUALITY || pageType == PageType.PAGE_TYPE_EDIT_EQUIPMENT) {
            showFinishView = true;
        }
        //详情页不响应长按事件
        let show = (pageType == PageType.PAGE_TYPE_DETAIL);
        if(pageType == PageType.PAGE_TYPE_QUALITY_MODEL && !AuthorityManager.isQualityCreate()){
            show = true;
        }
            
        let showCreateNoticeView = true;
        let showCreateButton = true;
        if (pageType == PageType.PAGE_TYPE_DETAIL) {
            showCreateNoticeView = false;
        } else if (pageType == PageType.PAGE_TYPE_QUALITY_MODEL) {
            //判断是否有创建权限
            if (!AuthorityManager.isQualityCreate()) {
                showCreateNoticeView = false;
                showCreateButton = false;
            }
        }

        this.setState({
            drawingGdocFileId: relevantBlueprint.drawingGdocFileId,
            drawingName: relevantBlueprint.drawingName,
            drawingPositionX: relevantBlueprint.drawingPositionX,
            drawingPositionY: relevantBlueprint.drawingPositionY,
            pageType: pageType,
            showFinishView: showFinishView,
            show: show,
            showCreateNoticeView: showCreateNoticeView,
            showCreateButton: showCreateButton,
        });

        //长按提示View
        const timer = setTimeout(() => {
            clearTimeout(timer);
            this.setState({
                showCreateNoticeView: false,
            })
        }, 4000);


        BimToken.getBimFileToken(relevantBlueprint.drawingGdocFileId, (token) => {
            let url = AppConfig.BASE_URL_BLUEPRINT_TOKEN + token + `&show=${this.state.show}`;
            this.setState({
                url: url
            });
        })

    }

    createNoticeView = () => {
        return (
            <View style={{ alignItems: 'flex-end', position: 'absolute', right: 10 }}>
                <Image source={require('app-images/icon_blue_trangle_up.png')} style={{ width: 20, height: 20, marginRight: 30 }} />
                <Text style={{ backgroundColor: '#00baf3', borderRadius: 6, color: '#ffffff', fontSize: 16, padding: 10, marginTop: -8 }}>手指长按屏幕可以在当前位{"\n"}置新建检查单或者质检单哦</Text>
            </View>
        )
    }

    goBack = () => {
        storage.goBack(this.props.navigation, null);
    }
    changeBluePrint = () => {
        let navigator = this.props.navigation;

        storage.pushNext(navigator, "BimFileChooserPage", { fileId: 0, dataType: '图纸文件', pageType: PageType.PAGE_TYPE_NEW_QUALITY })
    }
    setPosition = () => {
        let position = [{
            x: this.state.drawingPositionX,
            y: this.state.drawingPositionY,
            z: 0,
        }];
        this.refs.webview.injectJavaScript("javascript:loadPinItems('" + JSON.stringify(position) + "');")
    }

    //移除图钉
    removePosition = () => {
        this.refs.webview.injectJavaScript('javascript:removeDrawableItem();')

        this.setState({
            showFinishView: false,
        }, () => {
            this.props.navigation.setParams({ loadTitle: this.loadTitle, loadLeftTitle: this.loadLeftTitle, loadRightTitle: this.loadRightTitle })
        });
    }

    //完成
    finish = () => {

        let relevantBlueprint = {
            drawingGdocFileId: this.state.drawingGdocFileId,
            drawingName: this.state.drawingName,
            drawingPositionX: this.state.drawingPositionX,
            drawingPositionY: this.state.drawingPositionY,
        }
        // console.log(this.state.pageType)
        // 0新建检查单 1检查单编辑状态 2详情查看  3图纸模式
        if (this.state.pageType == PageType.PAGE_TYPE_NEW_QUALITY) {
            storage.bimFileChooseCallback(relevantBlueprint, '图纸文件');
            this.props.navigation.pop("NewPage");
        } else if (this.state.pageType == PageType.PAGE_TYPE_EDIT_QUALITY) {
            storage.bimFileChooseCallback(relevantBlueprint, '图纸文件');
            this.props.navigation.goBack();
        } else if (this.state.pageType == PageType.PAGE_TYPE_DETAIL) {
            this.props.navigation.goBack();
        } else if (this.state.pageType == PageType.PAGE_TYPE_QUALITY_MODEL) {
            this.props.navigation.replace('NewPage', { relevantBlueprint: relevantBlueprint });
        }
    }

    onMessage = (e) => {
        // console.log(e.nativeEvent.data);
        let data = JSON.parse(e.nativeEvent.data);
        let action = data.action;
        if (action) {
            switch (action) {
                case 'invalidateToken':
                    {
                        this.invalidateToken();
                    }
                    break;
                case 'getPosition':
                    {
                        this.getPosition(data.data);
                    }
                    break;
                case 'getPositionInfo':
                    {
                        this.getPositionInfo(data.data);
                    }
                    break;
                default:
                    break;
            }
        }
    }
    //token失效的情况
    invalidateToken() {
        // LogUtil.e("invalidateToken");
        // showTokenError();
    }


    //点击构件返回信息
    getPosition(json) {
        json = JSON.parse(json);
        this.setState({
            drawingPositionX: json.x,
            drawingPositionY: json.y,
            showFinishView: true,
        }, () => {
            this.props.navigation.setParams({ loadTitle: this.loadTitle, loadLeftTitle: this.loadLeftTitle, loadRightTitle: this.loadRightTitle })
        })
    }
    //点击圆点 返回信息
    getPositionInfo(json) {
        if (!json) {
            return;
        }
        let dot = JSON.parse(json);
        switch (dot.qcState) {
            case API.QC_STATE_UNRECTIFIED://"待整改"
            case API.QC_STATE_DELAYED://"已延迟"
                this.showRepairDialog(dot, AuthorityManager.isCreateRectify() && AuthorityManager.isMe(dot.responsibleUserId), AuthorityManager.isQualityBrowser());
                break;
            case API.QC_STATE_UNREVIEWED://"待复查"
                this.showReviewDialog(dot, AuthorityManager.isCreateReview() && AuthorityManager.isMe(dot.inspectionUserId), AuthorityManager.isQualityBrowser());
                break;
            case API.QC_STATE_INSPECTED://"已检查"
            case API.QC_STATE_REVIEWED://"已复查"
            case API.QC_STATE_ACCEPTED://"已验收"
                this.showDetailDialog(dot, AuthorityManager.isQualityBrowser());
                break;
        }


    }

    showRepairDialog = (dot, create, browser) => {
        let items = [];
        if (create) {
            items.push({
                title: "新建整改单",
                onPress: () => {
                    BimFileEntry.showNewReviewPage(this.props.navigation, dot.inspectionId, API.CREATE_TYPE_RECTIFY);
                }
            });
        }
        if (browser) {
            items.push({
                title: "查看检查单",
                onPress: () => {
                    let item = {}
                    item.value = {}
                    item.value.id = dot.inspectionId;
                    storage.pushNext(null, "QualityDetailPage", { "item": item });
                }
            });
        }
        let cancelItem = { title: '取消' };
        if (items.length > 0) {
            ActionSheet.show(items, cancelItem);
        }
    }
    showReviewDialog = (dot, create, browser) => {
        let items = [];
        if (create) {
            items.push({
                title: "新建复查单",
                onPress: () => {
                    BimFileEntry.showNewReviewPage(this.props.navigation, dot.inspectionId, API.CREATE_TYPE_REVIEW);
                }
            });
        }
        if (browser) {
            items.push({
                title: "查看检查单",

                onPress: () => {
                    let item = {}
                    item.value = {}
                    item.value.id = dot.inspectionId;
                    storage.pushNext(null, "QualityDetailPage", { "item": item });
                }
            });
        }
        let cancelItem = { title: '取消' };
        if (items.length > 0) {
            ActionSheet.show(items, cancelItem);
        }
    }

    showDetailDialog = (dot, browser) => {
        let items = [];
        if (browser) {
            items.push({
                title: "查看检查单",

                onPress: () => {
                    let item = {}
                    item.value = {}
                    item.value.id = dot.inspectionId;
                    storage.pushNext(null, "QualityDetailPage", { "item": item });
                }
            });
        }
        let cancelItem = { title: '取消' };
        if (items.length > 0) {
            ActionSheet.show(items, cancelItem);
        }
    }
    //在WebView中注册该回调方法

    onNavigationStateChange(event) {
        // console.log('onNavigationStateChange:');
        // console.log(event); //打印出event中属性
    }

    getBluePrintDots = () => {
        if (this.state.pageType == PageType.PAGE_TYPE_QUALITY_MODEL) {
            API.getBluePrintDots(storage.loadProject(), this.state.drawingGdocFileId)
                .then(responseData => {
                    this.refs.webview.injectJavaScript("javascript:loadCircleItems('" + JSON.stringify(responseData.data) + "');")
                }).catch(error => {
                    console.log(error)
                })
        }
    }
    //渲染
    render() {

        // let url = AppConfig.BASE_URL_BLUEPRINT_TOKEN + storage.bimToken + `&show=${this.state.show}`;

        return (
            <SafeAreaView style={[styles.container, { backgroundColor: '#ecf0f1' }]}>
                <StatusBar barStyle="light-content" translucent={false} backgroundColor="#00baf3" />
                <View style={styles.container}>

                    <WebView bounces={false}
                        ref="webview"
                        onNavigationStateChange={() => this.onNavigationStateChange}
                        scalesPageToFit={true}
                        javaScriptEnabled={true}
                        domStorageEnabled={false}
                        onMessage={(e) => this.onMessage(e)}
                        injectedJavaScript={cmdString}
                        onLoadEnd={() => { this.setPosition(); this.getBluePrintDots() }}
                        source={{ uri: this.state.url, method: 'GET' }}
                        style={{ width: deviceWidth, height: deviceHeight }}>
                    </WebView>
                    {
                        this.state.showCreateNoticeView ? (
                            this.createNoticeView()
                        ) : (null)
                    }

                </View>
            </SafeAreaView>
        );
    }

}

//样式定义
const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 0
    }
});
