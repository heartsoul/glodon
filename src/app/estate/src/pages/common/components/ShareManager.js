/**
 * Created by wangfei on 17/8/28.
 */
import React, { Component } from 'react';
import {
    Dimensions,
    Linking,
    Clipboard,
    Platform,
    StyleSheet,
    View,
} from 'react-native';
import { GLDGrid, GLDActionSheet, ActionModal } from 'app-components'
import { Toast } from "antd-mobile"
import ShareView from './ShareView'
import API from 'app-api'
var { width, height } = Dimensions.get("window")
var { NativeModules } = require('react-native');

// module.exports = NativeModules.UMShareModule;
// platform
// case 0: // QQ
// return UMSocialPlatformType_QQ;
// case 1: // Sina
// return UMSocialPlatformType_Sina;
// case 2: // wechat
// return UMSocialPlatformType_WechatSession;
// case 3:
// return UMSocialPlatformType_WechatTimeLine;
// case 4:
// return UMSocialPlatformType_Qzone;
// case 5:
// return UMSocialPlatformType_Email;
// case 6:
// return UMSocialPlatformType_Sms;
// case 7:
// return UMSocialPlatformType_Facebook;
// case 8:
// return UMSocialPlatformType_Twitter;
// case 9:
// return UMSocialPlatformType_WechatFavorite;

// function share(text = '', icon = '', link = '', title = '', platform = 0, completion = (a, b) => { }) {
//     NativeModules.UMShareModule.share(text, icon, link, title, platform, completion);
// }
// function shareboard(text = '', icon = '', link = '', title = '', platforms = [0, 1, 2, 3, 4, 5, 6, 33], completion = (a, b) => { }) {
//     // alert(NativeModules.UMShareModule)
//     // alert(NativeModules.UMShareModule.shareboard)
//     // alert(NativeModules.UMShareModule.share)
//     NativeModules.UMShareModule.shareboard(text,icon,link,title,platforms,completion);
// }

const PLATFORM_WECHAT = 2;
const PLATFORM_QQ = 0;
const PLATFORM_EMAIL = 0;
const PLATFORM_MORE = 33;
const data = [
    { source: require("app-images/icon_share_wx.png"), name: "微信", platform: PLATFORM_WECHAT },
    { source: require("app-images/icon_share_collect.png"), name: "QQ", platform: PLATFORM_QQ },
    { source: require("app-images/icon_share_pyq.png"), name: "邮箱", platform: PLATFORM_EMAIL },
    { source: require("app-images/icon_share_pyq.png"), name: "链接", platform: PLATFORM_MORE },
    { source: require("app-images/icon_share_pyq.png"), name: "更多", platform: PLATFORM_MORE },
];

class ShareManager {

    static sharePlatform(text = '', icon = '', link = '', title = '', platform = 0, completion = (a, b) => { }) {
        if (Platform.OS === 'web') {
            return;
        }
        NativeModules.UMShareModule.share(text, icon, link, title, platform, completion);
    }

    static share(containerId, fileId) {
        let shareView = <ShareView
            data={data}
            containerId={containerId}
            fileId={fileId}
            share={(item, token, title, password) => {
                let userName = storage.loadUserInfo().accountInfo.name;
                let url = API.buildShareUrl(token);
                let icon = "";
                let textOnly = `${userName}分享了一个文件`;
                let textWithUrl = `${userName}分享了文件 - ${title}\n${url}`;
                switch (item.name) {
                    case "微信":
                    case "QQ":
                        ShareManager.sharePlatform(title, icon, url, textOnly, item.platform, completion = (code, message) => {

                        })
                        break;
                    case "更多":
                        if (Platform.OS === 'android') {
                            ShareManager.sharePlatform(textWithUrl, icon, url, title, item.platform)
                            break;
                        } else if (Platform.OS === 'ios') {
                            NativeModules.GLDPhotoManager.shareAppAction({ text: textOnly, url: url }, (data, bSuccess) => {
                                
                            });
                        }
                        break;
                    case "邮箱":
                        let mailInfo = `mailto:?subject=${title}&body=${textWithUrl}`;
                        this.openEmail(mailInfo);
                        break;
                    case "链接":
                        Clipboard.setString(`${url}`)
                        Toast.success("已复制到剪切板", 1.5)
                        break;
                }

            }}
        />
        GLDActionSheet.show(shareView)
    }

    static openEmail(url) {
        Linking.canOpenURL(url).then(supported => {
            if (!supported) {
                Toast.success("无法打开邮箱", 1.5)
                console.log('Can\'t handle url: ' + url);
            } else {
                Linking.openURL(url).catch(err => {
                    console.error('An error occurred', err)
                    Toast.success("无法打开邮箱", 1.5)
                });
            }
        }).catch(err => {
            console.error('An error occurred', err)
            Toast.success("无法打开邮箱", 1.5)
        });
    }
}
export default ShareManager;
