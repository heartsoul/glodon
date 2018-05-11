'use strict';
import React, { Component } from "react";
import {
  View,
  Text,
  StatusBar,
  TouchableOpacity,
  Image,
  SafeAreaView,
  StyleSheet,
  TouchableHighlight,
  Dimensions,
} from "react-native";
import { connect } from 'react-redux' // 引入connect函数
import * as loginAction from '../../../login/actions/loginAction' // 导入action方法 

import { ListRow } from "app-3rd/teaset";
import * as USERAPI from "app-api";

var { width, height } = Dimensions.get("window");

class SettingPage extends Component {

  static navigationOptions = ({ navigation, screenProps }) => ({
    title: '设置',
  });
  componentDidMount = () => {
    // console.log(this.props.navigation.state.params);
    //请求数据
    this.props.navigation.setParams({ rightNavigatePress: this._rightAction })
  }
  _rightAction = () => {
    // console.log("执行_rightAction");
  }
  constructor() {
    super();
    this.state = {
      pressed: false,
    };
  }

  _tenantChoose = () => {
    let navigator = this.props.navigation;
    storage.projectIdVersionId = '';
    storage.pushNext(navigator, "TenantPage")
  }
  _about = () => {
    let navigator = this.props.navigation;
    storage.pushNext(navigator, "AboutPage")
  }
  _feedback = () => {
    let navigator = this.props.navigation;
    storage.pushNext(navigator, "FeedbackPage")
  }
  _password = () => {
    let navigator = this.props.navigation;
    storage.pushNext(navigator, "ForgotPage",{title:'重置密码'})
  }

  _logout = () => {
    storage.logout();
    USERAPI.loginOut().then(() => {
      USERAPI.uaaLoginOut().then(() => {

      }).catch((error)=>{
      
      });
      this.props.logout();
      let navigator = this.props.navigation;
      storage.gotoLogin(navigator);
    }).catch((error)=>{

    });
  }

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" translucent={false} backgroundColor="#00baf3" />

        <SettingItemView icon={require('app-images/icon_setting_change_password.png')} title='修改密码' onPress={() => this._password()} ></SettingItemView>
        <View style={{ height: 10 }}></View>

        <SettingItemView icon={require('app-images/icon_setting_version.png')} title='版本信息' hideArrow={true} showExtText={'版本号V1.1.0'} ></SettingItemView>
        <View style={styles.settingItemLine}></View>
        <SettingItemView icon={require('app-images/icon_setting_feedback.png')} title='意见反馈' onPress={() => this._feedback()} ></SettingItemView>
        <View style={styles.settingItemLine}></View>
        <SettingItemView icon={require('app-images/icon_setting_contact_us.png')} title='联系我们' hideArrow={true} ></SettingItemView>
        <View style={styles.settingItemLine}></View>
        <SettingItemView icon={require('app-images/icon_setting_about_us.png')} title='关于我们' onPress={() => this._about()} ></SettingItemView>
        <View style={{ height: 10 }}></View>
        <SettingItemView icon={require('app-images/icon_setting_offline.png')} title='离线设置' ></SettingItemView>
        <TouchableHighlight
          onPress={this._logout}
          underlayColor="#0099f3"
          activeOpacity={1.0}

          style={
            this.state.pressed
              ? styles.logoutTextViewPressed
              : styles.logoutTextView
          }
          onHideUnderlay={() => {
            this.setState({ pressed: false });
          }}
          onShowUnderlay={() => {
            this.setState({ pressed: true });
          }}
        >
          <Text style={styles.logoutText}>退出登录 </Text>
        </TouchableHighlight>
      </SafeAreaView>
    );
  }

}

class SettingItemView extends React.Component {

  constructor() {
    super();
  }

  componentDidMount() {

  }

  render() {
    let arrow = this.props.hideArrow ? null : <Image source={require('app-images/icon_arrow_right_gray.png')} style={styles.settingItemArrow} />;    // 箭头
    let extText = this.props.showExtText ? <Text style={styles.settingItemExtText}>{this.props.showExtText}</Text> : null;    // 箭头
    return (
      <TouchableOpacity onPress={() => { this.props.onPress && this.props.onPress() }}>
        <View style={styles.settingItemContainer}>
          <Image source={this.props.icon} style={styles.settingItemIcon} />
          <Text style={styles.settingItemText}>{this.props.title} </Text>
          {extText}
          {arrow}
        </View>
      </TouchableOpacity>
    );
  }
}

var styles = StyleSheet.create({
  container: {
    backgroundColor: '#f5f8f9',
    width: width,
    height: height
  },

  settingItemContainer: {
    height: 50,
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: '#ffffff'
  },
  settingItemIcon: {
    width: 24,
    height: 24,
    marginLeft: 20
  },
  settingItemText: {
    marginLeft: 17,
    flex: 1,
    fontSize: 14,
    color: '#000000',
  },
  settingItemExtText: {
    fontSize: 14,
    color: '#999992',
    marginRight: 20
  },
  settingItemArrow: {
    width: 5,
    height: 12,
    marginRight: 20
  },
  settingItemLine: {
    height: 1,
    backgroundColor: '#f7f7f7',
  },
  logoutTextView: {
    overflow: "hidden",
    height: 40,
    backgroundColor: "#00baf3",
    borderRadius: 20,
    marginTop: 40,
    marginLeft: 20,
    marginRight: 20
  },

  logoutTextViewPressed: {
    overflow: "hidden",
    height: 40,
    backgroundColor: "#33baf3",
    borderRadius: 20,
    marginTop: 40,
    marginLeft: 20,
    marginRight: 20
  },
  logoutText: {
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

});

export default connect(
  state => ({
    status: state.loginIn.status,
    isSuccess: state.loginIn.isSuccess,
    user: state.loginIn.user,
    hasChoose: state.loginIn.hasChoose,
  }),
  dispatch => ({
    logout: () => {
      if (dispatch) {
        dispatch(loginAction.logout())
      }
    },
  })
)(SettingPage)