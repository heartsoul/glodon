import React, {Component} from 'react';
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
 
//获取设备的宽度和高度
var {
    height: deviceHeight,
    width: deviceWidth
} = Dimensions.get('window');
 
//默认应用的容器组件
export default class GLDWebView extends Component {
  static navigationOptions = {
    title: '浏览器',
    headerTintColor:"#FFF",
    headerStyle:{backgroundColor:"#00baf3"}
  };
    //渲染
    render() {
        return (
          <SafeAreaView style={[styles.container, { backgroundColor: '#ecf0f1' }]}>
          <StatusBar barStyle="light-content" translucent={false} backgroundColor="#00baf3" />
            <View style={styles.container}>
              <WebView bounces={false}
                scalesPageToFit={true}
                source={{uri:"https://www.baidu.com",method: 'GET'}}
                style={{width:deviceWidth, height:deviceHeight}}>
              </WebView>
            </View>
            </SafeAreaView>
        );
    }
}
 
//样式定义
const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop:0
    }
});