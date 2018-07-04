import React, { Component } from 'react'
import { View, Image, Text,TouchableOpacity } from 'react-native'

import { Overlay } from 'app-3rd/teaset';
import NetWorkUtil from '../../../common/utils/NetWorkUtil'
/**
 * 非wifi下，下载模型  进行提示
 */

let currentview = null;
let size = 22;
let goOn = null;
let pause = null;
let cancel = null;
let isShow = true;
let overlayView = (
    <Overlay.View side='bottom' modal={false}
        style={{ flexDirection: 'column', alignItems: 'center', justifyContent: 'center', alignContent: 'center', }}
        // modal={true}
        // overlayOpacity={0}
        ref={v => {this.overlayView = v;currentview= v;}}
    >
        <View style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center', alignContent: 'center', marginBottom: 93, marginTop: 20 }}>
            
            <View style={{width:298,height:273, backgroundColor:'#ffffff',borderRadius:5,alignItems: 'center'}}>
                <Text style={{ color: '#000000', fontSize: 20, marginTop: 28}} >流量提醒</Text>
                <Text style={{ color: '#666666', fontSize: 16, marginTop: 19,marginLeft:32,marginRight:32}} >当前非Wi-Fi环境，正则使用流量缓存，大小约{size}M</Text>
                <View style={{backgroundColor:'#e7e7e7',width:298,height:0.5,marginTop:29 }} />
                <TouchableOpacity onPress={()=>{goOn();currentview && currentview.close();}}>
                    <Text style={{ color: '#00baf3', fontSize: 16, marginTop: 8}} >继续缓存</Text>
                </TouchableOpacity>
                <View style={{backgroundColor:'#e7e7e7',width:298,height:0.5,marginTop:10 }} />
                <TouchableOpacity onPress={()=>{pause();currentview && currentview.close();}}>
                    <Text style={{ color: '#333333', fontSize: 16, marginTop: 8}} >暂停，wifi下自动缓存</Text>
                </TouchableOpacity>
                <View style={{backgroundColor:'#e7e7e7',width:298,height:0.5,marginTop:10 }} />
                <TouchableOpacity onPress={()=>{cancel();currentview && currentview.close();}}>
                    <Text style={{ color: '#333333', fontSize: 16, marginTop: 8}} >取消缓存</Text>
                </TouchableOpacity>
            </View>
            <TouchableOpacity onPress={()=>{this.overlayView && this.overlayView.close();}}>
            <Image source={require("app-images/icon_module_create_white.png")} transform={([{ rotateZ: '45deg' }])} style={{ width:35,height:35,marginTop:35}} />
            </TouchableOpacity>
        </View>
    </Overlay.View>
);
export default class NotWifiOverLay {
    
    static show(goOnAction,pauseAction,cancelAction,num) {
        NetWorkUtil.isWifi((result)=>{
            if(isShow && !result){
                goOn = goOnAction;
                pause = pauseAction;
                cancel = cancelAction;
                size = num;
                Overlay.show(overlayView);
                isShow = false;
            }else{
                goOnAction();
            }
        })
        
    }

    static hide(){
        if(currentview!=null){
            currentview.close();
        }
    }
}
