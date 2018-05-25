import React, { Component } from 'react'
import { View, Image, Text,TouchableOpacity } from 'react-native'

import { Overlay } from 'app-3rd/teaset';

import WideButton from "./WideButton";
import OfflineStateUtil from '../../../common/utils/OfflineStateUtil'
/**
 * 跳转到在线模式的页面悬浮框
 */
click = (overlayView)=>{
    // console.log('----click to online----');
    overlayView && overlayView.close(); 
    let navigation = storage.getRootNavigation();
    // console.log('--------'+(OfflineStateUtil.isOnLine()));
    OfflineStateUtil.toOnLine();
    // console.log('--------'+(OfflineStateUtil.isOnLine()));
    console.log('to online current name='+storage.currentRouteName);
    let currentPageName = storage.currentRouteName;
    if(currentPageName=='LoginPage' || currentPageName=='ChoosePage' ||currentPageName=='ProjectPage'){
        //登录过程中   切换在线离线状态  不做切换
    }else{
        //登录，并选择项目后   再次切换在线离线状态，则跳转到主页面
        storage.pushNext(navigation, "MainPage");
    }
}
let currentview = null;
let overlayView = (
    <Overlay.View side='bottom' modal={false}
        style={{ flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', alignContent: 'center', }}
        // modal={true}
        // overlayOpacity={0}
        ref={v => {this.overlayView = v;currentview= v;}}
    >
        <View style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center', alignContent: 'center', marginBottom: 93, marginTop: 20 }}>
            
            <View style={{width:300,height:350, backgroundColor:'#ffffff',borderRadius:5,alignItems: 'center'}}>
                <Image source={require("app-images/icon_toOnline_hint.png")} style={{width:242,height:127,marginTop:20}} />
                <Text style={{ color: '#000000', fontSize: 18, marginTop: 13,marginLeft:23,marginRight:23 }} >网络信号已恢复，建议您恢复至网络模式！</Text>
                <Text style={{ color: '#262525', fontSize: 13, marginTop: 20,marginLeft:23,marginRight:23 }} >请先保存好您离线模式下编辑的数据，再恢复至网络模式。</Text>
                <WideButton text="恢复网络模式" onClick={()=>{click(this.overlayView)}} style={{ marginTop: 25, width: 260,height:40, alignSelf: "center" }} />
            </View>
            <TouchableOpacity onPress={()=>{this.overlayView && this.overlayView.close();}}>
                <Image source={require("app-images/icon_module_create_white.png")} transform={([{ rotateZ: '45deg' }])} style={{ width:35,height:35,marginTop:35}} />
            </TouchableOpacity>
        </View>
    </Overlay.View>
);
export default class ToOnlineOverLay {
    static show(navigation) {
        
        Overlay.show(overlayView);
    }
    static hide(){
        if(currentview!=null){
            currentview.close();
        }
    }
  
}
