"use strict";
import React, { Component } from "react";

import {
  AppRegistry,
  StyleSheet,
  Button,
  Text,
  Image,
  View,
  Dimensions,
  TextInput,
  TouchableHighlight,
  SafeAreaView,
  StatusBar
} from "react-native";

import { connect } from 'react-redux' // 引入connect函数
import * as loginAction from '../actions/loginAction' // 导入action方法 

import { ActionButton } from 'app-components';

var { width, height } = Dimensions.get("window");

class LoginPage extends React.Component {
  static navigationOptions = {
    title: '用户登录',
    tabBarVisible:false,
    headerTintColor:"#FFF",
    headerStyle:{backgroundColor:"#00baf3"},
    header:null,
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
  }

  shouldComponentUpdate(nextProps, nextState) {
    
    // 登录完成,切成功登录
    if (nextProps.status === '登陆成功' && nextProps.isSuccess) {
      console.log("\n>>>>>>nextProps.status:"+nextProps.status)
      let navigator = this.props.navigation;
      if(nextProps.hasChoose) {
        this.props.history.replace('MainPage');
        // global.storage.gotoMain(this.props.history);
      } else {
        // global.storage.gotoMain(this.props.history);
        this.props.history.replace('MainPage');
      }   
      return false
    }
    return true
  }

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
   
  };
  
  render() {
    const { login } = this.props
    return (
      <SafeAreaView style={{
        backgroundColor: "#ffffff",
          height:'100%',
      }}> 
      <View
        style={{
          backgroundColor: "#ffffff",
          flex: 1,
          height:'100%',
          marginLeft: 0,
          marginRight: 0
        }}
      >
        <StatusBar
          barStyle="light-content"
          backgroundColor="#00baf3"
          translucent={true}
        />
        <Image
          source={require("app-images/login/icon_login_top_bg.png")}
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
          <ActionButton
            onPress={()=>login(this.state.username,this.state.password)}
            isDisabled={()=>{return this.state.disabled}}
            text="登 录"
          >
          </ActionButton> 
          <Text style={styles.style_loginText}>{this.props.status}</Text>
        </View>
      </View>
      </SafeAreaView>
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
});

export default connect(
  state => ({
    status: state.loginIn.status,
    isSuccess: state.loginIn.isSuccess,
    user: state.loginIn.user,
    hasChoose: state.loginIn.hasChoose,
  }),
  dispatch => ({
    login: (userName,password) =>{
      console.log("dispatch(loginAction.login(userName,password)):"+dispatch)
      if(dispatch) {
        dispatch(loginAction.login(userName,password))
      }
    },
  })
)(LoginPage)