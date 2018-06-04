'use strict';
import React, { Component } from "react";
import {
    View,
    Text,
    StatusBar,
    TouchableOpacity,
    Image,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    TouchableHighlight,
    Dimensions,
    NativeModules,
    Platform,
    Switch,
} from "react-native";
var PM = NativeModules.GLDPhotoManager;
import { connect } from 'react-redux' // 引入connect函数
import * as loginAction from '../../../login/actions/loginAction' // 导入action方法 

import { ListRow } from "app-3rd/teaset";
import * as USERAPI from "app-api";
import WideButton from "./../../components/WideButton";

import { Toast } from 'antd-mobile'
import * as CheckVersion from "./checkVerson";
import { BarItems, LoadingView, ActionButton } from "app-components";

var { width, height } = Dimensions.get("window");

class SettingPage extends Component {

    static navigationOptions = {
        headerTitle: <BarItems.TitleBarItem text='设置'/>,
        headerRight:<View/>,
      };
    componentDidMount = () => {
        // console.log(this.props.navigation.state.params);
        //请求数据
        this.props.navigation.setParams({ rightNavigatePress: this._rightAction })
    }
    componentWillUnmount = () => {
        clearTimeout();
    }
    _rightAction = () => {
        // console.log("执行_rightAction");
    }
    constructor() {
        super();
        let autoDownload = true;
        if (storage.loadAutoDownload() === false) {
            autoDownload = false;
        }
        this.state = {
            autoDownload: autoDownload,
        };
    }
    _flexDebugShow = () => {
        PM.flexDebugShow();
        /* <SettingItemView icon={require('app-images/icon_setting_about_us.png')} title='打开FLEX' onPress={() => this._flexDebugShow()} ></SettingItemView>
            <View style={{ height: 10 }}></View> */
    }
    _tenantChoose = () => {
        let navigator = this.props.navigation;
        storage.projectIdVersionId = '';
        // storage.pushNext(navigator, "TenantPage")
        storage.gotoSwitchProject(navigator);
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
        storage.pushNext(navigator, "ForgotPage", { title: '重置密码' })
    }

    _logout = () => {
        storage.logout();
        Toast.loading('退出中...', 0, null, true);
        let overTime = false;
        USERAPI.loginOut().then(() => {

            USERAPI.uaaLoginOut().then(() => {

            }).catch((error) => {

            });
            if (overTime) {
                return;
            }
            overTime = true;
            let navigator = this.props.navigation;
            storage.gotoLogin(navigator);
        }).catch((error) => {
            if (overTime) {
                return;
            }
            overTime = true;
            Toast.hide();
            let navigator = this.props.navigation;
            storage.gotoLogin(navigator);
        });
        setTimeout(() => {
            if (overTime) {
                return;
            }
            overTime = true;
            Toast.hide();
            let navigator = this.props.navigation;
            storage.gotoLogin(navigator);
        }, 10000);
    }

    render() {
        return (
            <SafeAreaView style={styles.container}>
                <StatusBar barStyle="light-content" translucent={false} backgroundColor="#00baf3" />
               <ScrollView style={{paddingBottom:60}}>
                    <SettingItemView icon={require('app-images/icon_setting_change_password.png')} title='修改密码' onPress={() => this._password()} ></SettingItemView>
                    <View style={{ height: 10 }}></View>
                    {
                        Platform.OS === 'android' ? (
                            <View>
                                <SettingItemView icon={require('app-images/icon_setting_version.png')} title='WLAN下自动升级' hideArrow={true} switchValue={this.state.autoDownload} showSwitch={true} onSwitchChange={(value) => {
                                    storage.setAutoDownload(value)
                                }}></SettingItemView>
                                <View style={styles.settingItemLine}></View>
                                <SettingItemView icon={require('app-images/icon_setting_version.png')} title='检查更新' hideArrow={true} showExtText={'当前版本 V1.1.0'} onPress={() => { CheckVersion.checkVersion("setting") }} ></SettingItemView>
                            </View>
                        ) : (
                                <SettingItemView icon={require('app-images/icon_setting_version.png')} title='版本信息' hideArrow={true} showExtText={'版本号V1.1.0'} ></SettingItemView>
                            )
                    }

                    <View style={styles.settingItemLine}></View>
                    <SettingItemView icon={require('app-images/icon_setting_feedback.png')} title='意见反馈' onPress={() => this._feedback()} ></SettingItemView>
                    <View style={styles.settingItemLine}></View>
                    <SettingItemView icon={require('app-images/icon_setting_contact_us.png')} title='联系我们' hideArrow={true} ></SettingItemView>
                    <View style={styles.settingItemLine}></View>
                    <SettingItemView icon={require('app-images/icon_setting_about_us.png')} title='关于我们' onPress={() => this._about()} ></SettingItemView>
                    <View style={{ height: 10 }}></View>

                    <SettingItemView icon={require('app-images/icon_setting_offline.png')} title='离线设置' ></SettingItemView>
                    <View style={{marginTop:40,marginLeft:20,marginRight:20}}><ActionButton
            onPress={()=>{this._logout()}}
            isDisabled={()=>{return false}}
            text="退出登录"
          >
          </ActionButton> 
          </View>
                    <View style={{height:60,width:'100%'}} />
                </ScrollView>
            </SafeAreaView>
        );
    }

}

class SettingItemView extends React.Component {

    constructor() {
        super();
        this.state = {
            switchValue: true,
        }
    }

    componentDidMount() {
        let switchValue = false;
        if (this.props && this.props.switchValue) {
            switchValue = true;
        }
        this.setState({
            switchValue: switchValue,
        });
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
                    {
                        this.props.showSwitch ? <Switch style={{ marginRight: 20 }} value={this.state.switchValue} onValueChange={(value) => {
                            this.setState({
                                switchValue: value
                            }, () => {
                                if (this.props.onSwitchChange) {
                                    this.props.onSwitchChange(value)
                                }
                            })
                        }} /> : null
                    }
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
        marginLeft: 20,
        resizeMode: 'contain',
    },
    settingItemText: {
        marginLeft: 17,
        flex: 1,
        fontSize: 14,
        color: '#325771',
    },
    settingItemExtText: {
        fontSize: 14,
        color: '#325771',
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