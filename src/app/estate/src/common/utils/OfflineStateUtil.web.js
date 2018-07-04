/**
 * 在线离线状态存储
 */
import React,{Component} from 'react';

export default class OfflineStateUtil{

    //设置为在线模式
     static toOnLine(){
        storage.setOfflineState(true);
    }

    //设置为离线模式
    static toOffLine(){
        storage.setOfflineState(true);
    }

    //判断是否在线模式  true在线 false 离线
     static isOnLine(){
        // let state = storage.getOfflineState();
        // return state==true || state==undefined;
        return true
    }
    //离线操作提示
    static showOfflineAlert(){
        // if((!this.isOnLine()) && isShow){
        //    ActionModal.alert('提示信息', "当前为离线状态，网络恢复后，系统将自动为您提交当前单据，您无需再次操作。", [{ text: '知道了', style: { color: '#00baf3' } }]);
        //    isShow = false;
        // }
   }
}


