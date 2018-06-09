import React, { Component } from 'react'
import { View,Text,TouchableOpacity } from 'react-native'

import { Overlay } from 'app-3rd/teaset';

import OfflineStateUtil from '../../../common/utils/OfflineStateUtil'
/**
 * 主界面离线标记，点击后的提示框  跳转到在线模式的页面悬浮框
 */
click = (overlayView)=>{
    // console.log('----click to online----');
    overlayView && overlayView.close(); 
    let navigation = storage.getRootNavigation();
    // console.log('--------'+(OfflineStateUtil.isOnLine()));
    OfflineStateUtil.toOnLine();
    // console.log('--------'+(OfflineStateUtil.isOnLine()));
    console.log('to online current name='+storage.currentRouteName);
    // let currentPageName = storage.currentRouteName;
    // if(currentPageName=='LoginPage' || currentPageName=='ChoosePage' ||currentPageName=='ProjectPage'){
    //     //登录过程中   切换在线离线状态  不做切换
    // }else{
    //     //登录，并选择项目后   再次切换在线离线状态，则跳转到主页面
    //     storage.pushNext(navigation, "MainPage");
    // }
}
let currentview = null;
let overlayView = (
    <Overlay.View side='center' modal={false}
        style={{ flexDirection: 'column', alignItems: 'center', justifyContent: 'center', alignContent: 'center', }}
        ref={v => {this.overlayView = v;currentview= v;}}
    >
        <View style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center', alignContent: 'center', marginBottom: 93, marginTop: 20 }}>
            
            <View style={{width:270,height:142, backgroundColor:'#ffffff',borderRadius:6,alignItems: 'center'}}>
                <Text style={{ color: '#000000', fontSize: 16, marginTop: 30,marginLeft:20,marginRight:20}} >当前操作环境为离线模式，要恢复至网络模式吗？</Text>
                <View style={{backgroundColor:'#e7e7e7',height:1,width:270,marginTop:20}}></View>
                <View style={{flex:1,flexDirection:'row'}} >
                    <TouchableOpacity onPress={()=>{this.overlayView && this.overlayView.close();}}>
                        <Text style={{ color: '#5b5b5b', fontSize: 18 ,width:135,textAlign:'center',marginTop:10}} >取消</Text>
                    </TouchableOpacity>
                    <View style={{backgroundColor:'#e7e7e7',width:1}}></View>
                    <TouchableOpacity onPress={()=>{click(this.overlayView)}}>
                        <Text style={{ color: '#00baf3', fontSize: 18 ,width:135,textAlign:'center',marginTop:10}} >网络模式</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    </Overlay.View>
);

//主页离线标记的提示框
export default class ToOnlineDialog {
    static show(navigation) {
        
        Overlay.show(overlayView);
    }
    static hide(){
        currentview && currentview.close();
    }
  
}
