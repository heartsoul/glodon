'use strict';
import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  SafeAreaView,
  Dimensions,
  Image,
} from 'react-native';
import { connect } from 'react-redux' // 引入connect函数
import { Toast } from 'antd-mobile' // 引入connect函数
import * as fogotAction from '../actions/forgotAction' // 导入action方法 
import * as types from '../constants/forgotTypes'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { ActionButton, TextInputNormal, TextInputPassword, TextInputImage, LeftBarButtons } from 'app-components';
import * as API from 'app-api'

var { width, height } = Dimensions.get("window");
class ForgotPage extends React.Component {
  static navigationOptions = ({ navigation, screenProps }) => ({
    gesturesEnabled: navigation.state.params && navigation.state.params.gesturesEnabled ? navigation.state.params.gesturesEnabled() : false,
    headerLeft: navigation.state.params && navigation.state.params.loadLeftTitle ? navigation.state.params.loadLeftTitle() : null,
    title: navigation.state.params && navigation.state.params.loadTitle ? navigation.state.params.loadTitle() : "密码管理"
  })

  constructor(props) {
    super(props);
    this.props.navigation.setParams({ loadLeftTitle: this.loadLeftTitle, loadTitle: this.loadTitle, gesturesEnabled: this.gesturesEnabled })
    this.passwordTextInput = null;
    this.password2TextInput = null;
    this.userNameTextInput = null;
    this.imageCodeTextInput = null;
    this.phoneCodeTextInput = null;
    /*用来指示是否显示Loading提示符号*/
    this.state = {
      disabled1: true,
      disabled2: true,
      disabled3: true,
      pressed: false,
      username: '',
      imageCode: "",
      verifyCode: "",
      password: "", //props.password,
      password1: "",
      focusUserName: 0, // 焦点 1: 没有 0:
      focusPassword: 0, // 焦点 1: 没有 0:
      focusPassword1: 0, // 焦点 1: 没有 0:
      focusPhoneCode: 0, // 焦点 1: 没有 0:
      focusImageCode: 0, // 焦点 1: 没有 0:
    };
  }
  shouldComponentUpdate(nextProps, nextState) {
    if(nextProps.type == types.FORGOT_INIT) {
      return false;
    }
    if (nextProps.type === types.FORGOT_ERROR) {
      // Toast.info(nextProps.status);
      Toast.hide();
      this.state.status = nextProps.status;
      if(nextProps.page == 1 && this.props.statusCode == '601') {
        this.props.imageCode();
      }
    }
    if (nextProps.type === types.FORGOT_RESET && nextProps.isSuccess) {
      let navigator = this.props.navigation;
      Toast.hide();
      Toast.success(nextProps.tip,1.5);
      this.props.init();
      setTimeout(() => {
        Toast.hide();
        storage.pop(navigator,1)
      }, 2000);
      
      return false;
    }
    if (nextProps.tip && nextProps.isSuccess) {
      Toast.success(nextProps.tip, 2);
    }

    if (nextProps.page != this.props.page) {
      this.props.imageCode();
      this.props.navigation.setParams({ loadLeftTitle: this.loadLeftTitle, loadTitle: this.loadTitle, gesturesEnabled: this.gesturesEnabled })

    }
    return true
  }

  gesturesEnabled = () => {
    return false;
  }
  loadTitle = () => {
    let { page } = this.props;
    let title = this.props.navigation.getParam('title');
    if(!title) {
      title = '密码管理';
    }
    return `${title}（${page}/3）`
  }
  needBack = (backFun) => {
    const { page } = this.props;
    if (page == 1) {
      if (backFun) {
        backFun(true);
      }
      return;
    }
    this.switchPage(page - 1);
    if (backFun) {
      backFun(false);
    }
    return;
  }
  loadLeftTitle = () => {
    return <LeftBarButtons top={false} needBack={this.needBack} navigation={this.props.navigation} currentItem={API.APP_EQUIPMENT} />
  }
  switchPage = (page) => {
    this.props.gotoPage(page);
  }

