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

import * as AppConfig from "common-module"
import * as PageType from "./PageTypes";
import * as BimToken from "./BimFileTokenUtil";
import * as AuthorityManager from "./../project/AuthorityManager";

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
//   console.log('执行命令：'+cmd);\
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
export default class RelevantModelPage extends Component {

    static navigationOptions = ({ navigation, screenProps }) => ({
        title: '',
        header: null,
    });

    constructor(props) {
        super(props);
        this.state = {
            showFinishView: false,//显示完成
            pageType: PageType.PAGE_TYPE_NEW_QUALITY,// 0新建检查单 1检查单编辑状态 2详情查看  3质检单模型模式  4新建材设进场 5新增材设进场编辑状态  6材设模型模式
            showChangeMode: false,//显示切换模型 pageType为1、5时为true
            showAddIcon: false,//显示创建按钮 pageType为 2 或者 3、6无创建权限时为false
            relevantModel: {},//选中的模型
            url: '',
        };
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
            let url = AppConfig.BASE_URL_BLUEPRINT_TOKEN + token + `&show=false`;
            this.setState({
                url: url
            });
        })
    }


    goBack = () => {
        storage.goBack(this.props.navigation, null);
    }

    changeModel = () => {
        let navigator = this.props.navigation;

        let pageType = PageType.PAGE_TYPE_NEW_QUALITY;

        if (this.state.pageType === PageType.PAGE_TYPE_EDIT_EQUIPMENT) {
            let pageType = PageType.PAGE_TYPE_NEW_EQUIPMENT;
        }
        storage.pushNext(navigator, "BimFileChooserPage", { fileId: 0, dataType: '模型文件', pageType: pageType })
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
        });
    }

    /**
     * 新建
     */
    add = () => {
        //会出发getPosition方法
        this.refs.webview.injectJavaScript("javascript:getSelectedComponent();")
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

        } else if (this.state.pageType == PageType.PAGE_TYPE_EDIT_EQUIPMENT) {
            //编辑材设单
            this.props.navigation.goBack();
        } else if (this.state.pageType == PageType.PAGE_TYPE_EQUIPMENT_MODEL) {
            //从材设单模型进入 replace为新建材设单页面
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

    }
    /**
     * 显示材设单模型历史选择信息
     */
    getEquipmentList = () => {

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

    }
    //在WebView中注册该回调方法

    onNavigationStateChange(event) {
        // console.log('onNavigationStateChange:');
        // console.log(event); //打印出event中属性
    }



    renderHeaderView = () => {
        let title = '点击选择';
        return (
            <View style={{ height: 43, flexDirection: 'row', backgroundColor: 'rgba(0, 0, 0, 0.5)', alignItems: 'center' }}>
                <View style={{ flex: 1, flexDirection: 'row' }}>
                    <TouchableOpacity onPress={() => { this.goBack() }}>
                        <Image source={require('app-images/icon_back_white.png')} style={{ width: 9, height: 20, marginLeft: 20 }} />
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
                <View style={{ flex: 1 }}>
                    <Text style={{ color: '#ffffff', fontSize: 17, marginTop: 5, alignSelf: 'center' }}>{title}</Text>
                </View>
                <View style={{ flex: 1 }}>
                    {
                        //显示创建
                        (this.state.showAddIcon) ? (
                            <TouchableOpacity onPress={() => { this.add() }}>
                                <Text style={{ color: '#ffffff', fontSize: 25, marginTop: 5, alignSelf: 'flex-end', paddingLeft: 20, paddingRight: 20, paddingTop: 5, paddingBottom: 5 }}>+</Text>
                            </TouchableOpacity>
                        ) : (null)
                    }
                </View>
            </View>
        );
    }


    //渲染
    render() {
        return (
            <SafeAreaView style={[styles.container, { backgroundColor: '#ecf0f1' }]}>
                <StatusBar barStyle="light-content" translucent={false} backgroundColor="rgba(0, 0, 0, 0.5)" />
                {
                    this.renderHeaderView()
                }

                <View style={styles.container}>

                    <WebView bounces={false}
                        ref="webview"
                        onNavigationStateChange={() => this.onNavigationStateChange}
                        scalesPageToFit={true}
                        javaScriptEnabled={true}
                        domStorageEnabled={false}
                        onMessage={(e) => this.onMessage(e)}
                        injectedJavaScript={cmdString}
                        onLoadEnd={() => this.setPosition()}
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

