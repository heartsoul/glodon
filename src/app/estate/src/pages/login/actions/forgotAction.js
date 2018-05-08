import * as API from 'app-api'
import * as types from '../constants/forgotTypes'
import {NativeModules} from 'react-native'
export function gotoPage(page) {
  return dispatch => {
      dispatch(_page(page))
  }
}

export function imageCode() {
  return dispatch => {
    API.forgotCaptchaUrl().then((dataRet)=>{
      let {uri,signupKey} = dataRet;
     
      dispatch(_imageCode(uri,signupKey)) 
    }).catch((e) => {
      dispatch(_passwordError(e));
    })
  }
}
export function userCheck(username) {
  return dispatch => {
    API.forgotCheck(username).then((data)=>{
      let {success,statusCode,errorMessage} = data;
      if(success == true && statusCode == 200) {
        dispatch(_userCheck(username))
      } else {
        dispatch(_passwordError(null,statusCode,errorMessage));
      }
    }).catch((e) => {
      dispatch(_passwordError(e));
    })
  }
}

export function phoneCode(mobile,captcha,signupKey) {
  return dispatch => {
    API.forgotCode(mobile,captcha,signupKey).then((data)=>{
      let {success,statusCode,errorMessage} = data;
      if(success == true && statusCode == 200) {
        dispatch(_phoneCode(mobile))
      } else {
        dispatch(_passwordError(null,statusCode,errorMessage));
      }
    }).catch((e) => {
      dispatch(_passwordError(e));
    })
  }
}

export function phoneCodeVerify(mobile,verifyCode) {
  return dispatch => {
    API.forgotCodeVerify(mobile,verifyCode).then((data)=>{
      let {success,statusCode,errorMessage} = data;
      if(success == true && statusCode == 200) {
        dispatch(_phoneCodeVerify(verifyCode))
      } else {
        dispatch(_passwordError(null,statusCode,errorMessage));
      }
    }).catch((e) => {
      dispatch(_passwordError(e));
    })
  }
}

export function reset(mobile,verifyCode,pwd) {
  return dispatch => {
    API.forgotReset(mobile,verifyCode,pwd).then((data)=>{
      let {success,statusCode,errorMessage} = data;
      if(success == true && statusCode == 200) {
        dispatch(_reset())
      } else {
        dispatch(_passwordError(null,statusCode,errorMessage));
      }
    }).catch((e) => {
      dispatch(_passwordError(e));
    })
  }
}



function _imageCode(url,signupKey) {
  return {
    type: types.FORGOT_IMAGE_CODE,
    url:url,
    signupKey:signupKey
  }
}

function _userCheck(userName) {
  return {
    type: types.FORGOT_USER_CHECK,
    userName:userName
  }
}

function _phoneCode(mobile) {
  return {
    type: types.FORGOT_PHONE_CODE,
    userName:mobile
  }
}

function _phoneCodeVerify(verifyCode) {
  return {
    type: types.FORGOT_PHONE_CODE_VERIFY,
    verifyCode:verifyCode,
  }
}

function _passwordError(error,statusCode,errorMessage) {
  if(error) {
    return {
      type: types.FORGOT_ERROR,
      errorMessage:'请求出错',
    }
  }

  return {
    type: types.FORGOT_ERROR,
    statusCode:statusCode,
    errorMessage:errorMessage,
  }
  
}

function _reset() {
  return {
    type: types.FORGOT_RESET,
  }
}

function _page(page) {
  return {
    type: types.FORGOT_STEP,
    page:page
  }
}
