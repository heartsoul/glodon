/**
 * Created by wangfei on 17/8/28.
 */
import React, { Component } from 'react';
import {
    View,
    Text,
    Image,
    SafeAreaView,
    Dimensions,
    TouchableOpacity,
    StyleSheet,
} from 'react-native';
import { Overlay, } from 'app-3rd/teaset';
var { width, height } = Dimensions.get('window')
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

function sharePlatform(text = '', icon = '', link = '', title = '', platform = 0, completion = (a, b) => { }) {
    NativeModules.UMShareModule.share(text, icon, link, title, platform, completion);
}

export function share(text = '', icon = '', link = '', title = '', completion = (a, b) => { }) {

    text = text || 'BIM协同，真的来了';
    link = link || 'http://bim.glodon.com';
    title = title || 'BIM协同';

    let overlayView =
        (
            <Overlay.View side='bottom' modal={false}
                style={{ flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', alignContent: 'center', }}
                overlayOpacity={0.7}
                ref={v => overlayView = v}
            >
                <SafeAreaView>
                    <View style={{ width: width, backgroundColor: "#f0f0f0", alignItems: "center" }}>
                        <Text style={{ fontSize: 16, marginTop: 20, marginBottom: 10 }}>选择要分享到的平台</Text>
                        <View style={{ flexDirection: "row" }}>
                            <TouchableOpacity onPress={(event) => { event.preventDefault(); overlayView.close() ,sharePlatform(text,icon,link,title,PLATFORM_WECHAT,completion)}}>
                                <View key={'img_item_0'} style={styles.shareBox}>
                                    <Image style={styles.shareIcmage} source={require("app-images/icon_share_wx.png")} />
                                    <Text>微信</Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={(event) => { event.preventDefault(); overlayView.close(),sharePlatform(text,icon,link,title,PLATFORM_QQ,completion) }}>
                                <View key={'img_item_1'} style={styles.shareBox}>
                                    <Image style={styles.shareIcmage} source={require("app-images/icon_share_collect.png")} />
                                    <Text>收藏</Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={(event) => { event.preventDefault(); overlayView.close(),sharePlatform(text,icon,link,title,PLATFORM_EMAIL,completion) }}>
                                <View key={'img_item_2'} style={styles.shareBox}>
                                    <Image style={styles.shareIcmage} source={require("app-images/icon_share_pyq.png")} />
                                    <Text>朋友圈</Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={(event) => { event.preventDefault(); overlayView.close(),sharePlatform(text,icon,link,title,PLATFORM_MORE,completion) }}>
                                <View key={'img_item_3'} style={styles.shareBox}>
                                    <Image style={styles.shareIcmage} source={require("app-images/icon_share_pyq.png")} />
                                    <Text style={{}}>更多</Text>
                                </View>
                            </TouchableOpacity>

                        </View>
                        <TouchableOpacity style={{ width: width, height: 50, justifyContent: "center", alignItems: "center", backgroundColor: "#fff" }} onPress={(event) => { event.preventDefault(); overlayView.close() }}>
                            <Text style={{ fontSize: 16 }} >取消分享</Text>
                        </TouchableOpacity>
                    </View>
                </SafeAreaView>
            </Overlay.View>
        );
    Overlay.show(overlayView);
}

const styles = StyleSheet.create({
    shareBox: {
        width: width / 4,
        height: width / 4,
        alignItems: "center"
    },
    shareIcmage: {
        width: 60,
        height: 60,
        resizeMode: 'contain'
    }
})
