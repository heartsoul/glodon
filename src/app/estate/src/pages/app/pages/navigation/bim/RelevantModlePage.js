import { Toast } from 'antd-mobile';
import { ActionSheet } from 'app-3rd/teaset';
import * as API from "app-api";
import { LoadingView, NoDataView } from 'app-components';
import { BimFileEntry } from "app-entry";
import * as AppConfig from "common-module";
import React, { Component } from 'react';
import { Dimensions, Image, SafeAreaView, StatusBar, StyleSheet, Text, TouchableOpacity, View, WebView } from 'react-native';
import { connect } from 'react-redux';
import * as RelevantModelAction from "./../../../actions/relevantModelAction";
import * as AuthorityManager from "./../project/AuthorityManager";
import * as BimToken from "./BimFileTokenUtil";
import * as PageType from "./PageTypes";
import { bimfileHtml } from './bimfileHtml';


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
  loadDotsData : function() { callMessage('loadDotsData');},\
  cancelPosition : function() { callMessage('cancelPosition');},\
  getPosition : function(jsonData) { callMessage('getPosition', jsonData);},\
  getPositionInfo : function(jsonData) { callMessage('getPositionInfo', jsonData);},\
};\
document.addEventListener('message', function(e) {eval(e.data);});\
";

/**
 * 关联模型
 */
class RelevantModelPage extends Component {

    static navigationOptions = ({ navigation, screenProps }) => ({
        headerTitle: (<Text style={{ color: '#ffffff', fontSize: 17, marginTop: 5, alignSelf: "center", flex: 1, textAlign: "center" }}>点击选择</Text>),
        headerLeft: navigation.state.params.loadLeftTitle ? navigation.state.params.loadLeftTitle() : null,
        headerRight: navigation.state.params.loadRightTitle ? navigation.state.params.loadRightTitle() : null,
    });
    mQualityPositionMap = [];
    mEquipmentPositionMap = [];
    requestElementNameCount = 0;
    requestEquipmentElementNameCount = 0;

    constructor(props) {
        super(props);
        this.state = {
            showFinishView: false,//显示完成
            pageType: PageType.PAGE_TYPE_NEW_QUALITY,// 0新建检查单 1检查单编辑状态 2详情查看  3质检单模型模式  4新建材设进场 5新增材设进场编辑状态  6材设模型模式
            showChangeMode: false,//显示切换模型 pageType为1、5时为true
            showAddIcon: false,//显示创建按钮 pageType为 2 或者 3、6无创建权限时为false
            relevantModel: {},//选中的模型
            url: '',
            html: '',
            error:null
        };
        this.props.navigation.setParams({ loadLeftTitle: this.loadLeftTitle, loadRightTitle: this.loadRightTitle })
    }

    loadLeftTitle = () => {
        return (
            <View style={{ flexDirection: 'row', alignItems: "center" }}>
                <TouchableOpacity onPress={() => { this.goBack() }}>
                    <Image source={require('app-images/icon_back_white.png')} style={{ width: 9, height: 20, marginLeft: 10 }} />
                </TouchableOpacity>
                {
                    //编辑状态的可以切换模型
                    (this.state.showChangeMode) ? (
                        <TouchableOpacity onPress={() => { this.changeModel() }}>
                            <Image source={require('app-images/icon_change_model.png')} style={{ width: 25, height: 24, marginLeft: 20 }} />
                        </TouchableOpacity>
                    ) : (null)
                }
            </View>
        )
    }

    loadRightTitle = () => {
        return (
            <View style={{ flexDirection: 'row', alignItems: "center" }}>
                {
                    //显示创建
                    (this.state.showAddIcon) ? (
                        <TouchableOpacity onPress={() => { this.add() }}>
                            <Text style={{ color: '#ffffff', fontSize: 25, marginTop: 5, alignSelf: 'flex-end', paddingLeft: 20, paddingRight: 20, paddingTop: 5, paddingBottom: 5 }}>+</Text>
                        </TouchableOpacity>
                    ) : (null)
                }
            </View>
        )
    }

