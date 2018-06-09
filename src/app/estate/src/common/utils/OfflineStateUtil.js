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
        storage.setOfflineState(false);
    }

    //判断是否在线模式  true在线 false 离线
     static isOnLine(){
        // let state = storage.getOfflineState();
        // return state==true || state==undefined;
        return false
    }
}


