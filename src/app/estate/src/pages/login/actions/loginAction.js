import * as API from 'app-api'

import * as types from '../constants/loginTypes'

import {NativeModules} from 'react-native'
var RNBridgeModule = NativeModules.GLDRNBridgeModule; //你的类名

export function login(username, pwd) {
  console.log("》》》》开始登录")
  return loginOld(username, pwd);
  // return loginNew(username, pwd);
}

export function logout() {
  console.log('退出登录方法')
  return dispatch => {
    dispatch(logoutSuccess())
  }
}

// 访问登录接口 根据返回结果来划分action属于哪个type,然后返回对象,给reducer处理
function loginOld(username, pwd) {
  return dispatch => {
    dispatch(isLogining())
    RNBridgeModule.RNInvokeOCCallBack(
      {
        caller: "gldrn",
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
    dispatch(isLogining())

    API.authToken(username, pwd).then((response) => {
      storage.saveLoginToken(response.data.access_token);
      loadAccount(dispatch,response,username, pwd);
    }).catch((e) => {
      dispatch(loginError(false));
    });
  }
}
function loadAccount(dispatch,response,username, pwd) {
  API.accountInfo().then((userInfo) => {
    console.log(userInfo);
    if (userInfo.err) {
      dispatch(loginError(false));
      return;
    }
    let data = userInfo["data"];
    if (!data) {
      dispatch(loginRetry(false));
      return;
    }
    storage.saveUserInfo(data);
    let ac = data["accountInfo"];
    if (!ac) {
      dispatch(loginError(false));
      return;
    }
    storage.hasChoose((ret) => {
      if (!ret) {
        dispatch(loginSuccessChoose(true, response.data))
        return;
      }
      storage.loadTenant((tenant) => {
        API.setCurrentTenant(tenant).then((responseData) => {
          dispatch(loginSuccess(true, response.data))
        });
      });
    });
  }).catch((e) => {
    dispatch(loginError(false));
  });
}

function logoutSuccess() {
  console.log('log success')
  return {
    type: types.LOGIN_IN_INIT,
  }
}

function isLogining() {
  return {
    type: types.LOGIN_IN_DOING,
  }
}

function loginSuccess(isSuccess, user) {
  console.log('success')
  return {
    type: types.LOGIN_IN_DONE,
    user,
  }
}

function loginSuccessChoose(isSuccess, user) {
  console.log('success')
  return {
    type: types.LOGIN_IN_DONE_CHOOSE,
    user,
  }
}

function loginError(isSuccess) {
  console.log('error')
  return {
    type: types.LOGIN_IN_ERROR,
  }
}

function loginRetry(isSuccess) {
  console.log('error')
  return {
    type: types.LOGIN_IN_RETRY,
  }
}
