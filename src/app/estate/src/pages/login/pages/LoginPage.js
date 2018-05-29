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
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Animated,
  ScrollView,
  Alert,
} from "react-native";

import { connect } from 'react-redux' // 引入connect函数
import { Toast } from 'antd-mobile' // 引入connect函数
import * as loginAction from '../actions/loginAction' // 导入action方法 
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
// import {ScrollView as KeyboardAwareScrollView } from 'react-native';

import { ActionButton,TextInputNormal,TextInputPassword } from 'app-components';
import { BarItems, LoadingView } from "app-components";

var { width, height } = Dimensions.get("window");

class LoginPage extends React.Component {

static navigationOptions = {
    headerTitle: <BarItems.TitleBarItem text='用户登录'/>,
    headerRight:<View/>,
  };

  constructor(props) {
    super(props);
    if(!storage.homeNavigation) {
      storage.homeNavigation = this.props.navigation;
    }
    this.passwordTextInput = null;
    this.userNameTextInput = null;
    /*用来指示是否显示Loading提示符号*/
    let un = props.userName;
    if(!un) {
      un = '';
    }
    this.state = {
      disabled: false,
      pressed: false,
      username: un,
      password: "", //props.password,
      events: "",
      msg: "",
      linePwdAnim: new Animated.Value(0.0),
      lineAnim: new Animated.Value(un.length > 0 ? 0.5 : 0.0)
    };
  }
 componentDidMount = () => {
 }
  shouldComponentUpdate(nextProps, nextState) {
    if (nextProps.status === '重试' && nextProps.retryTimes > 0) {
      this.props.login(this.state.username,this.state.password);
      return false;
    }
    // 登录完成,切成功登录
    if (nextProps.status === '登录成功' && nextProps.isSuccess && storage.isLogin()) {
      let navigator = this.props.navigation;
      Toast.hide();
      storage.gotoMain(navigator);  
      return false
    }
    Toast.hide();
    return true
  }

  _checkInput() {
    return (this.state.username.length > 1 && this.state.password.length > 5);
  }
  _onUserNameChangeText = text => {
    if(text.indexOf('\n')>=0) {
      this.passwordTextInput.focus();
      // this.passwordTextInput.setSelectionRange(0, this.passwordTextInput.value.length);
      return;
    }
    let check = text.length > 1 && this.state.password.length > 5;
    this.setState({ username: text, disabled:!check});
  };
  _onUserNameBlur = () => {
    // this.startAnimation();
    this.setState({ disabled:!this._checkInput()});
      Animated.timing(
        this.state.lineAnim,
        {toValue: this.state.username.length <= 0 ? 0.0 : 0.5}
      ).start();
  };
  _onPasswordBlur = () => {
    this.setState({ disabled:!this._checkInput()});
    Animated.timing(
      this.state.linePwdAnim,
      {toValue: this.state.password.length <= 0 ? 0.0 : 0.5}
    ).start();
  };
  _onUserNameFocus = () => {

    this.setState({disabled:!this._checkInput()
    });
    Animated.timing(
      this.state.lineAnim,
      {toValue: 1.0}
    ).start();
  };
  _onPasswordFocus = () => {
    this.setState({disabled:!this._checkInput()});
    Animated.timing(
      this.state.linePwdAnim,
      {toValue: 1.0}
    ).start();
   
  };
  
