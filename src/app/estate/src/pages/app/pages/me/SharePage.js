'use strict';
import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  SafeAreaView,
  Dimensions
} from 'react-native';
import { BarItems, LoadingView } from "app-components";
import { WebView } from "app-3rd";
var {
  height: deviceHeight,
  width: deviceWidth
} = Dimensions.get('window');

export default class extends React.Component {

  static navigationOptions = {
    headerTitle: <BarItems.TitleBarItem text='分享'/>,
    headerRight:<View/>,
  };
  constructor() {
      super();
      this.state = {
          html: `
          <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
          <html xmlns="http://www.w3.org/1999/xhtml">
          <head>
              <meta http-equiv="Content-Type" content ="text/html; charset=utf-8" />
              <meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=0, " />
              <meta http-equiv="X-UA-Compatible" content="ie=edge">
              <title> Baidu分享 </title>
          </head>
          <body>
              <form id="form1">
                  <!-- Baidu Button BEGIN -->
                     <div id="bdshare" style="float :right; width:200px;"  class="bdshare_t bds_tools get-codes-bdshare">
                          <span  style="float :left; line-height:28px ;">分享 </span>
                          <a class="bds_fbook"></a>
                          <a class="bds_twi"></a>
                          <a class="bds_tsina"></a>
                          <a class="bds_tqq"></a>
                          <a class="bds_baidu"></a>
                          <span class="bds_more">更多 </span>
                          </div>
                          <script type="text/javascript" id ="bdshare_js" data ="type=tools&amp;uid=938050" ></script>
                          <script type="text/javascript" id ="bdshell_js"></script>
                          <script type="text/javascript">
                              document.getElementById( "bdshell_js").src = "http://bdimg.share.baidu.com/static/js/shell_v2.js?cdnversion=" + Math.ceil(new Date() / 3600000)
                          </script>
                  <!-- Baidu Button END -->
              </form>
          </body>
          </html>
          `
      }
    };
  render() {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: '#ecf0f1' }]}>
      <StatusBar barStyle="light-content" translucent={false} backgroundColor="#00baf3" />
      <View style={{flex:1,alignItems:'center',justifyContent:'center',flexDirection:'column'}}>
      {/* <Text style={styles.text}> 敬请期待 </Text> */}
      <WebView bounces={false}
                        ref="webview"
                        onNavigationStateChange={() => this.onNavigationStateChange}
                        scalesPageToFit={true}
                        javaScriptEnabled={true}
                        domStorageEnabled={false}
                        onLoadEnd={() => { }}
                        source={{ html: this.state.html }}
                        style={{ width: deviceWidth, height: deviceHeight }}>
                    </WebView>
      </View>
      </SafeAreaView>
      
    );
  }
};

var styles = StyleSheet.create({
    container:{
      flex:1,
    },
    text:{
      fontSize:18,
      color:'gray'
    },
});