  componentDidMount = () => {
    this.props.imageCode();
  }
  _onImageClick = () => {
    this.props.imageCode();
  }
  _checkInput1() {
    this.state.status = '';
    return (this.state.username.length > 1 && this.state.imageCode.length > 1);
  }
  _checkInput2() {
    this.state.status = '';
    return (this.state.verifyCode.length > 3);
  }
  _checkInput3() {
    this.state.status = '';
    return (this.state.password.length > 5 && this.state.password1.length > 5 && this.state.password == this.state.password1);
  }
  // page 1
  _onUserNameChangeText = text => {
    if (text.indexOf('\n') >= 0) {
      this.imageCodeTextInput.focus();
      return;
    }
    let check = (text.length > 1 && this.state.imageCode.length > 3);
    this.setState({ username: text, disabled1: !check });
  };
  _onUserNameBlur = () => {
    this.setState({ focusUserName: 0, disabled1: !this._checkInput1() });
    if(this.state.username.length > 1 && this.state.username != this.props.userName) {
      const { userCheck } = this.props
      userCheck(this.state.username);
    }
  };
  _onUserNameFocus = () => {
    this.setState({
      focusUserName: 1,
      disabled1: !this._checkInput1()
    });
  };
  _onImageCodeChangeText = text => {
    if (text.indexOf('\n') >= 0) {
      if (this._checkInput1()) {
        this.doNextPage(2);
      }
      return;
    }
    let check = (text.length > 3 && this.state.username.length > 1);
    this.setState({ imageCode: text, disabled1: !check });
  };
  _onImageCodeBlur = () => {
    this.setState({ focusImageCode: 0, disabled1: !this._checkInput1() });
  };
  _onImageCodeFocus = () => {
    this.setState({
      focusImageCode: 1,
      disabled1: !this._checkInput1()
    });
  };

  // page 2
  _onPhoneCodeChangeText = text => {
    if (text.indexOf('\n') >= 0) {
      if (this._checkInput2()) {
        this.doNextPage(3);
      }
      return;
    }
    let check = (text.length > 3);
    this.setState({ verifyCode: text, disabled2: !check });
  };
  _onPhoneCodeBlur = () => {
    this.setState({ focusPhoneCode: 0, disabled2: !this._checkInput2() });
  };
  _onPhoneCodeFocus = () => {
    this.setState({
      focusPhoneCode: 1,
      disabled2: !this._checkInput2()
    });
  };

  // page 3
  _onPasswordBlur = () => {
    this.setState({ focusPassword: 0, disabled3: !this._checkInput3() });
  };
  _onPasswordFocus = () => {
    this.setState({
      focusPassword: 1,
      disabled3: !this._checkInput3()
    });
  };
  _onPasswordChangeText = text => {
    if (text && text.indexOf('\n') >= 0) {
      if (this._checkInput3()) {
        this.password2TextInput.focus();
      }
      return;
    }
    if (!text) {
      text = ''
    }
    let check = (text.length > 5 && this.state.password1.length > 5 && text == this.state.password1);
    this.setState({ password: text, disabled3: !check });
  };
  _onPassword1Blur = () => {
    this.setState({ focusPassword1: 0, disabled3: !this._checkInput3() });
  };
  _onPassword1Focus = () => {
    this.setState({
      focusPassword1: 1,
      disabled3: !this._checkInput3()
    });
  };
  _onPassword1ChangeText = text => {
    if (text && text.indexOf('\n') >= 0) {
      if (this._checkInput3()) {
        this.doReset();
      }
      return;
    }
    if (!text) {
      text = ''
    }
    let check = (text.length > 5 && this.state.password.length > 5 && text == this.state.password);
    this.setState({ password1: text, disabled3: !check });
  };

