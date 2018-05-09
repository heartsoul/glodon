import * as types from '../constants/forgotTypes' // 导入事件类别,用来做事件类别的判断

// 初始状态

const initialState = {
  status: '',
  isSuccess: true,
  page: 1,
  url:null,
  userName:'',
  verifyCode:'',
  signupKey:'',
  tip:null,
  type:null,
  errorCount:0,
}
// 不同类别的事件使用switch对应处理过程

export default function forgot(state = initialState, action) {
  switch (action.type) {
    case types.FORGOT_IMAGE_CODE:
      return {
        ...state,
        type:action.type,
        // status: '',
        url:action.url,
        signupKey:action.signupKey,
        // page: 1, 
        tip:null,
      }
      break
    case types.FORGOT_USER_CHECK:
      return {
        ...state,
        type:action.type,
        status: '',
        isSuccess: true,
        userName:action.userName,
        page: 1,
        tip:null,
        // errorCount:state.errorCount+1,
      }
      case types.FORGOT_PHONE_CODE:
      return {
        ...state,
        type:action.type,
        status: '',
        isSuccess: true,
        page: 2,
        userName:action.userName,
        verifyCode:'',
        tip:'手机验证码已经发送',
        errorCount:state.errorCount+1,
      }
    // break
    case types.FORGOT_ERROR:
      return {
        ...state,
        type:action.type,
        status: action.errorMessage,
        isSuccess: false,
        tip:null,
        statusCode:action.statusCode,
        errorCount:state.errorCount+1,
      }

    // break
    case types.FORGOT_PHONE_CODE_VERIFY:
      return {
        ...state,
        type:action.type,
        status: '',
        isSuccess: true,
        page:3,
        verifyCode:action.verifyCode,
        tip:null,
        errorCount:state.errorCount+1,
      }
    case types.FORGOT_RESET:
      return {
        ...state,
        type:action.type,
        status: '',
        isSuccess: true,
        tip:'修改成功',
        errorCount:state.errorCount+1,
      }
    case types.FORGOT_STEP:
      return {
        ...state,
        type:action.type,
        status: '',
        isSuccess: true,
        tip:null,
        page:action.page
      }
    // break
    default:
      return state
  }
}