    componentDidMount = () => {
        // console.log(this.props.navigation.state.params);
        let params = this.props.navigation.state.params;
        let pageType = params.pageType;
        let relevantModel = params.relevantModel;

        let showChangeMode = false;
        if (pageType === PageType.PAGE_TYPE_EDIT_QUALITY || pageType === PageType.PAGE_TYPE_EDIT_EQUIPMENT) {
            showChangeMode = true;
        }

        let showAddIcon = false;
        if (pageType != PageType.PAGE_TYPE_DETAIL) {
            showAddIcon = true;
            if (pageType == PageType.PAGE_TYPE_QUALITY_MODEL) {
                //判断是否有质检单创建权限
                if (!AuthorityManager.isQualityCreate()) {
                    showAddIcon = false;
                }
            } else if (pageType == PageType.PAGE_TYPE_EQUIPMENT_MODEL) {
                //判断是否有材设单创建权限
                if (!AuthorityManager.isEquipmentModify()) {
                    showAddIcon = false;
                }
            }
        }
        this.setState({
            pageType: pageType,
            relevantModel: relevantModel,
            showChangeMode: showChangeMode,
            showAddIcon: showAddIcon,
        });

        this.props.navigation.setParams({ title: params.title, rightNavigatePress: this._rightAction })
       
        BimToken.getBimFileToken(relevantModel.gdocFileId, (token) => {
            if(!token) {
                this.setState({
                    url: '',
                    html:'',
                    error:new Error('加载失败！')
                })
                return;
            }
            let url = AppConfig.BASE_URL_BLUEPRINT_TOKEN + token + `&show=${this.state.show}`;
            let html = bimfileHtml(cmdString,token,this.state.show);
            this.setState({
                url: url,
                html:html,
                error:null
            });
        })
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.updateIndex != this.props.updateIndex) {
            this.props.navigation.replace("RelevantModlePage",  {
                pageType: this.state.pageType,
                relevantModel: this.state.relevantModel,
            });
        }
    }
    
    goBack = () => {
        storage.goBack(this.props.navigation, null);
    }

    changeModel = () => {
        let navigator = this.props.navigation;

        let pageType = PageType.PAGE_TYPE_NEW_QUALITY;

        if (this.state.pageType === PageType.PAGE_TYPE_EDIT_EQUIPMENT) {
            pageType = PageType.PAGE_TYPE_NEW_EQUIPMENT;
        }
        storage.pushNext(navigator, "BimFileChooserPage", { fileId: 0, dataType: '模型文件', pageType: pageType })
    }

    //移除图钉
    removePosition = () => {
        this.refs.webview.injectJavaScript('javascript:removeDrawableItem();')

        this.setState({
            showFinishView: false,
        });
    }

    /**
     * 新建
     */
    add = () => {
        //会出发getPosition方法
        this.refs.webview.injectJavaScript("javascript:getSelectedComponent();")
        // this.refs.webview.injectJavaScript("javascript:loadCircleItems('" + JSON.stringify(this.mEquipmentPositionMap) + "');")

    }



    /**
     * 选择构件后新建，返回新建页面
     */
    finish = (component) => {
        let relevantModel = {
            ...this.state.relevantModel,
            elementId: component.elementId,
        }
        // 0新建检查单 1检查单编辑状态 2详情查看  3质检单模型模式  4新建材设进场 5新增材设进场编辑状态  6材设模型模式
        if (this.state.pageType == PageType.PAGE_TYPE_NEW_QUALITY) {
            storage.bimFileChooseCallback(relevantModel, '模型文件');
            this.props.navigation.pop("NewPage");
        } else if (this.state.pageType == PageType.PAGE_TYPE_EDIT_QUALITY) {
            storage.bimFileChooseCallback(relevantModel, '模型文件');
            this.props.navigation.goBack();
        } else if (this.state.pageType == PageType.PAGE_TYPE_QUALITY_MODEL) {
            this.props.navigation.replace('NewPage', { relevantModel: relevantModel });
        } else if (this.state.pageType == PageType.PAGE_TYPE_NEW_EQUIPMENT) {
            // pop到新建材设单页面
            this.props.transformInfo(relevantModel);
            this.props.navigation.pop("EquipmentDetailPage");
        } else if (this.state.pageType == PageType.PAGE_TYPE_EDIT_EQUIPMENT) {
            //编辑材设单
            this.props.transformInfo(relevantModel);
            this.props.navigation.goBack();
        } else if (this.state.pageType == PageType.PAGE_TYPE_EQUIPMENT_MODEL) {
            //从材设单模型进入 replace为新建材设单页面
            this.props.transformInfo(relevantModel);
            this.props.navigation.replace('EquipmentDetailPage', {});
        } else if (this.state.pageType == PageType.PAGE_TYPE_DETAIL) {
            this.props.navigation.goBack();
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
                case 'loadDotsData':
                    {
                        this.loadDotsData();
                    }

                    break;
                case 'cancelPosition':
                    {
                        this.cancelPosition();
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
    invalidateToken = () => {
        // LogUtil.e("invalidateToken");
        // showTokenError();
        Toast.info('invalidate token ', 2)
    }
    /**
     * 模型加载完毕后的回调
     */
    loadDotsData = () => {
        //0新建检查单 1检查单编辑状态 2详情查看  3模型模式  4新建材设进场 5新增材设进场编辑状态  6材设模型模式
        switch (this.state.pageType) {
            case PageType.PAGE_TYPE_EDIT_QUALITY:
            case PageType.PAGE_TYPE_DETAIL:
            case PageType.PAGE_TYPE_EDIT_EQUIPMENT:
                this.showSelectedComponent();
                break;
            case PageType.PAGE_TYPE_QUALITY_MODEL:
                this.getElements();
                break;
            case PageType.PAGE_TYPE_EQUIPMENT_MODEL:
                this.getEquipmentList();
                break;
            default:
                break;
        }
    }
    /**
     * 编辑查看详情的时候显示选择的构件
     */
    showSelectedComponent = () => {
        if (this.state.relevantModel && this.state.relevantModel.elementId) {
            let data = `[ ${this.state.relevantModel.elementId} ]`;
            this.refs.webview.injectJavaScript("javascript:showSelectedComponent('" + data + "');")
        }
    }

    /**
     * 显示质检单模型历史选择信息
     */
    getElements = () => {
        API.getElements(storage.loadProject(), this.state.relevantModel.gdocFileId)
            .then(responseData => {
                if (responseData && responseData.data) {
                    let len = responseData.data.length;
                    this.mQualityPositionMap = [];
                    responseData.data.map((item) => {
                        this.getModelElementProperty(item, len, "quality");
                    })
                }
            }).catch(error => { })
    }

    getModelElementProperty = (item, len, type) => {
        API.getModelElementProperty(storage.loadProject(), storage.projectIdVersionId, this.state.relevantModel.gdocFileId, item.elementId)
            .then(responseData => {
                if (type === "quality") {
                    this.requestElementNameCount++;
                } else {
                    this.requestEquipmentElementNameCount++;
                }
                modelElementInfo = responseData.data;
                if (modelElementInfo && modelElementInfo.data && modelElementInfo.data.boundingBox) {
                    let min = modelElementInfo.data.boundingBox.min;
                    let max = modelElementInfo.data.boundingBox.max;
                    if (max && min) {
                        item.drawingPositionX = (max.x + min.x) / 2;
                        item.drawingPositionY = (max.y + min.y) / 2;
                        item.drawingPositionZ = max.z > min.z ? max.z : min.z;
                        if (type === "quality") {
                            this.mQualityPositionMap.push(item);
                        } else {
                            this.mEquipmentPositionMap.push(item);
                        }
                        this.setModelDot(len, type);
                    }
                }
            }).catch(error => {
                if (type === "quality") {
                    this.requestElementNameCount++;
                } else {
                    this.requestEquipmentElementNameCount++;
                }
                this.setModelDot(len, type);
            });
    }


    setModelDot = (len, type) => {
        if (type === "quality") {
            if (this.requestElementNameCount === len) {
                this.refs.webview.injectJavaScript("javascript:loadCircleItems('" + JSON.stringify(this.mQualityPositionMap) + "');")
            }
        } else {
            if (this.requestEquipmentElementNameCount === len) {
                this.refs.webview.injectJavaScript("javascript:loadCircleItems('" + JSON.stringify(this.mEquipmentPositionMap) + "');")
            };
        }
    }

    /**
     * 显示材设单模型历史选择信息
     */
    getEquipmentList = () => {
        API.getQualityFacilityAcceptanceElements(storage.loadProject(), this.state.relevantModel.gdocFileId)
            .then(responseData => {
                if (responseData && responseData.data) {
                    let len = responseData.data.length;
                    for (let i = 0; i < len; i++) {
                        let item = responseData.data[i];
                        if (item.committed) {
                            item.qcState = item.qualified ? API.QC_STATE_STANDARD : API.QC_STATE_NOT_STANDARD;
                        } else {
                            item.qcState = API.QC_STATE_EDIT;
                        }
                    }
                    this.mEquipmentPositionMap = [];
                    responseData.data.map((item) => {
                        this.getModelElementProperty(item, len, "equipment");
                    })
                }
            }).catch(error => { })
    }

    cancelPosition = () => {

    }

    /**
     * 调用 `javascript:getSelectedComponent()`后,返回构件信息
     */
    getPosition = (json) => {
        //{"action":"getPosition","data":{},"callback":"defaultReturn"}
        //{"action":"getPosition","data":"{\"elementId\":\"318370\",\"fileId\":\"\",\"objectId\":\"318370\"}","callback":"defaultReturn"}
        let component = json;//选中的构件
        if (typeof json === 'string') {
            component = JSON.parse(json)
        }
        if (!component || !component.elementId) {
            Toast.info('您还未选择构件!', 1);
            return;
        }
        this.finish(component);
    }

    //点击圆点 返回信息
    getPositionInfo = (json) => {
        switch (this.state.pageType) {
            case PageType.PAGE_TYPE_QUALITY_MODEL:
                this.handleQuality(json);
                break;
            case PageType.PAGE_TYPE_EQUIPMENT_MODEL:
                this.handleEquipment(json);
                break;
        }
    }

    handleQuality = (dot) => {
        if (dot) {
            dot = JSON.parse(dot);
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

    handleEquipment = (dot) => {
        if (dot) {
            dot = JSON.parse(dot);
            switch (dot.qcState) {
                case API.QC_STATE_STANDARD://合格
                case API.QC_STATE_NOT_STANDARD://不合格
                    if (AuthorityManager.isEquipmentBrowser()) {
                        this.showEquipmentDialog(dot);
                    }
                    break;
            }

        }
    }

    showEquipmentDialog = (dot) => {
        let items = [];
        items.push({
            title: "查看详情",
            onPress: () => {
                let item = {}
                item.value = {}
                item.value.id = dot.facilityId;
                item.value.committed = dot.committed;
                storage.pushNext(null, "EquipmentDetailPage", { "item": item });
            }
        });

        let cancelItem = { title: '取消' };
        ActionSheet.show(items, cancelItem);
    }
    //在WebView中注册该回调方法

    onNavigationStateChange(event) {
        // console.log('onNavigationStateChange:');
        // console.log(event); //打印出event中属性
    }

    //渲染
    render() {

        if(this.state.error) {
            return <NoDataView text="加载失败"/>
        }
      
        if(this.state.url == '') {
            return <LoadingView />;
        }

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
                        onLoadEnd={() => { }}
                        source={{ html: this.state.html}}
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

export default connect(
    state => ({
        updateIndex: state.updateData.updateIndex,
    }),
    dispatch => ({
        transformInfo: (relevantModel) => {
            if (dispatch) {
                dispatch(RelevantModelAction.transformInfo(relevantModel));
            }
        }
    })
)(RelevantModelPage);

