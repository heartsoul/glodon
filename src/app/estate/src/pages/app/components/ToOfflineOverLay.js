import React, { Component } from 'react'
import { View, Image, Text,TouchableOpacity } from 'react-native'

import { Overlay } from 'app-3rd/teaset';

import WideButton from "./WideButton";
import OfflineStateUtil from '../../../common/utils/OfflineStateUtil'
/**
 * 跳转到离线模式的页面悬浮框
 */

let currentview = null;
let overlayView = (
    <Overlay.View side='bottom' modal={false}
        style={{ flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', alignContent: 'center', }}
        // modal={true}
        // overlayOpacity={0}
        ref={v => {this.overlayView = v;currentview= v;}}
    >
        <View style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center', alignContent: 'center', marginBottom: 93, marginTop: 20 }}>
            
            <View style={{width:300,height:340, backgroundColor:'#ffffff',borderRadius:5,alignItems: 'center'}}>
                <Image source={require("app-images/icon_toOffline_hint.png")} style={{width:242,height:91,marginTop:30}} />
                <Text style={{ color: '#000000', fontSize: 18, marginTop: 13,marginLeft:23,marginRight:23 }} >当前没有网络信号，建议您进入离线模式！</Text>
                <Text style={{ color: '#000000', fontSize: 13, marginTop: 20,marginLeft:23,marginRight:23 }} >离线模式下您可以进行基本业务操作。需要您预先在离线BIM里下载模型、图纸、订单等相关信息，网络恢复后，数据将同步更新。</Text>
                <WideButton text="离线模式" onClick={()=>{
                    // console.log('----click to offline----');
                    this.overlayView && this.overlayView.close(); 
                    let navigation = storage.getRootNavigation();
                    // console.log('--------'+(OfflineStateUtil.isOnLine()));
                    OfflineStateUtil.toOffLine();
                    // console.log('--------'+(OfflineStateUtil.isOnLine()));
                    console.log('to offline current name='+storage.currentRouteName);
                    let currentPageName = storage.currentRouteName;
                    if(currentPageName=='LoginPage' || currentPageName=='ChoosePage' ||currentPageName=='ProjectPage'){
                        //登录过程中   切换在线离线状态  不做切换
                    }else{
                        //登录，并选择项目后   再次切换在线离线状态，则跳转到主页面
                        storage.pushNext(navigation, "MainPage");
                    }
                    

                }} style={{ marginTop: 25, width: 260,height:40, alignSelf: "center" }} />
            </View>
            <TouchableOpacity onPress={()=>{this.overlayView && this.overlayView.close();}}>
            <Image source={require("app-images/icon_module_create_white.png")} transform={([{ rotateZ: '45deg' }])} style={{ width:35,height:35,marginTop:35}} />
            </TouchableOpacity>
        </View>
    </Overlay.View>
);
export default class ToOfflineOverLay {
    
    static show() {
        
        Overlay.show(overlayView);
    }

    static hide(){
        if(currentview!=null){
            currentview.close();
        }
    }
}
