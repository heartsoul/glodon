import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Dimensions,
  Text,
  View,
  WebView,
  SafeAreaView,
  StatusBar
} from 'react-native';

import * as AppConfig from "./../../../config/AppConfig"

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
  loadDotsData : function() { callMessage('loadDotsData');},\
  invalidateToken : function() { callMessage('invalidateToken');},\
  cancelPosition : function() { callMessage('cancelPosition');},\
  getPosition : function(jsonData) { callMessage('getPosition', jsonData);},\
  getPositionInfo : function(jsonData) { callMessage('getPositionInfo', jsonData);},\
};\
document.addEventListener('message', function(e) {eval(e.data);});\
";

//默认应用的容器组件
export default class GLDWebView extends Component {
  static navigationOptions = ({navigation, screenProps}) => ({
    title: navigation.state.params?navigation.state.params.title : '图纸',
    headerTintColor: "#FFF",
    headerStyle: { backgroundColor: "#00baf3" },
    headerRight:(  
      <Text  onPress={()=>navigation.state.params.rightNavigatePress()} style={{marginLeft:5, width:30, textAlign:"center"}} >  
          测试 
      </Text>  
  )  
  });
  componentDidMount=()=> {
    console.log(this.props.navigation.state.params);
    //请求数据
     this.props.navigation.setParams({title:this.props.navigation.state.params.title, rightNavigatePress:this._rightAction }) 
  }
  
  _rightAction = ()=> {
    console.log("执行js window.modelEvent.loadDotsData();");
    this.refs.webview.injectJavaScript('javascript:window.modelEvent.loadDotsData();')
  }
  onMessage =(e)=> {
    console.log(e.nativeEvent.data);
    let action = e.nativeEvent.data;
    if(action) {
      switch (action) {
        case 'loadDotsData':
          {
            this.loadDotsData();
          }
          break;
        case 'invalidateToken':
        {
            this.invalidateToken();
        }
        break;
        case 'cancelPosition':
        {
            this.cancelPosition();
        }
        break;
        case 'getPosition':
        {
            this.getPosition();
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
  //在WebView中注册该回调方法
  
  onNavigationStateChange(event){
    console.log('onNavigationStateChange:');
    console.log(event); //打印出event中属性
    }
  //渲染
  render() {
    
    //   let url = "http://192.168.81.30/app.html?param=" + global.storage.bimToken + "&show=false";
      let url = AppConfig.BASE_URL_BLUEPRINT_TOKEN + 'global.storage.bimToken' + "&show=true";
      // let url = "https://sg.glodon.com";
    console.log("web view:" + url);
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: '#ecf0f1' }]}>
        <StatusBar barStyle="light-content" translucent={false} backgroundColor="#00baf3" />
        <View style={styles.container}>
          <WebView bounces={false}
            ref="webview"
            onNavigationStateChange={()=>this.onNavigationStateChange}
            scalesPageToFit={true}
            javaScriptEnabled={true}
            domStorageEnabled={false}
            onMessage={(e)=>this.onMessage(e)}
            injectedJavaScript={cmdString}
           //  onLoadEnd ={()=>this.refs.webview.postMessage('javascript:window.modelEvent.loadDotsData();')}
            source={{ uri: url, method: 'GET' }}
            style={{ width: deviceWidth, height: deviceHeight }}>
          </WebView>
        </View>
      </SafeAreaView>
    );
  }
  //模型加载完毕后的回调
  loadDotsData() {
    // LogUtil.e("loadDotsData");
    // pageFinished();
    console.log('loadDotsData');
  }

  //token失效的情况
  invalidateToken() {
    // LogUtil.e("invalidateToken");
    // showTokenError();
  }

  //取消选中构件
  cancelPosition() {
    // LogUtil.e("cancelPosition");
    // component = null;
  }

  //点击构件返回信息
  getPosition(json) {
    // LogUtil.e("getPosition json=" + json + " type=" + type);
    // if (TextUtils.isEmpty(json)) {
    //     component = null;
    // } else {
    //     component = new GsonBuilder().create().fromJson(json, ModelComponent.class);
    // }

    // //0新建检查单 1检查单编辑状态 2详情查看  3模型模式   4新建材设进场  5新增材设进场编辑状态  6材设模型模式
    // switch (type) {
    //     case 0:
    //         if (checkComponent()) {
    //             backData();
    //         }
    //         break;
    //     case 1:
    //         if (checkComponent()) {
    //             backData();
    //         }
    //         break;
    //     case 2:

    //         break;
    //     case 3:
    //         if (checkComponent()) {
    //             //跳转到检查单创建页
    //             Intent intent = new Intent(mActivity, CreateCheckListActivity.class);
    //             mModelSelectInfo.component = component;
    //             intent.putExtra(CommonConfig.RELEVANT_MODEL, mModelSelectInfo);
    //             startActivity(intent);
    //             finish();
    //         }
    //         break;
    //     case 4:
    //         if (checkComponent()) {
    //             backData();
    //         }
    //         break;
    //     case 5:
    //         if (checkComponent()) {
    //             backData();
    //         }
    //         break;
    //     case 6:
    //         if (checkComponent()) {
    //             //跳转到材设记录创建页
    //             Intent intent = new Intent(mActivity, CreateEquipmentMandatoryActivity.class);
    //             mModelSelectInfo.component = component;
    //             intent.putExtra(CommonConfig.RELEVANT_MODEL, mModelSelectInfo);
    //             startActivity(intent);
    //         }
    //         break;
    // }
  }

  //点击圆点 返回信息
  getPositionInfo(json) {
    // LogUtil.e("getPositionInfo json=" + json);
    // switch (type) {
    //     case 3:
    //         handleQuality(json);
    //         break;
    //     case 6:
    //         handleEquipment(json);
    //         break;
    // }
  }
}

//样式定义
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 0
  }
});

