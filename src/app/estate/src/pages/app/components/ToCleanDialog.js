import React, { Component } from 'react'
import { View,Text,TouchableOpacity } from 'react-native'

import { Overlay } from 'app-3rd/teaset';

let retFunc = null;
/**
 * 清除缓存的提示框
 */
click = (overlayView)=>{
    // console.log('----click to online----');
    overlayView && overlayView.close(); 
    console.log('to clean current name='+storage.currentRouteName);
    retFunc();
}
let currentview = null;
let overlayView = (
    <Overlay.View side='center' modal={false}
        style={{ flexDirection: 'column', alignItems: 'center', justifyContent: 'center', alignContent: 'center', }}
        ref={v => {this.overlayView = v;currentview= v;}}
    >
        <View style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center', alignContent: 'center', marginBottom: 93, marginTop: 20 }}>
            
            <View style={{width:270,height:142, backgroundColor:'#ffffff',borderRadius:6,alignItems: 'center'}}>
                <Text style={{ color: '#000000', fontSize: 16, marginTop: 30,marginLeft:20,marginRight:20}} >此操作将删除您已下载的离线应用相关数据，确定清除吗？</Text>
                <View style={{backgroundColor:'#e7e7e7',height:1,width:270,marginTop:20}}></View>
                <View style={{flex:1,flexDirection:'row'}} >
                    <TouchableOpacity onPress={()=>{this.overlayView && this.overlayView.close();}}>
                        <Text style={{ color: '#5b5b5b', fontSize: 18 ,width:135,textAlign:'center',marginTop:10}} >取消</Text>
                    </TouchableOpacity>
                    <View style={{backgroundColor:'#e7e7e7',width:1}}></View>
                    <TouchableOpacity onPress={()=>{click(this.overlayView)}}>
                        <Text style={{ color: '#00baf3', fontSize: 18 ,width:135,textAlign:'center',marginTop:10}} >清除</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    </Overlay.View>
);

//主页离线标记的提示框
export default class ToCleanDialog {
    static show(retFunction) {
        retFunc = retFunction;
        Overlay.show(overlayView);
    }
    static hide(){
        currentview && currentview.close();
    }
  
}
