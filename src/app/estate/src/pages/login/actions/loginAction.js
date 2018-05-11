import * as API from 'app-api';
import { SERVER_TYPE } from 'common-module';
import { NativeModules } from 'react-native';
import * as types from '../constants/loginTypes';

var RNBridgeModule = NativeModules.GLDRNBridgeModule; //你的类名

export function login(username, pwd) {
  if(SERVER_TYPE === "TEST") {
    return loginNew(username, pwd);
  } else {
    return loginOld(username, pwd);
  }
}

export function logout() {
  return dispatch => {
    dispatch(logoutSuccess())
  }
}

// 访问登录接口 根据返回结果来划分action属于哪个type,然后返回对象,给reducer处理
function loginOld(username, pwd) {
  return dispatch => {
    dispatch(isLogining(username))
    RNBridgeModule.RNInvokeOCCallBack(
      {
        caller: "soulrn",
        name: "clearCookie",
        ver: "1.0",
        data: { title: "登录", message: "是否确认登录？" }
      },
      (data, request) => {
        API.login(username, pwd).then((response) => {
          loadAccount(dispatch,response,username, pwd);
        }).catch((e) => {
          dispatch(loginError(false));
        });
      });
  };
}

// 访问登录接口 根据返回结果来划分action属于哪个type,然后返回对象,给reducer处理
function loginNew(username, pwd) {
  return dispatch => {
    dispatch(isLogining(username))

    API.authToken(username, pwd).then((response) => {
       console.log('response.data:'+response.data1);
      loadAccount(dispatch,response,username, pwd,response.data.access_token);
    }).catch((e) => {
      dispatch(loginError(false));
    });
  }
}
function loadAccount(dispatch,response,username, pwd, token = 'cookie_token') {
  storage.saveLoginToken(token);
  API.accountInfo().then((userInfo) => {
    if (userInfo.err) {
      dispatch(loginError(false));
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
      dispatch(loginError(false));
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
    let ret = storage.hasChoose();

    if (!ret) {
      dispatch(loginSuccessChoose(true, response.data, username))
      return;
    }
    let tenant = storage.loadLastTenant();
    if (tenant != '0') {
      API.setCurrentTenant(tenant).then((responseData) => {
        dispatch(loginSuccess(true, response.data, username))
      }).catch((e) => {
        storage.saveLastTenant('0');
        dispatch(loginError(false));
      });
    }
    dispatch(loginSuccess(true, response.data, username))
    return;
  }).catch((e) => { 
    dispatch(loginError(false));
    storage.saveLoginToken('');
  });
}

function logoutSuccess() {
  return {
    type: types.LOGIN_IN_INIT,
  }
}

function isLogining(userName) {
  return {
    type: types.LOGIN_IN_DOING,
    userName:userName,
  }
}

function loginSuccess(isSuccess, user, userName) {
  return {
    type: types.LOGIN_IN_DONE,
    user:user,
    userName:userName,
  }
}

function loginSuccessChoose(isSuccess, user, userName) {
  return {
    type: types.LOGIN_IN_DONE_CHOOSE,
    user:user,
    userName:userName,
  }
}

function loginError(isSuccess,message='登录失败') {
  return {
    type: types.LOGIN_IN_ERROR,
    message:message
  }
}

function loginRetry(isSuccess) {
  return {
    type: types.LOGIN_IN_RETRY,
  }
}