  _onPasswordChangeText = text => {
    if(text && text.indexOf('\n')>=0) {
     if(this._checkInput()) {
       this.doLogin();
     }
      return;
    }
    if(!text) {
      text = '';
    } 
    // console.log("_onPasswordChangeText" + text);
    let check = text.length > 5 && this.state.username.length > 1;
    this.setState({ password: text, disabled:!check});
  };
  _fogotAction = () => {
    let navigator = this.props.navigation;
    storage.pushNext(navigator, "ForgotPage",{title:'找回密码'})
  };
  doLogin=()=>{
    Toast.loading('正在登录...', 0, null, true);
    const { login } = this.props
    login(this.state.username,this.state.password)
  }
  startAnimation(){
    this.state.currentAlpha = this.state.currentAlpha == 1.0?0.0:1.0;
    Animated.timing(
      this.state.fadeAnim,
      {toValue: this.state.currentAlpha}
    ).start();
    Animated.timing(
      this.state.lineAnim,
      {toValue: this.state.currentAlpha}
    ).start();
    
  }
  componentWillReceiveProps(nextProps){
    if(nextProps.isSuccess == false && nextProps.status === '登录失败' && this.props.status != nextProps.status) {
      Alert.alert("提示",'账号或密码错误',[{text: '确定', onPress: () => {}, style: 'cancel'}]);
    }
    return true;
  }
  render() {
    return (
      <KeyboardAwareScrollView style={{backgroundColor: "#ffffff",flex: 1,
      marginLeft: 0,
      marginRight: 0}}>
     
        <StatusBar
          barStyle="light-content"
          backgroundColor="#00baf3"
          translucent={true}
        />
        <Image
          source={require("app-images/login/icon_login_top_bg.png")}
          style={[styles.style_login_image]}
        />
        <View style={{marginLeft:20,marginRight:20}}>
        <Animated.Text
            style={[
              styles.style_input_title,
              { marginTop: 28, },
              {
                color: "rgb(153,153,146)",
                fontSize: this.state.lineAnim.interpolate({
                  inputRange: [0, 0.5, 1],
                  outputRange: [14, 12, 12] //线性插值，0对应60，0.6对应30，1对应0
                }),
                transform: [//transform动画
                  {
                    translateY: this.state.lineAnim.interpolate({
                      inputRange: [0, 0.5, 1],
                      outputRange: [38, 0, 0] //线性插值，0对应60，0.6对应30，1对应0
                    }),
                  },
                ],
              }
            ]}
          >
            账户名
        </Animated.Text>
        <TextInputNormal
          placeholder={''}
          onBlur={() => this._onUserNameBlur()}
          onFocus={() => this._onUserNameFocus()}
          onChangeText={text => this._onUserNameChangeText(text)}
          defaultValue={this.state.username}
          ref={(ref)=>{this.userNameTextInput=ref}}
        />
        <View style={styles.style_input_line_gray}>
        <Animated.View
          style={[ styles.style_input_line,
              {
                width:this.state.lineAnim.interpolate({
                    inputRange: [0,0.5,1],
                    outputRange: ['0%', '0%', '100%'] //线性插值，0对应60，0.6对应30，1对应0
                  })
              }
          ]
          }
        />
        </View>
        <Animated.Text
          style={[
            styles.style_input_title,
              { marginTop: 20 },
              {
                color: "rgb(153,153,146)",
                fontSize: this.state.linePwdAnim.interpolate({
                  inputRange: [0, 0.5, 1],
                  outputRange: [14, 12, 12] //线性插值，0对应60，0.6对应30，1对应0
                }),
                transform: [//transform动画
                  {
                    translateY: this.state.linePwdAnim.interpolate({
                      inputRange: [0, 0.5, 1],
                      outputRange: [38, 0, 0] //线性插值，0对应60，0.6对应30，1对应0
                    }),
                  },
                ],
              }
          ]}
        >
          密码
        </Animated.Text>
        <TextInputPassword
          placeholder={''}
          onChangeText={text => this._onPasswordChangeText(text)}
          value={this.state.password}
          onBlur={() => this._onPasswordBlur()}
          onFocus={() => this._onPasswordFocus()}
          ref={(ref)=>{this.passwordTextInput=ref}}
        />
        <View style={styles.style_input_line_gray}>
        <Animated.View
          style={[ styles.style_input_line,
              {
                width:this.state.linePwdAnim.interpolate({
                    inputRange: [0,0.5,1],
                    outputRange: ['0%', '0%', '100%'] //线性插值，0对应60，0.6对应30，1对应0
                  })
              }
          ]
          }
        />
        </View>
        <View>
          <ActionButton
            onPress={()=>{this.doLogin()}}
            isDisabled={()=>{return this.state.disabled}}
            text="登 录"
          >
          </ActionButton> 
        </View>
        <View style={styles.style_fogotTextView}>
        <TouchableOpacity onPressOut={this._fogotAction}>
        <Text style={[styles.style_fogotText]}>忘记密码</Text>
        </TouchableOpacity>
        </View>
        </View>
      </KeyboardAwareScrollView>
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
    height: 16,
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
 
  style_input_line: {
    height: 2,
    backgroundColor: "#00baf3",
    borderRadius:1
    // marginLeft: 20,
    // marginRight: 20
  },
  style_input_line_gray: {
    height: 2,
    backgroundColor: "rgb(243,242,242)",
    marginLeft: 20,
    marginRight: 20,
    borderRadius:1
    
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
    height: 20,
    marginTop: 10,
    marginLeft: 20,
    marginRight: 20,
    alignItems: "center",
    textAlign: "center",
    fontSize: 14,
    color: "rgb(153,153,146)",
    alignSelf:'center'
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
    alignItems: "center",
    flex: 1,
    flexDirection: "row",
    justifyContent:"center",
    alignContent:"center",
    height: 40,
    marginTop: 10,
  },
});

export default connect(
  state => ({
    status: state.loginIn.status,
    isSuccess: state.loginIn.isSuccess,
    userName: storage.getLoginUserName(),
    retryTimes:state.loginIn.retryTimes,
  }),
  dispatch => ({
    login: (userName,password) =>{
      if(dispatch) {
        dispatch(loginAction.login(userName,password))
      }
    },
  })
)(LoginPage)