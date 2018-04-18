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

import * as AppConfig from "common-module";
import * as PageType from "./PageTypes";
import * as BimToken from "./BimFileTokenUtil";

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
  console.log('执行命令：'+cmd);\
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
        title: '',
        tabBarVisible: false,
        headerTintColor: "#FFF",
        headerStyle: { backgroundColor: "#00baf3" },
        header: null,
    });

    constructor(props) {
        super(props);
        this.state = {
            drawingPositionX: '',
            drawingPositionY: '',
            showFinishView: false,//显示完成
            fileId: '',
            name: '',
            pageType: PageType.PAGE_TYPE_NEW_QUALITY,// 0新建检查单 1检查单编辑状态 2详情查看  3图纸模式
            show: false,// true  不响应长按事件  false响应长按事件 (0、1、3响应 ，2 不响应)
            showCreateNoticeView: true,//新建提示弹窗
            url: '',
        };
    }

    componentDidMount = () => {
        console.log(this.props.navigation.state.params);
        let params = this.props.navigation.state.params;
        let pageType = params.pageType;
        let relevantBluePrint = params.relevantBluePrint;

        if (relevantBluePrint) {
            this.setState({
                drawingPositionX: relevantBluePrint.drawingPositionX,
                drawingPositionY: relevantBluePrint.drawingPositionY,
                showFinishView: true,
            });
        }

        let show = (pageType == PageType.PAGE_TYPE_DETAIL);
        let showCreateNoticeView = true;
        if (pageType == PageType.PAGE_TYPE_DETAIL) {
            showCreateNoticeView = false;
        } else if (pageType == PageType.PAGE_TYPE_QUALITY_MODEL) {
            //判断是否有创建权限
        }

        this.setState({
            fileId: params.fileId,
            name: params.title,
            pageType: pageType,
            show: show,
            showCreateNoticeView: showCreateNoticeView,
        });

        //长按提示View
        const timer = setTimeout(() => {
            clearTimeout(timer);
            this.setState({
                showCreateNoticeView: false,
            })
        }, 4000);

        //请求数据
        this.props.navigation.setParams({ title: params.title, rightNavigatePress: this._rightAction })

        BimToken.getBimFileToken(params.fileId, (token) => {
            let url = AppConfig.BASE_URL_BLUEPRINT_TOKEN + token + `&show=${this.state.show}`;
            this.setState({
                url: url
            });
        })

    }

    //详情页查看图纸的header
    headerDetailView = () => {
        let params = this.props.navigation.state.params;
        let title = params ? params.title : '图纸';
        return (
            <View style={{ height: 43, flexDirection: 'row', backgroundColor: 'rgba(0, 0, 0, 0.5)', alignItems: 'center' }}>
                <View style={{ flex: 1 }}>
                    <TouchableOpacity onPress={() => { this.goBack() }}>
                        <Image source={require('app-images/icon_back_white.png')} style={{ width: 9, height: 20, marginLeft: 20 }} />
                    </TouchableOpacity>
                </View>
                <View style={{ flex: 1 }}>
                    <Text style={{ color: '#ffffff', fontSize: 17, marginTop: 5, alignSelf: 'center' }}>{title}</Text>
                </View>
                <View style={{ flex: 1 }}>
                </View>
            </View>
        );
    }

    headerCreateView = () => {
        let params = this.props.navigation.state.params;
        let title = params ? params.title : '图纸';
        return (
            <View style={{ height: 43, flexDirection: 'row', backgroundColor: 'rgba(0, 0, 0, 0.5)', alignItems: 'center' }}>
                <View style={{ flex: 1, flexDirection: 'row' }}>
                    <TouchableOpacity onPress={() => { this.goBack() }}>
                        <Image source={require('app-images/icon_back_white.png')} style={{ width: 9, height: 20, marginLeft: 20 }} />
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
                <View style={{ flex: 1 }}>
                    <Text style={{ color: '#ffffff', fontSize: 17, marginTop: 5, alignSelf: 'center' }}>{title}</Text>
                </View>
                <View style={{ flex: 1 }}>
                    <Text style={{ color: '#ffffff', fontSize: 15, alignSelf: 'flex-end', marginRight: 20, marginTop: 5, }}>长按新建</Text>
                </View>
            </View>
        );
    }

    headerFinishView = () => {
        let params = this.props.navigation.state.params;
        let title = params ? params.title : '图纸';
        return (
            <View style={{ height: 43, flexDirection: 'row', backgroundColor: 'rgba(0, 0, 0, 0.5)', alignItems: 'center' }}>
                <View style={{ flex: 1 }}>
                    <TouchableOpacity onPress={() => { this.removePosition() }}>
                        <Text style={{ color: '#ffffff', fontSize: 15, marginTop: 5, marginLeft: 20 }}>取消</Text>
                    </TouchableOpacity>
                </View>
                <View style={{ flex: 1 }}>
                    <Text style={{ color: '#ffffff', fontSize: 17, marginTop: 5, alignSelf: 'center' }}>{title}</Text>
                </View>
                <View style={{ flex: 1 }}>
                    <TouchableOpacity onPress={() => { this.finish() }}>
                        <Text style={{ color: '#ffffff', fontSize: 15, marginTop: 5, alignSelf: 'flex-end', marginRight: 20 }}>完成</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
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

        storage.qualityState.navKey = this.props.navigation.state.key;

        storage.pushNext(navigator, "BimFileChooserPage", { fileId: 0, dataType: '图纸文件', pageType: PageType.PAGE_TYPE_NEW_QUALITY, saveKey: 0 })
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

    //完成
    finish = () => {

        let relevantBlueprint = {
            fileId: this.state.fileId,
            name: this.state.name,
            drawingPositionX: this.state.drawingPositionX,
            drawingPositionY: this.state.drawingPositionY,
        }
        // this.props.chooseBlueprint(relevantBlueprint);
        console.log(this.state.pageType)
        // 0新建检查单 1检查单编辑状态 2详情查看  3图纸模式
        if (this.state.pageType == PageType.PAGE_TYPE_NEW_QUALITY) {
            storage.qualityState.bimChooserCallback(relevantBlueprint, '图纸文件');
            this.props.navigation.goBack(storage.qualityState.navKey);
        } else if (this.state.pageType == PageType.PAGE_TYPE_EDIT_QUALITY) {
            storage.qualityState.bimChooserCallback(relevantBlueprint, '图纸文件');
            this.props.navigation.goBack();
        } else if (this.state.pageType == PageType.PAGE_TYPE_DETAIL) {
            this.props.navigation.goBack();
        } else if (this.state.pageType == PageType.PAGE_TYPE_QUALITY_MODEL) {
            this.props.navigation.replace('NewPage', { relevantBlueprint: relevantBlueprint });
        }
    }

    onMessage = (e) => {
        console.log(e.nativeEvent.data);
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
                        this.getPositionInfo();
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
        })
    }
    //点击圆点 返回信息
    getPositionInfo(json) {

    }
    //在WebView中注册该回调方法

    onNavigationStateChange(event) {
        console.log('onNavigationStateChange:');
        console.log(event); //打印出event中属性
    }
    //渲染
    render() {

        // let url = AppConfig.BASE_URL_BLUEPRINT_TOKEN + storage.bimToken + `&show=${this.state.show}`;

        return (
            <SafeAreaView style={[styles.container, { backgroundColor: '#ecf0f1' }]}>
                <StatusBar barStyle="light-content" translucent={false} backgroundColor="rgba(0, 0, 0, 0.5)" />
                {
                    (this.state.pageType === PageType.PAGE_TYPE_DETAIL) ? (
                        this.headerDetailView()
                    ) : (
                            this.state.showFinishView ? (
                                this.headerFinishView()
                            ) : (
                                    this.headerCreateView()
                                )
                        )
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