  doNextPage = (page) => {
    // Toast.loading('提交...', 0, null, true);
    const { phoneCode, phoneCodeVerify, imageCode } = this.props
    if (page == 2) {
      if (!this._checkInput1()) {
        this.setState({
          status:'请输入有效信息后重试',
          disabled3: true
        });
        return;
      }
      phoneCode(this.state.username, this.state.imageCode, this.props.signupKey);
      return;
    }
    if (page == 3) { 
      if(!this._checkInput2()) {
        this.setState({
          status:'请输入有效的验证码',
          disabled3: true
        });
        return;
      }
      phoneCodeVerify(this.state.username, this.state.verifyCode);
      return;
    }
  }
  doReset = () => {
    if (!this._checkInput3()) {
      this.setState({
        status:'两次密码输入不一致',
        disabled3: true
      });
      return;
    }
    
    Toast.loading('', 0, null, true);
    const { reset } = this.props
    reset(this.state.username, this.state.verifyCode, this.state.password)
  }
  renderPage1() {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: '#ffffff' }]}>
        <Text
          style={[
            styles.style_input_title,
            this.state.focusUserName == 1 || this.state.username.length > 0
              ? { color: "rgb(153,153,146)" }
              : { color: "transparent" },
            ,
            { marginTop: 20 }
          ]}
        >
          账户名
        </Text>
        <TextInputNormal
          placeholder={this.state.focusUserName == 1 ? "" : "请输入账户名称"}
          onBlur={() => this._onUserNameBlur()}
          onFocus={() => this._onUserNameFocus()}
          onChangeText={text => this._onUserNameChangeText(text)}
          defaultValue={this.props.userName ? this.props.userName : ''}
          ref={(ref) => { this.userNameTextInput = ref }}
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
            this.state.focusImageCode == 1 || this.state.imageCode.length > 0
              ? { color: "rgb(153,153,146)" }
              : { color: "transparent" },
            ,
            { marginTop: 20 }
          ]}
        >
          图片验证码
        </Text>
        <TextInputImage
          imageUrl={this.props.url}
          onImageClick={this._onImageClick}
          placeholder={this.state.focusImageCode == 1 ? "" : "图片验证码"}
          onBlur={() => this._onImageCodeBlur()}
          onFocus={() => this._onImageCodeFocus()}
          onChangeText={text => this._onImageCodeChangeText(text)}
          ref={(ref) => { this.imageCodeTextInput = ref }}
          value=''
        />
        <View
          style={
            this.state.focusImageCode == 1
              ? styles.style_input_line
              : styles.style_input_line_gray
          }
        />
        <View>
          <ActionButton
            onPress={() => { this.doNextPage(2) }}
            isDisabled={() => { return this.state.disabled1 }}
            text="下一步"
          >
          </ActionButton>
        </View>
      </SafeAreaView>

    );
  }
  renderPage2() {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: '#ffffff' }]}>
        <View>
          <Text style={[styles.style_tip, styles.style_tip_phone]

          }>请输入 {this.state.username} 收到的短信验证码</Text>

        </View>
        <Text
          style={[
            styles.style_input_title,
            this.state.focusPhoneCode == 1 || this.state.verifyCode.length > 0
              ? { color: "rgb(153,153,146)" }
              : { color: "transparent" },
            ,
            { marginTop: 0 }
          ]}
        >
          手机验证码
        </Text>
        <TextInputNormal
          placeholder={this.state.focusPhoneCode == 1 ? "" : "请输入手机验证码"}
          onBlur={() => this._onPhoneCodeBlur()}
          onFocus={() => this._onPhoneCodeFocus()}
          onChangeText={text => this._onPhoneCodeChangeText(text)}
          value={this.props.verifyCode}
          ref={(ref) => { this.phoneCodeTextInput = ref }}
        />
        <View
          style={
            this.state.focusPhoneCode == 1
              ? styles.style_input_line
              : styles.style_input_line_gray
          }
        />

        <View>
          <ActionButton
            onPress={() => { this.doNextPage(3) }}
            isDisabled={() => {return this.state.disabled2 }}
            text="下一步"
          >
          </ActionButton>
        </View>
      </SafeAreaView>

    );
  }
  renderPage3() {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: '#ffffff' }]}>
        <Text
          style={[
            styles.style_input_title,
            this.state.focusPassword == 1 || this.state.password.length > 0
              ? { color: "rgb(153,153,146)" }
              : { color: "transparent" },
            { marginTop: 20 }
          ]}
        >
          密码
        </Text>
        <TextInputPassword
          placeholder={this.state.focusPassword == 1 ? "" : "请输入用户密码"}
          onChangeText={text => this._onPasswordChangeText(text)}
          // value={this.state.password}
          onBlur={() => this._onPasswordBlur()}
          onFocus={() => this._onPasswordFocus()}
          ref={(ref) => { this.passwordTextInput = ref }}
          value=''
        />
        <View
          style={
            this.state.focusPassword == 1
              ? styles.style_input_line
              : styles.style_input_line_gray
          }
        />
        <Text
          style={[
            styles.style_input_title,
            this.state.focusPassword1 == 1 || this.state.password1.length > 0
              ? { color: "rgb(153,153,146)" }
              : { color: "transparent" },
              { marginTop: 20 }
          ]}
        >
          确认
        </Text>
        <TextInputPassword
          placeholder={this.state.focusPassword1 == 1 ? "" : "确认密码"}
          onChangeText={text => this._onPassword1ChangeText(text)}
          value=''
          onBlur={() => this._onPassword1Blur()}
          onFocus={() => this._onPassword1Focus()}
          ref={(ref) => { this.passwordTextInput2 = ref }}
        />
        <View
          style={
            this.state.focusPassword1 == 1
              ? styles.style_input_line
              : styles.style_input_line_gray
          }
        />
        <View>
          <Text style={
            styles.style_tip
          }>备注：请将新密码设置为6-20位，至少含数字／字母／字符两种组合。</Text>
        </View>
        <View>
          <ActionButton
            onPress={() => { this.doReset() }}
            isDisabled={() => { return this.state.disabled3 }}
            text="完  成"
          >
          </ActionButton>
        </View>
        <Text style={[styles.style_loginText, this.props.status === '登录出错' ? { color: 'red' } : {}]}>{this.props.status}</Text>
      </SafeAreaView>

    );
  }
  renderPage = () => {
    const { page } = this.props;
    if (page == 1) {
      return this.renderPage1();
    }
    if (page == 2) {
      return this.renderPage2();
    }
    if (page == 3) {
      return this.renderPage3();
    }
    return this.renderPage1();
  }
  render() {
    return (
      <KeyboardAwareScrollView style={{ backgroundColor: "#ffffff", flex: 1, marginLeft: 0, marginRight: 0 }}>
        <StatusBar
          barStyle="light-content"
          backgroundColor="#00baf3"
          translucent={false}
        />
        <View style={[{ flex: 1, height: 40, alignContent: 'center', alignItems: 'center', justifyContent: 'center', }]}>
          <Text style={[styles.style_tip, styles.style_tip_phone, { marginBottom: 0, marginTop: 20, }]}>
            {this.state.status}</Text>
        </View>
        {this.renderPage()}
      </KeyboardAwareScrollView>

    );
  }
};

