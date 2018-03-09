"use strict";
import React, { Component } from "react";
import request from "../../utils/request";
import * as USERAPI from "./api+user";
import {
  AppRegistry,
  StyleSheet,
  Button,
  Text,
  Image,
  View,
  TextInput,
  TouchableHighlight,
  Alert,
  NativeModules,
  // NativeEventEmitter,
  SafeAreaView,
  StatusBar
} from "react-native";
import { NavigationActions, StackRouter} from 'react-navigation';
var Dimensions = require("Dimensions");
var { width, height } = Dimensions.get("window");

var RNBridgeModule = NativeModules.GLDRNBridgeModule; //你的类名
// const NativeModule = new NativeEventEmitter(RNBridgeModule);


function login(username, pwd, successReturn) {
  USERAPI.login(username, pwd).then((response) => {
    console.log(response);
    loadUserInfo(successReturn);
  });
  
}
function loadUserInfo(successReturn) {
  USERAPI.accountInfo().then((userInfo)=>{
    console.log(userInfo);
    let data = userInfo["data"];
    console.log(global.storage);
    console.log(global.storage.userInfo);
    global.storage.userInfo = data;
    if(data) {
      let ac = data["accountInfo"];
      if (ac) {
        let username = ac["name"];
        console.log(username);
        let userTenants = ac["userTenants"];
        if (userTenants) {
          console.log(userTenants.length);
          userTenants.forEach(tenant => {
            console.log(tenant["tenantName"]);
          });
        }
        successReturn();
      } else {
        Alert("登录失败！");
      }
      
    }
    
  });
}
//import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

class GLDLoginViewController extends React.Component {
 // static router = StackRouter({routeName:'loginVC'}, {});
  static navigationOptions = {
    title: '用户登录',
    tabBarVisible:false,
    headerTintColor:"#FFF",
    headerStyle:{backgroundColor:"#00baf3"},
}
  constructor(props) {
    super(props);
    /*用来指示是否显示Loading提示符号*/
    this.state = {
      disabled: false,
      pressed: false,
      username: "15822320523", // props.userName,
      password: "123qwe", //props.password,
      focusUserName: 1, // 焦点 0: 没有 1:
      focusPassword: 0, // 焦点 0: 没有 1:
      events: "",
      msg: ""
    };
    // this._loginAction= this._loginAction.bind(this);
  }

  componentDidMount = () => {
    console.log("componentDidMount");
    //  NativeModule.addListener('test',(data)=>this._getNotice(data));
  };

  _getNotice = body => {
    //body 看你传什么
    console.log("_getNotice:");
    console.log("_getNotice:" + body);
    this.forceUpdate(); //重新渲染
  };

  componentWillUnmount = () => {
    console.log("componentWillUnmount");
    //删除监听
    //  this.NativeModule.remove()
  };

