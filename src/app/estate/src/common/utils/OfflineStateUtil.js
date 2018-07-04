/**
 * 在线离线状态存储
 */
import React,{Component} from 'react';
import * as API from 'app-api';
import { ActionModal } from 'app-components';
import UserInfoManager from '../../pages/offline/manager/UserInfoManager'
let isShow = true;
export default class OfflineStateUtil{

    //设置为在线模式
     static toOnLine(){
         storage.setOfflineState(true);
         this._logout();
        //  let um = new UserInfoManager();
        //  let account = um.getCurrentAccountInfo();
        //  if(account){
        //     let username = account.key;
        //     let pwd = account.value;
            
        //     API.authToken(username, pwd).then((response) => {
        //         // console.log('response.data:'+response.data1);
        //         um.saveAccountInfo(username,pwd);
        //         this.loadAccount(response,username, pwd,response.data.access_token);
        //     }).catch((e) => {
        //       dispatch(loginError(false));
        //     });
            
        //  }
        
    }

    static _logout = () => {
        storage.logout();
        storage.gotoLogin();
    }

//在线处理
    static loadAccount(response,username, pwd, token = 'cookie_token') {
        storage.saveLoginToken(token);
        API.accountInfo().then((userInfo) => {
        if (userInfo.err) {
            alert(userInfo.err)
            storage.saveLoginToken('');
            return;
        }
        let data = userInfo["data"];
        if (!data) {
            dispatch(loginRetry(false));
            return;
        }
        
        let ac = data["accountInfo"];
        if (!ac) {
            alert('登录失败')
            storage.saveLoginToken('');
            return;
        }
        let gldAccountId = data["gldAccountId"];
        if (!gldAccountId) {
            gldAccountId = '0';
        }
        
        if(token) {
            storage.saveLoginToken(token,gldAccountId);
            storage.saveLoginUserName(username);
        } 
        storage.saveUserInfo(data);
        let um = new UserInfoManager();
        um.saveUserInfo(username,data)
        
        let tenantStr = storage.loadTenantId();
        let tenant = JSON.parse(tenantStr);
        let tenantid = null;
        if(tenant && tenant.value){
                tenantid = tenant.value.tenantId;
                API.setCurrentTenant(tenantid).then((responseData) => {
                    console.log('success-=--------------------------')
                    storage.setOfflineState(true);
                }).catch((e) => {
                storage.saveLastTenant('0');
                });
                return;
        }
        
        return;
        }).catch((e) => { 
        storage.saveLoginToken('');
        });
    }

    //设置为离线模式
    static toOffLine(){
        storage.setOfflineState(false);
    }

    //判断是否在线模式  true在线 false 离线
     static isOnLine(){
        let state = storage.getOfflineState();
        return state==true || state==undefined;
        // return true
    }

    //离线操作提示
    static showOfflineAlert(){
        if((!this.isOnLine()) && isShow){
           ActionModal.alert('提示信息', "当前为离线状态，网络恢复后，系统将自动为您提交当前单据，您无需再次操作。", [{ text: '知道了', style: { color: '#00baf3' } }]);
           isShow = false;
        }
   }
}


