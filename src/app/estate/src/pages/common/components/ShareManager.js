/**
 * Created by wangfei on 17/8/28.
 */
import React, { Component } from 'react';
import {
    Dimensions,
    Linking,
    Clipboard,
} from 'react-native';
import { GLDGrid, GLDActionSheet } from 'app-components'
import ShareView from './ShareView'
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
        NativeModules.UMShareModule.share(text, icon, link, title, platform, completion);
    }

    static share() {
        let shareView = <ShareView
            data={data}
            share={(item, token, content) => {
                switch (item.name) {
                    case "微信":
                    case "QQ":
                    case "更多":
                        ShareManager.sharePlatform(content, 'https://www.baidu.com/img/bd_logo1.png', 'http://www.baidu.com',"title", item.platform , (a, b) => {
                            
                        })
                        break;
                    case "邮箱":
                         Linking.openURL("mailto:?subject=fsf&body=aabb").catch(err => console.error('An error occurred', err));
                        break;
                    case "链接":
                        Clipboard.setString(content)
                        break;
                }


            }}
        />
        GLDActionSheet.show(shareView)
    }

}

export default ShareManager;