var styles = StyleSheet.create({
  container: {
    flex: 1,
    marginLeft: 20,
    marginRight: 20,
  },
  text: {
    fontSize: 18,
    color: 'gray'
  },
  style_tip: {
    marginTop: 40,
    marginLeft: 20,
    marginRight: 20,
    marginBottom: 40,
    fontSize: 12,
    lineHeight: 20,
    color: '#ababab'
  },
  style_tip_phone: {
    color: 'red'
  },
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

  style_input_line: {
    height: 1,
    backgroundColor: "#00baf3",
    marginLeft: 20,
    marginRight: 20
  },
  style_input_line_gray: {
    height: 1,
    backgroundColor: "rgb(243,242,242)",
    marginLeft: 20,
    marginRight: 20
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
    type: state.forgot.type,
    status: state.forgot.status,
    tip: state.forgot.tip,
    isSuccess: state.forgot.isSuccess,
    page: state.forgot.page,
    url: state.forgot.url,
    verifyCode: state.forgot.verifyCode,
    userName: state.forgot.userName,
    signupKey: state.forgot.signupKey,
    statusCode: state.forgot.statusCode,
    errorCount: state.forgot.errorCount,
  }),
  dispatch => ({
    imageCode: () => {
      if (dispatch) {250179
        dispatch(fogotAction.imageCode())
      }
    },
    userCheck: (username) => {
      if (dispatch) {
        dispatch(fogotAction.userCheck(username))
      }
    },
    phoneCode: (mobile, captcha, signupKey) => {
      if (dispatch) {
        dispatch(fogotAction.phoneCode(mobile, captcha, signupKey))
      }
    },
    phoneCodeVerify: (mobile, verifyCode) => {
      if (dispatch) {
        dispatch(fogotAction.phoneCodeVerify(mobile, verifyCode))
      }
    },
    reset: (mobile, verifyCode, pwd) => {
      if (dispatch) {
        dispatch(fogotAction.reset(mobile, verifyCode, pwd))
      }
    },
    gotoPage: (page) => {
      if (dispatch) {
        dispatch(fogotAction.gotoPage(page))
      }
    },
    init: () => {
      if (dispatch) {
        dispatch(fogotAction.init())
      }
    },
  })
)(ForgotPage)