  _confirm = () => {
    console.log("_confirm");
  };
  _onUserNameChangeText = text => {
    console.log("_onUserNameChangeText" + text);
    this.setState({ username: text });
  };
  _onUserNameBlur = () => {
    this.setState({ focusUserName: 0 });
  };
  _onPasswordBlur = () => {
    this.setState({ focusPassword: 0 });
  };
  _onUserNameFocus = () => {
    this.setState({
      focusUserName: 1
    });
  };
  _onPasswordFocus = () => {
    this.setState({
      focusPassword: 1
    });
  };
  _onPasswordChangeText = text => {
    console.log("_onPasswordChangeText" + text);
    this.setState({ password: text });
  };
  _fogotAction = () => {
    alert("logout");
    USERAPI.loginOut(); // 先退出一下再说
    RNBridgeModule.RNInvokeOCCallBack(
      {
        caller: "gldrn",
        name: "clearCookie",
        ver: "1.0",
        data: { title: "登录", message: "是否确认登录？" }
      },
      (data, request) => {
        console.log(request);
        alert(data);
        // if (data) {
        //   console.log(data);
        // } else {
        //   this.setState({
        //     events: data
        //   });
        // }
      }
    );
  };
  _loadUserInfo = () => {
    loadUserInfo(()=>{});
  }
  _loginAction = () => {
    RNBridgeModule.RNInvokeOCCallBack(
      {
        caller: "gldrn",
        name: "clearCookie",
        ver: "1.0",
        data: { title: "登录", message: "是否确认登录？" }
      },
      (data, request) => {
        console.log(request);
        // if (data) {
        //   console.log(data);
        // } else {
        //   this.setState({
        //     events: data
        //   });
        // }
        let navigator = this.props.navigation;
        var ret = login(this.state.username, this.state.password, () => {
          if(global.storage.hasChoose()) {
            USERAPI.setCurrentTenant(this.loadTenant()).then((responseData) => {
              global.storage.gotoMain(navigator); 
            });
          } else {
            global.storage.gotoMain(navigator); 
          }
        });
      }
    );
  };
  render() {
    return (
      <View
        style={{
          backgroundColor: "#ffffff",
          flex: 1,
          marginLeft: 0,
          marginRight: 0
        }}
      >
        <StatusBar barStyle="light-content" backgroundColor="#ecf0f1" />
        <Image
          source={require("../res/images/login/icon_login_top_bg.png")}
          style={[styles.style_login_image]}
        />
        <Text
          style={[
            styles.style_input_title,
            this.state.focusUserName == 1 || this.state.username.length > 0
              ? { color: "rgb(153,153,146)" }
              : { color: "transparent" },
            ,
            { marginTop: 68 }
          ]}
        >
          账户名
        </Text>
        <TextInput
          style={styles.style_user_input}
          placeholder={this.state.focusUserName == 1 ? "" : "请输入账户名称"}
          numberOfLines={1}
          autoFocus={true}
          underlineColorAndroid={"transparent"}
          textAlign="left"
          onBlur={() => this._onUserNameBlur()}
          onFocus={() => this._onUserNameFocus()}
          onChangeText={text => this._onUserNameChangeText(text)}
          value={this.state.username}
        />
        <View
          style={
            this.state.focusUserName == 1
              ? styles.style_input_line
              : styles.style_input_line_gray
          }
        />
        <Text
          style={[
            styles.style_input_title,
            this.state.focusPassword == 1 || this.state.password.length > 0
              ? { color: "rgb(153,153,146)" }
              : { color: "transparent" }
          ]}
        >
          密码
        </Text>
        <TextInput
          style={styles.style_pwd_input}
          placeholder={this.state.focusPassword == 1 ? "" : "请输入用户密码"}
          numberOfLines={1}
          underlineColorAndroid={"transparent"}
          secureTextEntry={true}
          textAlign="left"
          onChangeText={text => this._onPasswordChangeText(text)}
          value={this.state.password}
          onBlur={() => this._onPasswordBlur()}
          onFocus={() => this._onPasswordFocus()}
        />
        <View
          style={
            this.state.focusPassword == 1
              ? styles.style_input_line
              : styles.style_input_line_gray
          }
        />
        <View>
          <TouchableHighlight
            onPress={this._loginAction}
            underlayColor="#0099f3"
            activeOpacity={1.0}
            style={
              this.state.disabled
                ? styles.style_loginTextViewDisabled
                : this.state.pressed
                  ? styles.style_loginTextViewPressed
                  : styles.style_loginTextView
            }
            onHideUnderlay={() => {
              this.setState({ pressed: false });
            }}
            onShowUnderlay={() => {
              this.setState({ pressed: true });
            }}
          >
            <Text style={styles.style_loginText}>登 录 </Text>
          </TouchableHighlight>

          <TouchableHighlight
            onPress={this._fogotAction}
            underlayColor="#0099f3"
            activeOpacity={0.75}
            style={styles.style_fogotTextView}
          >
            <Text style={styles.style_fogotText}>忘记密码 </Text>
          </TouchableHighlight>
{/*           
          <TouchableHighlight
            onPress={this._loadUserInfo}
            underlayColor="#0099f3"
            activeOpacity={0.75}
            style={styles.style_fogotTextView}
          >
            <Text style={styles.style_fogotText}>用户信息 </Text>
          </TouchableHighlight> */}
          
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  style_login_title: {
    fontSize: 36,
    height: 50,
    width: 76,
    marginTop: 80,
    marginLeft: 0
  },
  style_login_image: {
    height: width * 759 / 1125,
    width: width,
    marginTop: 0,
    marginLeft: 0,
    resizeMode: "contain"
  },
  style_input_title: {
    fontSize: 12,
    height: 14,
    width: 76,
    marginTop: 5,
    marginLeft: 20
  },
  style_image: {
    borderRadius: 35,
    height: 70,
    width: 70,
    marginTop: 440,
    alignSelf: "center"
  },
  style_user_input: {
    backgroundColor: "#fff",
    marginTop: 12,
    height: 40,
    marginLeft: 20,
    marginRight: 60
  },
  style_pwd_input: {
    backgroundColor: "#fff",
    height: 40,
    marginTop: 12,
    marginLeft: 20,
    marginRight: 60
  },
  style_input_line: {
    height: 2,
    backgroundColor: "#00baf3",
    marginLeft: 20,
    marginRight: 20
  },
  style_input_line_gray: {
    height: 2,
    backgroundColor: "rgb(243,242,242)",
    marginLeft: 20,
    marginRight: 20
  },
  style_input_submit: {
    marginTop: 15,
    marginLeft: 20,
    marginRight: 20,
    backgroundColor: "#333",
    height: 60,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    color: "#fff"
  },
  style_view_unlogin: {
    fontSize: 12,
    color: "#63B8FF",
    marginLeft: 10
  },
  style_view_register: {
    fontSize: 12,
    color: "#63B8FF",
    marginRight: 10,
    alignItems: "flex-end",
    flex: 1,
    flexDirection: "row",
    textAlign: "right"
  },

  style_fogotText: {
    overflow: "hidden",
    height: 20,
    marginTop: 10,
    marginLeft: 20,
    marginRight: 20,
    alignItems: "center",
    textAlign: "center",
    fontSize: 14,
    color: "#000"
  },

  style_loginText: {
    overflow: "hidden",
    height: 20,
    marginTop: 10,
    marginLeft: 20,
    marginRight: 20,
    borderRadius: 20,
    alignItems: "center",
    textAlign: "center",
    fontSize: 16,
    color: "#fff"
  },
  style_fogotTextView: {
    overflow: "hidden",
    height: 40,
    // backgroundColor: '#0FF',
    marginTop: 10,
    width: 100,
    marginLeft: width / 2 - 50
  },
  style_loginTextView: {
    overflow: "hidden",
    height: 40,
    backgroundColor: "#00baf3",
    borderRadius: 20,
    marginTop: 40,
    marginLeft: 20,
    marginRight: 20
  },
  style_loginTextViewPressed: {
    overflow: "hidden",
    height: 40,
    backgroundColor: "#33baf3",
    borderRadius: 20,
    marginTop: 40,
    marginLeft: 20,
    marginRight: 20
  },
  style_loginTextViewDisabled: {
    overflow: "hidden",
    height: 40,
    backgroundColor: "#C8C8C8",
    borderRadius: 20,
    marginTop: 40,
    marginLeft: 20,
    marginRight: 20
  }
});
export default GLDLoginViewController;
